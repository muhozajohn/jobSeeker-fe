import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { JobCategory, JobCategoryApiResponse, CreateJobCategoryDto, UpdateJobCategoryDto } from "@/types/JobCategories";
import { formatError } from "@/utils/errors";
import { AxiosError } from "axios";
import Toast from "@/components/Toasty";
import { RootState } from "../../store";
import { jobCategoryService } from "@/lib/services/JobCategories/JobCategories";

interface JobCategoryState {
    categories: JobCategory[];
    currentCategory: JobCategory | null;
    loading: boolean;
    error: string | null;
}

const initialState: JobCategoryState = {
    categories: [],
    currentCategory: null,
    loading: false,
    error: null,
};

export const createJobCategory = createAsyncThunk<
    JobCategory,
    CreateJobCategoryDto,
    { rejectValue: string }
>("jobCategories/create", async (categoryData, { rejectWithValue }) => {
    try {
        const response = await jobCategoryService.createJobCategory(categoryData);
        Toast({
            message: "Job category created successfully",
            type: "success",
        });
        return response.data.data as JobCategory;
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

export const getJobCategories = createAsyncThunk<
    JobCategory[],
    void,
    { rejectValue: string }
>("jobCategories/getAll", async (_, { rejectWithValue }) => {
    try {
        const response = await jobCategoryService.getJobCategories();
        return response.data.data as JobCategory[];
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            const message = formatError(error.response?.data);
            return rejectWithValue(message);
        }
        return rejectWithValue("Unknown error occurred");
    }
});

export const getJobCategoryById = createAsyncThunk<
    JobCategory,
    number,
    { rejectValue: string }
>("jobCategories/getById", async (id, { rejectWithValue }) => {
    try {
        const response = await jobCategoryService.getJobCategoryById(id);
        return response.data.data as JobCategory;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            const message = formatError(error.response?.data);
            return rejectWithValue(message);
        }
        return rejectWithValue("Unknown error occurred");
    }
});

export const updateJobCategory = createAsyncThunk<
    JobCategory,
    { id: number; data: UpdateJobCategoryDto },
    { rejectValue: string }
>("jobCategories/update", async ({ id, data }, { rejectWithValue }) => {
    try {
        const response = await jobCategoryService.updateJobCategory(id, data);
        Toast({
            message: "Job category updated successfully",
            type: "success",
        });
        return response.data.data as JobCategory;
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

export const deleteJobCategory = createAsyncThunk<
    number,
    number,
    { rejectValue: string }
>("jobCategories/delete", async (id, { rejectWithValue }) => {
    try {
        await jobCategoryService.deleteJobCategory(id);
        Toast({
            message: "Job category deleted successfully",
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

const jobCategorySlice = createSlice({
    name: "jobCategories",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Create job category
            .addCase(createJobCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createJobCategory.fulfilled, (state, action: PayloadAction<JobCategory>) => {
                state.loading = false;
                state.categories.push(action.payload);
            })
            .addCase(createJobCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error occurred";
            })

            // Get all job categories
            .addCase(getJobCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getJobCategories.fulfilled, (state, action: PayloadAction<JobCategory[]>) => {
                state.loading = false;
                state.categories = action.payload;
            })
            .addCase(getJobCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error occurred";
            })

            // Get job category by ID
            .addCase(getJobCategoryById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getJobCategoryById.fulfilled, (state, action: PayloadAction<JobCategory>) => {
                state.loading = false;
                state.currentCategory = action.payload;
            })
            .addCase(getJobCategoryById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error occurred";
            })

            // Update job category
            .addCase(updateJobCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateJobCategory.fulfilled, (state, action: PayloadAction<JobCategory>) => {
                state.loading = false;
                // Update in categories array
                const categoryIndex = state.categories.findIndex(category => category.id === action.payload.id);
                if (categoryIndex !== -1) {
                    state.categories[categoryIndex] = action.payload;
                }
                // Update current category if it's the one being updated
                if (state.currentCategory?.id === action.payload.id) {
                    state.currentCategory = action.payload;
                }
            })
            .addCase(updateJobCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error occurred";
            })

            // Delete job category
            .addCase(deleteJobCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteJobCategory.fulfilled, (state, action: PayloadAction<number>) => {
                state.loading = false;
                state.categories = state.categories.filter(category => category.id !== action.payload);
                if (state.currentCategory?.id === action.payload) {
                    state.currentCategory = null;
                }
            })
            .addCase(deleteJobCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error occurred";
            });
    },
});

// Selectors
export const selectJobCategories = (state: RootState) => state.jobCategories.categories;
export const selectCurrentJobCategory = (state: RootState) => state.jobCategories.currentCategory;
export const selectJobCategoriesLoading = (state: RootState) => state.jobCategories.loading;
export const selectJobCategoriesError = (state: RootState) => state.jobCategories.error;

export default jobCategorySlice.reducer;