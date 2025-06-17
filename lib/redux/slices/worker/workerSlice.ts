import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { WorkerResponse, CreateOrUpdateWorkerDto, Worker } from "@/types/worker";
import { formatError } from "@/utils/errors";
import { AxiosError } from "axios";
import Toast from "@/components/Toasty";
import { RootState } from "../../store";
import { workerService } from "@/lib/services/worker/worker";

interface WorkerState {
    workers: Worker[];
    myWorkerProfile: Worker | null;
    currentWorker: Worker | null;
    loading: boolean;
    error: string | null;
}

const initialState: WorkerState = {
    workers: [],
    myWorkerProfile: null,
    currentWorker: null,
    loading: false,
    error: null,
};

export const createWorker = createAsyncThunk<
    Worker,
    CreateOrUpdateWorkerDto,
    { rejectValue: string }
>("worker/create", async (workerData, { rejectWithValue }) => {
    try {
        const response = await workerService.createWorker(workerData);
        if (!response.data.success) {
            const message = formatError(response.data);
            Toast({ message, type: "error" });
            return rejectWithValue(message);
        }

        Toast({
            message: "Worker profile created successfully",
            type: "success",
        });
        return response.data.data[0] as Worker;
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

export const getWorkers = createAsyncThunk<
    Worker[],
    void,
    { rejectValue: string }
>("worker/getAll", async (_, { rejectWithValue }) => {
    try {
        const response = await workerService.getWorkers();
        return response.data.data as Worker[];
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            const message = formatError(error.response?.data);
            return rejectWithValue(message);
        }
        return rejectWithValue("Unknown error occurred");
    }
});

export const getMyWorkerProfile = createAsyncThunk<
    Worker,
    void,
    { rejectValue: string }
>("worker/getMyProfile", async (_, { rejectWithValue }) => {
    try {
        const response = await workerService.getMyWorkerProfile();
        return response.data.data[0] as Worker;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            const message = formatError(error.response?.data);
            return rejectWithValue(message);
        }
        return rejectWithValue("Unknown error occurred");
    }
});

export const updateMyWorkerProfile = createAsyncThunk<
    Worker,
    CreateOrUpdateWorkerDto,
    { rejectValue: string }
>("worker/updateMyProfile", async (workerData, { rejectWithValue }) => {
    try {
        const response = await workerService.updateMyWorkerProfile(workerData);
        Toast({
            message: "Worker profile updated successfully",
            type: "success",
        });
        return response.data.data[0] as Worker;
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

export const getWorkerById = createAsyncThunk<
    Worker,
    number,
    { rejectValue: string }
>("worker/getById", async (id, { rejectWithValue }) => {
    try {
        const response = await workerService.getWorkerById(id);
        return response.data.data[0] as Worker;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            const message = formatError(error.response?.data);
            return rejectWithValue(message);
        }
        return rejectWithValue("Unknown error occurred");
    }
});

export const updateWorkerById = createAsyncThunk<
    Worker,
    { id: number; data: CreateOrUpdateWorkerDto },
    { rejectValue: string }
>("worker/updateById", async ({ id, data }, { rejectWithValue }) => {
    try {
        const response = await workerService.updateWorkerById(id, data);
        Toast({
            message: "Worker profile updated successfully",
            type: "success",
        });
        return response.data.data[0] as Worker;
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

export const deleteWorkerById = createAsyncThunk<
    number,
    number,
    { rejectValue: string }
>("worker/deleteById", async (id, { rejectWithValue }) => {
    try {
        await workerService.deleteWorkerById(id);
        Toast({
            message: "Worker profile deleted successfully",
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

export const toggleMyAvailability = createAsyncThunk<
    Worker,
    void,
    { rejectValue: string }
>("worker/toggleAvailability", async (_, { rejectWithValue }) => {
    try {
        const response = await workerService.toggleMyAvailability();
        Toast({
            message: "Availability status updated successfully",
            type: "success",
        });
        return response.data.data[0] as Worker;
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

const workerSlice = createSlice({
    name: "worker",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Create worker
            .addCase(createWorker.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createWorker.fulfilled, (state, action: PayloadAction<Worker>) => {
                state.loading = false;
                state.workers.push(action.payload);
                state.myWorkerProfile = action.payload;
            })
            .addCase(createWorker.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error occurred";
            })

            // Get all workers
            .addCase(getWorkers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getWorkers.fulfilled, (state, action: PayloadAction<Worker[]>) => {
                state.loading = false;
                state.workers = action.payload;
            })
            .addCase(getWorkers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error occurred";
            })

            // Get my worker profile
            .addCase(getMyWorkerProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMyWorkerProfile.fulfilled, (state, action: PayloadAction<Worker>) => {
                state.loading = false;
                state.myWorkerProfile = action.payload;
            })
            .addCase(getMyWorkerProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error occurred";
            })

            // Update my worker profile
            .addCase(updateMyWorkerProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateMyWorkerProfile.fulfilled, (state, action: PayloadAction<Worker>) => {
                state.loading = false;
                // Update my profile
                state.myWorkerProfile = action.payload;
                // Update in workers list if present
                const index = state.workers.findIndex(w => w.id === action.payload.id);
                if (index !== -1) {
                    state.workers[index] = action.payload;
                }
            })
            .addCase(updateMyWorkerProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error occurred";
            })

            // Get worker by ID
            .addCase(getWorkerById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getWorkerById.fulfilled, (state, action: PayloadAction<Worker>) => {
                state.loading = false;
                state.currentWorker = action.payload;
            })
            .addCase(getWorkerById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error occurred";
            })

            // Update worker by ID
            .addCase(updateWorkerById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateWorkerById.fulfilled, (state, action: PayloadAction<Worker>) => {
                state.loading = false;
                // Update in workers array
                const workerIndex = state.workers.findIndex(w => w.id === action.payload.id);
                if (workerIndex !== -1) {
                    state.workers[workerIndex] = action.payload;
                }
                // Update current worker if it's the one being updated
                if (state.currentWorker?.id === action.payload.id) {
                    state.currentWorker = action.payload;
                }
                // Update my profile if it's the one being updated
                if (state.myWorkerProfile?.id === action.payload.id) {
                    state.myWorkerProfile = action.payload;
                }
            })
            .addCase(updateWorkerById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error occurred";
            })

            // Delete worker by ID
            .addCase(deleteWorkerById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteWorkerById.fulfilled, (state, action: PayloadAction<number>) => {
                state.loading = false;
                state.workers = state.workers.filter(w => w.id !== action.payload);
                if (state.currentWorker?.id === action.payload) {
                    state.currentWorker = null;
                }
                if (state.myWorkerProfile?.id === action.payload) {
                    state.myWorkerProfile = null;
                }
            })
            .addCase(deleteWorkerById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error occurred";
            })

            // Toggle availability
            .addCase(toggleMyAvailability.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(toggleMyAvailability.fulfilled, (state, action: PayloadAction<Worker>) => {
                state.loading = false;
                // Update my profile
                if (state.myWorkerProfile) {
                    state.myWorkerProfile.available = action.payload.available;
                }
                // Update in workers list if present
                const index = state.workers.findIndex(w => w.id === action.payload.id);
                if (index !== -1) {
                    state.workers[index].available = action.payload.available;
                }
            })
            .addCase(toggleMyAvailability.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error occurred";
            });
    },
});

// Selectors
export const selectWorkers = (state: RootState) => state.worker.workers;
export const selectMyWorkerProfile = (state: RootState) => state.worker.myWorkerProfile;
export const selectCurrentWorker = (state: RootState) => state.worker.currentWorker;
export const selectWorkerLoading = (state: RootState) => state.worker.loading;
export const selectWorkerError = (state: RootState) => state.worker.error;

export default workerSlice.reducer;