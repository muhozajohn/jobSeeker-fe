import { recruiterService } from "../../../services/recruiter/recruiterService";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RecruiterResponse, CreateRecruiterDto, RecruiterApiResponse, RecruiterUser } from "@/types/recruiter";
import { formatError } from "@/utils/errors";
import { AxiosError } from "axios";
import Toast from "@/components/Toasty";
import { RootState } from "../../store";

interface RecruiterState {
    recruiters: RecruiterResponse[];
    recruiter: RecruiterResponse | null;
    loading: boolean;
    error: string | null;
    count: number;
    stats: unknown;
}

interface GetAllResponse {
    rows: RecruiterResponse[];
    count: number;
}

const initialState: RecruiterState = {
    recruiters: [],
    recruiter: null,
    loading: false,
    error: null,
    count: 0,
    stats: null,
};

export const createRecruiter = createAsyncThunk<
    RecruiterResponse,  
    CreateRecruiterDto,
    { rejectValue: string }
>("recruiters/create", async (recruiterData, { rejectWithValue }) => {
    try {
        const response = await recruiterService.createRecruiter(recruiterData);
        Toast({
            message: "Recruiter created successfully",
            type: "success",
        });
        return response.data.data;  
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            const message = formatError(error.response?.data);
            Toast({
                message: message,
                type: "error",
            });
            return rejectWithValue(message);
        }
        Toast({ type: "error", message: "Unknown error occurred" });
        return rejectWithValue("Unknown error occurred");
    }
});

export const updateRecruiter = createAsyncThunk<
    RecruiterResponse,
    { id: number; data: Partial<RecruiterResponse> },
    { rejectValue: string }
>("recruiters/update", async ({ id, data }, { rejectWithValue }) => {
    try {
        const response = await recruiterService.updateRecruiter(id, data);
        Toast({
            message: "Recruiter updated successfully",
            type: "success",
        });
        return response.data.data;  // Access .data to get RecruiterResponse
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            const message = formatError(error.response?.data);
            Toast({
                message: message,
                type: "error",
            });
            return rejectWithValue(message);
        }
        Toast({ type: "error", message: "Unknown error occurred" });
        return rejectWithValue("Unknown error occurred");
    }
});

export const deleteRecruiter = createAsyncThunk<
    number,
    number,
    { rejectValue: string }
>("recruiters/delete", async (id, { rejectWithValue }) => {
    try {
        await recruiterService.deleteRecruiter(id);
        Toast({
            message: "Recruiter deleted successfully",
            type: "success",
            title: "Success"
        });
        return id;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            const message = formatError(error.response?.data);
            Toast({
                message: message,
                type: "error",
            });
            return rejectWithValue(message);
        }
        Toast({ type: "error", message: "Unknown error occurred" });
        return rejectWithValue("Unknown error occurred");
    }
});

export const getAllRecruiters = createAsyncThunk<
    GetAllResponse,
    Record<string, unknown> | undefined,
    { rejectValue: string }
>("recruiters/getAll", async (params = {}, { rejectWithValue }) => {
    try {
        const response = await recruiterService.getRecruiters(params);
        return {
            rows: response.data.data,  
            count: response.data.count
        };
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            const message = formatError(error.response?.data);
            return rejectWithValue(message);
        }
        return rejectWithValue("Unknown error occurred");
    }
});

export const getRecruiterById = createAsyncThunk<
    RecruiterResponse,
    number,
    { rejectValue: string }
>("recruiters/getById", async (id, { rejectWithValue }) => {
    try {
        const response = await recruiterService.getRecruiterById(id);
        return response.data.data;  
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            const message = formatError(error.response?.data);
            return rejectWithValue(message);
        }
        return rejectWithValue("Unknown error occurred");
    }
});

export const getRecruiterByUserId = createAsyncThunk<
    RecruiterResponse,
    number,
    { rejectValue: string }
>("recruiters/getByUserId", async (userId, { rejectWithValue }) => {
    try {
        const response = await recruiterService.getRecruiterByUserId(userId);
        return response.data.data;  
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            const message = formatError(error.response?.data);
            return rejectWithValue(message);
        }
        return rejectWithValue("Unknown error occurred");
    }
});

export const getRecruiterStats = createAsyncThunk<
    unknown,
    void,
    { rejectValue: string }
>("recruiters/getStats", async (_, { rejectWithValue }) => {
    try {
        const response = await recruiterService.getRecruiterStats();
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            const message = formatError(error.response?.data);
            return rejectWithValue(message);
        }
        return rejectWithValue("Unknown error occurred");
    }
});

export const verifyRecruiter = createAsyncThunk<
    RecruiterResponse,
    number,
    { rejectValue: string }
>("recruiters/verify", async (id, { rejectWithValue }) => {
    try {
        const response = await recruiterService.verifyRecruiter(id);
        Toast({
            message: "Recruiter verified successfully",
            type: "success",
        });
        return response.data.data;  
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            const message = formatError(error.response?.data);
            Toast({
                message: message,
                type: "error",
            });
            return rejectWithValue(message);
        }
        Toast({ type: "error", message: "Unknown error occurred" });
        return rejectWithValue("Unknown error occurred");
    }
});

