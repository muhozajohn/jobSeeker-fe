
import authService from "../../../services/auth.service";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { CreateUserDto, GetSpecificUsersParams, GetUsersParams, Role, UpdateUserDto, User, UsersData, UsersResponse } from "@/types/users";
import { formatError } from "@/utils/errors";
import { AxiosError } from "axios";
import Toast from "@/components/Toasty";
import { RootState } from "../../store";

interface UserState {
  users: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  totalCount: number;
  page: number;
  pageSize: number;
}

const initialState: UserState = {
  users: [],
  currentUser: null,
  loading: false,
  error: null,
  totalCount: 0,
  page: 1,
  pageSize: 25,
};



export const fetchCurrentUser = createAsyncThunk(
  "users/currentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.myProfile();
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const message = formatError(error.response?.data);
        Toast({ message, type: "error" });
        return rejectWithValue(message);
      }
      Toast({ type: "error", message: "Unknown error occurred" });
      return rejectWithValue("Unknown error occurred");
    }
  }
);

export const createUser = createAsyncThunk( 
  "users/create", 
  async (userData: CreateUserDto, { rejectWithValue }) => { 
    try { 
      const response = await authService.createUser(userData); 
      
      // Check if the response indicates failure
      if (!response.data.success) {
        const message = formatError(response.data);
        Toast({ message, type: "error" }); 
        return rejectWithValue(message);
      }
      
      Toast({ message: "User created successfully", type: "success" }); 
      return response.data.data; 
    } catch (error: unknown) { 
      if (error instanceof AxiosError) { 
        const message = formatError(error.response?.data); 
        Toast({ message, type: "error" }); 
        return rejectWithValue(message); 
      } 
      Toast({ type: "error", message: "Unknown error occurred" }); 
      return rejectWithValue("Unknown error occurred"); 
    } 
  } 
);

export const fetchUsers = createAsyncThunk(
  "users/fetchAll",
  async (params: GetUsersParams | undefined, { rejectWithValue }) => {
    try {
      const response = await authService.getUsers(params);
      console.log("All Users", response.data.data.users);
      return response.data as UsersResponse;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const message = formatError(error.response?.data);
        return rejectWithValue(message);
      }
      return rejectWithValue("Unknown error occurred");
    }
  }
);

export const fetchRecruiters = createAsyncThunk(
  "users/fetchRecruiters",
  async (params: GetSpecificUsersParams | undefined, { rejectWithValue }) => {
    try {
      const response = await authService.getRecruiters(params);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const message = formatError(error.response?.data);
        return rejectWithValue(message);
      }
      return rejectWithValue("Unknown error occurred");
    }
  }
);

export const fetchWorkers = createAsyncThunk(
  "users/fetchWorkers",
  async (params: GetSpecificUsersParams | undefined, { rejectWithValue }) => {
    try {
      const response = await authService.getWorkers(params);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const message = formatError(error.response?.data);
        return rejectWithValue(message);
      }
      return rejectWithValue("Unknown error occurred");
    }
  }
);

export const fetchUserById = createAsyncThunk(
  "users/fetchById",
  async ({ id, includeRelations }: { id: number; includeRelations?: boolean }, { rejectWithValue }) => {
    try {
      const response = await authService.getUserById(id, includeRelations);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const message = formatError(error.response?.data);
        Toast({ message, type: "error" });
        return rejectWithValue(message);
      }
      Toast({ type: "error", message: "Unknown error occurred" });
      return rejectWithValue("Unknown error occurred");
    }
  }
);

export const updateUser = createAsyncThunk(
  "users/update",
  async ({ id, userData, avatar }: { id: number; userData: UpdateUserDto; avatar?: File }, { rejectWithValue }) => {
    try {
      const response = await authService.updateUser(id, userData, avatar);
         // Check if the response indicates failure
      if (!response.data.success) {
        const message = formatError(response.data);
        Toast({ message, type: "error" }); 
        return rejectWithValue(message);
      }
      Toast({ message: "User updated successfully", type: "success" });
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const message = formatError(error.response?.data);
        Toast({ message, type: "error" });
        return rejectWithValue(message);
      }
      Toast({ type: "error", message: "Unknown error occurred" });
      return rejectWithValue("Unknown error occurred");
    }
  }
);
export const updateUserAvatar = createAsyncThunk(
  "users/updateAvatar",
  async ({ id, avatar }: { id: number;  avatar?: File }, { rejectWithValue }) => {
    try {
      if (!avatar) {
        const message = "Avatar file is required";
        Toast({ message, type: "error" });
        return rejectWithValue(message);
      }
      const response = await authService.updateUserAvatar(id, avatar);
         // Check if the response indicates failure
      if (!response.data.success) {
        const message = formatError(response.data);
        Toast({ message, type: "error" }); 
        return rejectWithValue(message);
      }
      Toast({ message: "Avatar updated successfully", type: "success" });
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const message = formatError(error.response?.data);
        Toast({ message, type: "error" });
        return rejectWithValue(message);
      }
      Toast({ type: "error", message: "Unknown error occurred" });
      return rejectWithValue("Unknown error occurred");
    }
  }
);



