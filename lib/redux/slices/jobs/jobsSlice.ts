
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { JobResponse, JobApiResponse, CreateJobDto, UpdateJobDto } from "@/types/jobs";
import { formatError } from "@/utils/errors";
import { AxiosError } from "axios";
import Toast from "@/components/Toasty";
import { RootState } from "../../store";
import { jobService } from "@/lib/services/jobs/jobsService";

interface JobState {
    jobs: JobResponse[];
    myJobs: JobResponse[];
    currentJob: JobResponse | null;
    loading: boolean;
    error: string | null;
}

const initialState: JobState = {
    jobs: [],
    myJobs: [],
    currentJob: null,
    loading: false,
    error: null,
};

export const createJob = createAsyncThunk<
    JobResponse,
    CreateJobDto,
    { rejectValue: string }
>("jobs/create", async (jobData, { rejectWithValue }) => {
    try {
        const response = await jobService.createJob(jobData);
        if (!response.data.success) {
            const message = formatError(response.data);
            Toast({ message, type: "error" });
            return rejectWithValue(message);
        }

        Toast({
            message: "Job created successfully",
            type: "success",
        });
        return response.data.data as JobResponse;
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

export const getJobs = createAsyncThunk<
    JobResponse[],
    Record<string, unknown> | undefined,
    { rejectValue: string }
>("jobs/getAll", async (params = {}, { rejectWithValue }) => {
    try {
        const response = await jobService.getJobs(params);
        return response.data.data as JobResponse[];
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            const message = formatError(error.response?.data);
            return rejectWithValue(message);
        }
        return rejectWithValue("Unknown error occurred");
    }
});

export const getMyJobs = createAsyncThunk<
    JobResponse[],
    void,
    { rejectValue: string }
>("jobs/getMyJobs", async (_, { rejectWithValue }) => {
    try {
        const response = await jobService.getMyJobs();
        return response.data.data as JobResponse[];
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            const message = formatError(error.response?.data);
            return rejectWithValue(message);
        }
        return rejectWithValue("Unknown error occurred");
    }
});

export const getJobById = createAsyncThunk<
    JobResponse,
    number,
    { rejectValue: string }
>("jobs/getById", async (id, { rejectWithValue }) => {
    try {
        const response = await jobService.getJobById(id);
        return response.data.data as JobResponse;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            const message = formatError(error.response?.data);
            return rejectWithValue(message);
        }
        return rejectWithValue("Unknown error occurred");
    }
});

export const updateJob = createAsyncThunk<
    JobResponse,
    { id: number; data: UpdateJobDto },
    { rejectValue: string }
>("jobs/update", async ({ id, data }, { rejectWithValue }) => {
    try {
        const response = await jobService.updateJob(id, data);
        Toast({
            message: "Job updated successfully",
            type: "success",
        });
        return response.data.data as JobResponse;
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

export const deleteJob = createAsyncThunk<
    number,
    number,
    { rejectValue: string }
>("jobs/delete", async (id, { rejectWithValue }) => {
    try {
        await jobService.deleteJob(id);
        Toast({
            message: "Job deleted successfully",
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

export const toggleJobActive = createAsyncThunk<
    JobResponse,
    number,
    { rejectValue: string }
>("jobs/toggleActive", async (id, { rejectWithValue }) => {
    try {
        const response = await jobService.toggleJobActive(id);
        Toast({
            message: "Job status updated successfully",
            type: "success",
        });
        return response.data.data as JobResponse;
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

const jobSlice = createSlice({
    name: "jobs",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Create job
            .addCase(createJob.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createJob.fulfilled, (state, action: PayloadAction<JobResponse>) => {
                state.loading = false;
                state.jobs.push(action.payload);
                state.myJobs.push(action.payload);
            })
            .addCase(createJob.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error occurred";
            })

            // Get all jobs
            .addCase(getJobs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getJobs.fulfilled, (state, action: PayloadAction<JobResponse[]>) => {
                state.loading = false;
                state.jobs = action.payload;
            })
            .addCase(getJobs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error occurred";
            })

            // Get my jobs
            .addCase(getMyJobs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMyJobs.fulfilled, (state, action: PayloadAction<JobResponse[]>) => {
                state.loading = false;
                state.myJobs = action.payload;
            })
            .addCase(getMyJobs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error occurred";
            })

            // Get job by ID
            .addCase(getJobById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getJobById.fulfilled, (state, action: PayloadAction<JobResponse>) => {
                state.loading = false;
                state.currentJob = action.payload;
            })
            .addCase(getJobById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error occurred";
            })

            // Update job
            .addCase(updateJob.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateJob.fulfilled, (state, action: PayloadAction<JobResponse>) => {
                state.loading = false;
                // Update in jobs array
                const jobIndex = state.jobs.findIndex(job => job.id === action.payload.id);
                if (jobIndex !== -1) {
                    state.jobs[jobIndex] = action.payload;
                }
                // Update in myJobs array
                const myJobIndex = state.myJobs.findIndex(job => job.id === action.payload.id);
                if (myJobIndex !== -1) {
                    state.myJobs[myJobIndex] = action.payload;
                }
                // Update current job if it's the one being updated
                if (state.currentJob?.id === action.payload.id) {
                    state.currentJob = action.payload;
                }
            })
            .addCase(updateJob.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error occurred";
            })

            // Delete job
            .addCase(deleteJob.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteJob.fulfilled, (state, action: PayloadAction<number>) => {
                state.loading = false;
                state.jobs = state.jobs.filter(job => job.id !== action.payload);
                state.myJobs = state.myJobs.filter(job => job.id !== action.payload);
                if (state.currentJob?.id === action.payload) {
                    state.currentJob = null;
                }
            })
            .addCase(deleteJob.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error occurred";
            })

            // Toggle job active status
            .addCase(toggleJobActive.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(toggleJobActive.fulfilled, (state, action: PayloadAction<JobResponse>) => {
                state.loading = false;
                // Update in jobs array
                const jobIndex = state.jobs.findIndex(job => job.id === action.payload.id);
                if (jobIndex !== -1) {
                    state.jobs[jobIndex] = action.payload;
                }
                // Update in myJobs array
                const myJobIndex = state.myJobs.findIndex(job => job.id === action.payload.id);
                if (myJobIndex !== -1) {
                    state.myJobs[myJobIndex] = action.payload;
                }
                // Update current job if it's the one being updated
                if (state.currentJob?.id === action.payload.id) {
                    state.currentJob = action.payload;
                }
            })
            .addCase(toggleJobActive.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error occurred";
            });
    },
});

// Selectors
export const selectJobs = (state: RootState) => state.jobs.jobs;
export const selectMyJobs = (state: RootState) => state.jobs.myJobs;
export const selectCurrentJob = (state: RootState) => state.jobs.currentJob;
export const selectJobsLoading = (state: RootState) => state.jobs.loading;
export const selectJobsError = (state: RootState) => state.jobs.error;

export default jobSlice.reducer;