export const unverifyRecruiter = createAsyncThunk<
    RecruiterResponse,
    number,
    { rejectValue: string }
>("recruiters/unverify", async (id, { rejectWithValue }) => {
    try {
        const response = await recruiterService.unverifyRecruiter(id);
        Toast({
            message: "Recruiter unverified successfully",
            type: "success",
        });
        return response.data 
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            const message = formatError(error.response?.data);
            Toast({
                message: message,
                type: "error",
            });
            return rejectWithValue(message);
        }
        Toast({ type: "error", message: "Unknown error occurred" });
        return rejectWithValue("Unknown error occurred");
    }
});

const recruiterSlice = createSlice({
    name: "recruiters",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Create recruiter
            .addCase(createRecruiter.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createRecruiter.fulfilled, (state, action: PayloadAction<RecruiterResponse>) => {
                state.loading = false;
                state.recruiters.push(action.payload);
            })
            .addCase(createRecruiter.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error occurred";
            })

            // Get all recruiters
            .addCase(getAllRecruiters.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllRecruiters.fulfilled, (state, action: PayloadAction<GetAllResponse>) => {
                state.loading = false;
                state.recruiters = action.payload.rows;
                state.count = action.payload.count;
            })
            .addCase(getAllRecruiters.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error occurred";
            })

            // Get recruiter by ID
            .addCase(getRecruiterById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getRecruiterById.fulfilled, (state, action: PayloadAction<RecruiterResponse>) => {
                state.loading = false;
                state.recruiter = action.payload;
            })
            .addCase(getRecruiterById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error occurred";
            })

            // Get recruiter by user ID
            .addCase(getRecruiterByUserId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getRecruiterByUserId.fulfilled, (state, action: PayloadAction<RecruiterResponse>) => {
                state.loading = false;
                state.recruiter = action.payload;
            })
            .addCase(getRecruiterByUserId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error occurred";
            })

            // Get recruiter stats
            .addCase(getRecruiterStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getRecruiterStats.fulfilled, (state, action: PayloadAction<unknown>) => {
                state.loading = false;
                state.stats = action.payload;
            })
            .addCase(getRecruiterStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error occurred";
            })

            // Update recruiter
            .addCase(updateRecruiter.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateRecruiter.fulfilled, (state, action: PayloadAction<RecruiterResponse>) => {
                state.loading = false;
                const index = state.recruiters.findIndex(
                    recruiter => recruiter.id === action.payload.id
                );
                if (index !== -1) {
                    state.recruiters[index] = action.payload;
                }
                if (state.recruiter?.id === action.payload.id) {
                    state.recruiter = action.payload;
                }
            })
            .addCase(updateRecruiter.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error occurred";
            })

            // Delete recruiter
            .addCase(deleteRecruiter.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteRecruiter.fulfilled, (state, action: PayloadAction<number>) => {
                state.loading = false;
                state.recruiters = state.recruiters.filter(
                    recruiter => recruiter.id !== action.payload
                );
                if (state.recruiter?.id === action.payload) {
                    state.recruiter = null;
                }
            })
            .addCase(deleteRecruiter.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error occurred";
            })

            // Verify recruiter
            .addCase(verifyRecruiter.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyRecruiter.fulfilled, (state, action: PayloadAction<RecruiterResponse>) => {
                state.loading = false;
                const index = state.recruiters.findIndex(
                    recruiter => recruiter.id === action.payload.id
                );
                if (index !== -1) {
                    state.recruiters[index] = action.payload;
                }
                if (state.recruiter?.id === action.payload.id) {
                    state.recruiter = action.payload;
                }
            })
            .addCase(verifyRecruiter.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error occurred";
            })

            // Unverify recruiter
            .addCase(unverifyRecruiter.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(unverifyRecruiter.fulfilled, (state, action: PayloadAction<RecruiterResponse>) => {
                state.loading = false;
                const index = state.recruiters.findIndex(
                    recruiter => recruiter.id === action.payload.id
                );
                if (index !== -1) {
                    state.recruiters[index] = action.payload;
                }
                if (state.recruiter?.id === action.payload.id) {
                    state.recruiter = action.payload;
                }
            })
            .addCase(unverifyRecruiter.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error occurred";
            });
    },
});

// Selectors
export const selectRecruiters = (state: RootState) => state.recruiters.recruiters;
export const selectRecruitersCount = (state: RootState) => state.recruiters.count;
export const selectRecruiter = (state: RootState) => state.recruiters.recruiter;
export const selectRecruiterStats = (state: RootState) => state.recruiters.stats;
export const selectRecruitersLoading = (state: RootState) => state.recruiters.loading;
export const selectRecruitersError = (state: RootState) => state.recruiters.error;

export default recruiterSlice.reducer;