export const updateUserRole = createAsyncThunk(
  "users/updateRole",
  async ({ id, role }: { id: number; role: Role }, { rejectWithValue }) => {
    try {
      const response = await authService.updateUserRole(id, role);
         // Check if the response indicates failure
      if (!response.data.success) {
        const message = formatError(response.data);
        Toast({ message, type: "error" }); 
        return rejectWithValue(message);
      }
      Toast({ message: "User role updated successfully", type: "success" });
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const message = formatError(error.response?.data);
        Toast({ message, type: "error" });
        return rejectWithValue(message);
      }
      Toast({ type: "error", message: "Unknown error occurred" });
      return rejectWithValue("Unknown error occurred");
    }
  }
);

export const toggleUserStatus = createAsyncThunk(
  "users/toggleStatus",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await authService.toggleUserStatus(id);
      const message = response.data.isActive 
        ? "User activated successfully" 
        : "User deactivated successfully";
      // Check if the response indicates failure
      if (!response.data.success) {
        const message = formatError(response.data);
        Toast({ message, type: "error" }); 
        return rejectWithValue(message);
      }
      Toast({ message, type: "success" });
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const message = formatError(error.response?.data);
        Toast({ message, type: "error" });
        return rejectWithValue(message);
      }
      Toast({ type: "error", message: "Unknown error occurred" });
      return rejectWithValue("Unknown error occurred");
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      await authService.deleteUser(id);
      
      Toast({ message: "User deleted successfully", type: "success" });
      return id;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const message = formatError(error.response?.data);
        Toast({ message, type: "error" });
        return rejectWithValue(message);
      }
      Toast({ type: "error", message: "Unknown error occurred" });
      return rejectWithValue("Unknown error occurred");
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
    setUsersPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setUsersPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder

      // Fetch Current User
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create User
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.users.unshift(action.payload);
        state.totalCount += 1;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<UsersResponse>) => {
        state.loading = false;
        state.users = action.payload.data.users;
        state.totalCount = action.payload.data.totalCount;
        state.page = action.payload.data.page;
        state.pageSize = action.payload.data.pageSize;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Recruiters
      .addCase(fetchRecruiters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecruiters.fulfilled, (state, action: PayloadAction<UsersData>) => {
        state.loading = false;
        state.users = action.payload.users;
        state.totalCount = action.payload.totalCount;
        state.page = action.payload.page;
        state.pageSize = action.payload.pageSize;
      })
      .addCase(fetchRecruiters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Workers
      .addCase(fetchWorkers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkers.fulfilled, (state, action: PayloadAction<UsersData>) => {
        state.loading = false;
        state.users = action.payload.users;
        state.totalCount = action.payload.totalCount;
        state.page = action.payload.page;
        state.pageSize = action.payload.pageSize;
      })
      .addCase(fetchWorkers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch User by ID
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        // Update the user in the list if exists, or add to the list
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        } else {
          state.users.push(action.payload);
        }
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update User
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        // Update current user if it's the same user
        if (state.currentUser?.id === action.payload.id) {
          state.currentUser = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update updateUserAvatar
      .addCase(updateUserAvatar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserAvatar.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        // Update current user if it's the same user
        if (state.currentUser?.id === action.payload.id) {
          state.currentUser = action.payload;
        }
      })
      .addCase(updateUserAvatar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update User Role
      .addCase(updateUserRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserRole.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Toggle User Status
      .addCase(toggleUserStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleUserStatus.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(toggleUserStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.users = state.users.filter(user => user.id !== action.payload);
        state.totalCount -= 1;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Actions
export const { clearCurrentUser, setUsersPage, setUsersPageSize } = userSlice.actions;

// Selectors
export const selectUsers = (state: RootState) => state.users.users;
export const selectWorkers = (state: RootState) => state.users.users;
export const selectRecruiters = (state: RootState) => state.users.users;
export const selectCurrentUser = (state: RootState) => state.users.currentUser;
export const selectUsersLoading = (state: RootState) => state.users.loading;
export const selectUsersError = (state: RootState) => state.users.error;
export const selectUsersTotalCount = (state: RootState) => state.users.totalCount;
export const selectUsersPage = (state: RootState) => state.users.page;
export const selectUsersPageSize = (state: RootState) => state.users.pageSize;

export default userSlice.reducer;