import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import authService from "@/lib/services/auth.service";
import { formatError } from "@/utils/errors";
import { LoginDto, UserProfileResponse } from "@/types/users";

// ========== Type Definitions ==========
interface User {
  id: string;
  email: string;
  name?: string;
  role?: 'ADMIN' | 'RECRUITER' | 'WORKER';
}

interface DecodedToken {
  id: number;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

interface AuthTokens {
  accessToken: string | null;
  refreshToken: string | null;
}

interface AuthState {
  user: User | null;
  me: UserProfileResponse | null;
  tokens: AuthTokens;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  passwordSetSuccess: boolean;
  loginAttempts: number;
  lastLoginAttempt: number | null;
}

// ========== Helper Functions ==========
const decodeJWT = (token: string): DecodedToken | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

export const getUserFromToken = (token: string): User | null => {
  const decoded = decodeJWT(token);
  return decoded ? {
    id: decoded.id.toString(),
    email: decoded.email,
    role: decoded.role as 'ADMIN' | 'RECRUITER' | 'WORKER',
  } : null;
};

const isTokenExpired = (token: string): boolean => {
  const decoded = decodeJWT(token);
  if (!decoded) return true;
  return decoded.exp < Math.floor(Date.now() / 1000);
};

// ========== Storage Functions ==========
const getStoredAuthData = (): { token: string | null, user: User | null } => {
  if (typeof window === "undefined") return { token: null, user: null };

  const token = localStorage.getItem("token");
  if (!token || isTokenExpired(token)) {
    clearStoredAuth();
    return { token: null, user: null };
  }

  const user = getUserFromToken(token);
  return { token, user };
};

const clearStoredAuth = (): void => {
  if (typeof window === "undefined") return;
  localStorage.clear();
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

const storeAuthData = (token: string): User | null => {
  if (typeof window === "undefined") return null;

  const user = getUserFromToken(token);
  if (user) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  }
  return user;
};

// ========== Initial State ==========
const storedAuth = getStoredAuthData();

const initialState: AuthState = {
  user: storedAuth.user,
  me: null,
  tokens: {
    accessToken: storedAuth.token,
    refreshToken: null,
  },
  loading: false,
  error: null,
  isAuthenticated: !!storedAuth.token,
  passwordSetSuccess: false,
  loginAttempts: 0,
  lastLoginAttempt: null,
};

// ========== Async Thunks ==========
export const loginUser = createAsyncThunk<
  { token: string; user: User },
  LoginDto,
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await authService.Login(credentials);

    if (!response.data.success || response.data.statusCode !== 200) {
      return rejectWithValue(response.data.message || "Login failed");
    }

    const token = response.data.data;
    const user = getUserFromToken(token);

    if (!user || !user.role) {
      return rejectWithValue("Invalid user data in token");
    }

    storeAuthData(token);
    return { token, user };
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(formatError(error.response?.data));
    }
    return rejectWithValue("An unexpected error occurred during login");
  }
});

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      if (typeof window !== "undefined") {
        // Clear all localStorage items
        localStorage.clear();
      }
      clearStoredAuth();
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(formatError(error.response?.data));
      }
      return rejectWithValue("Logout failed");
    } finally {
      clearStoredAuth();
    }
  }
);

export const validateToken = createAsyncThunk<
  { token: string; user: User },
  void,
  { rejectValue: string }
>("auth/validateToken", async (_, { rejectWithValue }) => {
  const { token } = getStoredAuthData();

  if (!token) {
    return rejectWithValue("No token found");
  }

  const user = getUserFromToken(token);
  if (!user) {
    return rejectWithValue("Invalid token");
  }

  return { token, user };
});


export const GetMe = createAsyncThunk<
  UserProfileResponse,
  void,
  { rejectValue: string }
>("recruiters/getByUserId", async (_, { rejectWithValue }) => {
  try {
    const response = await authService.myProfile()
    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const message = formatError(error.response?.data);
      return rejectWithValue(message);
    }
    return rejectWithValue("Unknown error occurred");
  }
});

// ========== Slice Definition ==========
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetPasswordSetSuccess: (state) => {
      state.passwordSetSuccess = false;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(state.user));
        }
      }
    },
    clearAuthState: (state) => {
      Object.assign(state, {
        ...initialState,
        tokens: { accessToken: null, refreshToken: null },
      });
      clearStoredAuth();
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.lastLoginAttempt = Date.now();
      })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.user;
        state.tokens.accessToken = payload.token;
        state.isAuthenticated = true;
        state.error = null;
        state.loginAttempts = 0;
      })
      .addCase(loginUser.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload || "Login failed";
        state.isAuthenticated = false;
        state.user = null;
        state.tokens.accessToken = null;
        state.loginAttempts += 1;
      })

      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        Object.assign(state, {
          ...initialState,
          tokens: { accessToken: null, refreshToken: null },
        });
      })
      .addCase(logoutUser.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload || "Logout failed";
        // Still clear auth state even if logout failed
        Object.assign(state, {
          ...initialState,
          tokens: { accessToken: null, refreshToken: null },
        });
      })

      // Get me
      .addCase(GetMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetMe.fulfilled, (state, action: PayloadAction<UserProfileResponse>) => {
        state.loading = false;
        state.me = action.payload;
      })
      .addCase(GetMe.rejected, (state, action) => {
        state.loading = false;

      })

      // Validate Token
      .addCase(validateToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(validateToken.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.user;
        state.tokens.accessToken = payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(validateToken.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload || "Token validation failed";
        state.user = null;
        state.tokens.accessToken = null;
        state.isAuthenticated = false;
      });
  },
});

// ========== Exports ==========
export const {
  clearError,
  resetPasswordSetSuccess,
  updateUser,
  clearAuthState,
} = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectMyProfile = (state: { auth: AuthState }) => state.auth.me;
export const selectUserRole = (state: { auth: AuthState }) => state.auth.user?.role;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.loading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectAccessToken = (state: { auth: AuthState }) => state.auth.tokens.accessToken;
export const selectPasswordSetSuccess = (state: { auth: AuthState }) => state.auth.passwordSetSuccess;