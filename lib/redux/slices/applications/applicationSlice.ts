
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { formatError } from "@/utils/errors";
import { AxiosError } from "axios";
import Toast from "@/components/Toasty";
import { RootState } from "../../store";
import { applicationService } from "@/lib/services/applications/applications";
import { Application, CreateApplicationDto } from "@/types/application/application";

interface ApplicationState {
    applications: Application[];
    myApplications: Application[];
    currentApplication: Application | null;
    loading: boolean;
    error: string | null;
}

const initialState: ApplicationState = {
    applications: [],
    myApplications: [],
    currentApplication: null,
    loading: false,
    error: null,
};

export const createApplication = createAsyncThunk<
    Application,
    CreateApplicationDto,
    { rejectValue: string }
>("applications/create", async (applicationData, { rejectWithValue }) => {
    try {
        const response = await applicationService.createApplication(applicationData);
        if (!response.data.success) {
            const message = formatError(response.data);
            Toast({ message, type: "error" });
            return rejectWithValue(message);
        }

        Toast({
            message: "Application created successfully",
            type: "success",
        });
        return response.data.data; // Extract the actual application data
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

export const getApplications = createAsyncThunk<
    Application[],
    Record<string, unknown> | undefined,
    { rejectValue: string }
>("applications/getAll", async (params = {}, { rejectWithValue }) => {
    try {
        const response = await applicationService.getApplications(params);
        return response.data.data; // Extract the actual applications array
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            const message = formatError(error.response?.data);
            return rejectWithValue(message);
        }
        return rejectWithValue("Unknown error occurred");
    }
});

export const getMyApplications = createAsyncThunk<
    Application[],
    void,
    { rejectValue: string }
>("applications/getMyApplications", async (_, { rejectWithValue }) => {
    try {
        const response = await applicationService.getMyApplications();
        return response.data.data; // Extract the actual applications array
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            const message = formatError(error.response?.data);
            return rejectWithValue(message);
        }
        return rejectWithValue("Unknown error occurred");
    }
});

export const getApplicationById = createAsyncThunk<
    Application,
    number,
    { rejectValue: string }
>("applications/getById", async (id, { rejectWithValue }) => {
    try {
        const response = await applicationService.getApplicationById(id);
        return response.data.data; // Extract the actual application data
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            const message = formatError(error.response?.data);
            return rejectWithValue(message);
        }
        return rejectWithValue("Unknown error occurred");
    }
});

export const updateApplication = createAsyncThunk<
    Application,
    { id: number; data: CreateApplicationDto },
    { rejectValue: string }
>("applications/update", async ({ id, data }, { rejectWithValue }) => {
    try {
        const response = await applicationService.updateApplication(id, data);
        Toast({
            message: "Application updated successfully",
            type: "success",
        });
        return response.data.data; // Extract the actual application data
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

export const deleteApplication = createAsyncThunk<
    number,
    number,
    { rejectValue: string }
>("applications/delete", async (id, { rejectWithValue }) => {
    try {
        await applicationService.deleteApplication(id);
        Toast({
            message: "Application deleted successfully",
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

const applicationSlice = createSlice({
    name: "applications",
    initialState,
    reducers: {
        // Clear current application
        clearCurrentApplication: (state) => {
            state.currentApplication = null;
        },
        // Clear error
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Create application
            .addCase(createApplication.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createApplication.fulfilled, (state, action: PayloadAction<Application>) => {
                state.loading = false;
                state.applications.push(action.payload);
                state.myApplications.push(action.payload);
            })
            .addCase(createApplication.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error occurred";
            })

            // Get all applications
            .addCase(getApplications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getApplications.fulfilled, (state, action: PayloadAction<Application[]>) => {
                state.loading = false;
                state.applications = action.payload;
            })
            .addCase(getApplications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error occurred";
            })

            // Get my applications
            .addCase(getMyApplications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMyApplications.fulfilled, (state, action: PayloadAction<Application[]>) => {
                state.loading = false;
                state.myApplications = action.payload;
            })
            .addCase(getMyApplications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error occurred";
            })

            // Get application by ID
            .addCase(getApplicationById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getApplicationById.fulfilled, (state, action: PayloadAction<Application>) => {
                state.loading = false;
                state.currentApplication = action.payload;
            })
            .addCase(getApplicationById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error occurred";
            })

            // Update application
            .addCase(updateApplication.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateApplication.fulfilled, (state, action: PayloadAction<Application>) => {
                state.loading = false;
                // Update in applications array
                const applicationIndex = state.applications.findIndex(app => app.id === action.payload.id);
                if (applicationIndex !== -1) {
                    state.applications[applicationIndex] = action.payload;
                }
                // Update in myApplications array
                const myApplicationIndex = state.myApplications.findIndex(app => app.id === action.payload.id);
                if (myApplicationIndex !== -1) {
                    state.myApplications[myApplicationIndex] = action.payload;
                }
                // Update current application if it's the one being updated
                if (state.currentApplication?.id === action.payload.id) {
                    state.currentApplication = action.payload;
                }
            })
            .addCase(updateApplication.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error occurred";
            })

            // Delete application
            .addCase(deleteApplication.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteApplication.fulfilled, (state, action: PayloadAction<number>) => {
                state.loading = false;
                state.applications = state.applications.filter(app => app.id !== action.payload);
                state.myApplications = state.myApplications.filter(app => app.id !== action.payload);
                if (state.currentApplication?.id === action.payload) {
                    state.currentApplication = null;
                }
            })
            .addCase(deleteApplication.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error occurred";
            });
    },
});

// Actions
export const { clearCurrentApplication, clearError } = applicationSlice.actions;

// Selectors
export const selectApplications = (state: RootState) => state.applications.applications;
export const selectMyApplications = (state: RootState) => state.applications.myApplications;
export const selectCurrentApplication = (state: RootState) => state.applications.currentApplication;
export const selectApplicationsLoading = (state: RootState) => state.applications.loading;
export const selectApplicationsError = (state: RootState) => state.applications.error;

// Additional selectors
export const selectApplicationById = (state: RootState, id: number) =>     state.applications.applications.find(app => app.id === id);
export const selectApplicationsByStatus = (state: RootState, status: Application['status']) =>    state.applications.myApplications.filter(app => app.status === status);
export const selectPendingApplicationsCount = (state: RootState) =>    state.applications.myApplications.filter(app => app.status === 'PENDING').length;

export default applicationSlice.reducer;