import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { formatError } from "@/utils/errors";
import { AxiosError } from "axios";
import Toast from "@/components/Toasty";
import { RootState } from "../../store";
import { workAssignmentService } from "@/lib/services/assignments/assignments";
import {
  CreateWorkAssignmentDto,
  UpdateWorkAssignmentDto,
  UpdateWorkAssignmentStatusDto,
  WorkAssignmentListResponse,
  SingleWorkAssignmentResponse,
  WorkAssignmentResponse,
  WorkAssignmentStatus
} from "@/types/workerAssignment/assignment";

interface WorkAssignmentState {
  assignments: WorkAssignmentResponse[];
  workerAssignments: WorkAssignmentResponse[];
  jobAssignments: WorkAssignmentResponse[];
  recruiterAssignments: WorkAssignmentResponse[];
  currentAssignment: WorkAssignmentResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: WorkAssignmentState = {
  assignments: [],
  workerAssignments: [],
  jobAssignments: [],
  recruiterAssignments: [],
  currentAssignment: null,
  loading: false,
  error: null,
};

// Create Work Assignment
export const createWorkAssignment = createAsyncThunk<
  WorkAssignmentResponse,
  CreateWorkAssignmentDto,
  { rejectValue: string }
>("workAssignments/create", async (assignmentData, { rejectWithValue }) => {
  try {
    const response = await workAssignmentService.createWorkAssignment(assignmentData);
    if (!response.data.success) {
      const message = formatError(response.data);
      Toast({ message, type: "error" });
      return rejectWithValue(message);
    }

    Toast({
      message: "Work assignment created successfully",
      type: "success",
    });
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
});

// Get All Work Assignments
export const getWorkAssignments = createAsyncThunk<
  WorkAssignmentResponse[],
  Record<string, unknown> | undefined,
  { rejectValue: string }
>("workAssignments/getAll", async (params = {}, { rejectWithValue }) => {
  try {
    const response = await workAssignmentService.getWorkAssignments(params);
    console.log((response.data.data));
    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const message = formatError(error.response?.data);
      return rejectWithValue(message);
    }
    return rejectWithValue("Unknown error occurred");
  }
});

// Get Work Assignment by ID
export const getWorkAssignmentById = createAsyncThunk<
  WorkAssignmentResponse,
  number,
  { rejectValue: string }
>("workAssignments/getById", async (id, { rejectWithValue }) => {
  try {
    const response = await workAssignmentService.getWorkAssignmentById(id);
    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const message = formatError(error.response?.data);
      return rejectWithValue(message);
    }
    return rejectWithValue("Unknown error occurred");
  }
});

// Update Work Assignment
export const updateWorkAssignment = createAsyncThunk<
  WorkAssignmentResponse,
  { id: number; data: UpdateWorkAssignmentDto },
  { rejectValue: string }
>("workAssignments/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await workAssignmentService.updateWorkAssignment(id, data);
    Toast({
      message: "Work assignment updated successfully",
      type: "success",
    });
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
});

// Delete Work Assignment
export const deleteWorkAssignment = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("workAssignments/delete", async (id, { rejectWithValue }) => {
  try {
    await workAssignmentService.deleteWorkAssignment(id);
    Toast({
      message: "Work assignment deleted successfully",
      type: "success",
      title: "Success"
    });
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
});

// Get Work Assignments by Worker ID
export const getWorkAssignmentsByWorker = createAsyncThunk<
  WorkAssignmentResponse[],
  number,
  { rejectValue: string }
>("workAssignments/getByWorker", async (workerId, { rejectWithValue }) => {
  try {
    const response = await workAssignmentService.getWorkAssignmentsByWorker(workerId);
    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const message = formatError(error.response?.data);
      return rejectWithValue(message);
    }
    return rejectWithValue("Unknown error occurred");
  }
});

// Get Work Assignments by Job ID
export const getWorkAssignmentsByJob = createAsyncThunk<
  WorkAssignmentResponse[],
  number,
  { rejectValue: string }
>("workAssignments/getByJob", async (jobId, { rejectWithValue }) => {
  try {
    const response = await workAssignmentService.getWorkAssignmentsByJob(jobId);
    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const message = formatError(error.response?.data);
      return rejectWithValue(message);
    }
    return rejectWithValue("Unknown error occurred");
  }
});

// Get Work Assignments by Recruiter ID
export const getWorkAssignmentsByRecruiter = createAsyncThunk<
  WorkAssignmentResponse[],
  number,
  { rejectValue: string }
>("workAssignments/getByRecruiter", async (recruiterId, { rejectWithValue }) => {
  try {
    const response = await workAssignmentService.getWorkAssignmentsByRecruiter(recruiterId);
    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const message = formatError(error.response?.data);
      return rejectWithValue(message);
    }
    return rejectWithValue("Unknown error occurred");
  }
});

// Update Work Assignment Status
export const updateWorkAssignmentStatus = createAsyncThunk<
  WorkAssignmentResponse,
  { id: number; statusData: UpdateWorkAssignmentStatusDto },
  { rejectValue: string }
>("workAssignments/updateStatus", async ({ id, statusData }, { rejectWithValue }) => {
  try {
    const response = await workAssignmentService.updateWorkAssignmentStatus(id, statusData);
    Toast({
      message: "Work assignment status updated successfully",
      type: "success",
    });
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
});

const workAssignmentSlice = createSlice({
  name: "workAssignments",
  initialState,
  reducers: {
    clearCurrentAssignment: (state) => {
      state.currentAssignment = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetAssignments: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Create Work Assignment
      .addCase(createWorkAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createWorkAssignment.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments.push(action.payload);
      })
      .addCase(createWorkAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown error occurred";
      })

      // Get All Work Assignments
      .addCase(getWorkAssignments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWorkAssignments.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = action.payload;
      })
      .addCase(getWorkAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown error occurred";
      })

      // Get Work Assignment by ID
      .addCase(getWorkAssignmentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWorkAssignmentById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAssignment = action.payload;
      })
      .addCase(getWorkAssignmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown error occurred";
      })

      // Update Work Assignment
      .addCase(updateWorkAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateWorkAssignment.fulfilled, (state, action) => {
        state.loading = false;
        // Update in assignments array
        const index = state.assignments.findIndex(a => a.id === action.payload.id);
        if (index !== -1) state.assignments[index] = action.payload;
        
        // Update in worker assignments if exists
        const workerIndex = state.workerAssignments.findIndex(a => a.id === action.payload.id);
        if (workerIndex !== -1) state.workerAssignments[workerIndex] = action.payload;
        
        // Update in job assignments if exists
        const jobIndex = state.jobAssignments.findIndex(a => a.id === action.payload.id);
        if (jobIndex !== -1) state.jobAssignments[jobIndex] = action.payload;
        
        // Update in recruiter assignments if exists
        const recruiterIndex = state.recruiterAssignments.findIndex(a => a.id === action.payload.id);
        if (recruiterIndex !== -1) state.recruiterAssignments[recruiterIndex] = action.payload;
        
        // Update current assignment if it's the one being updated
        if (state.currentAssignment?.id === action.payload.id) {
          state.currentAssignment = action.payload;
        }
      })
      .addCase(updateWorkAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown error occurred";
      })

      // Delete Work Assignment
      .addCase(deleteWorkAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteWorkAssignment.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = state.assignments.filter(a => a.id !== action.payload);
        state.workerAssignments = state.workerAssignments.filter(a => a.id !== action.payload);
        state.jobAssignments = state.jobAssignments.filter(a => a.id !== action.payload);
        state.recruiterAssignments = state.recruiterAssignments.filter(a => a.id !== action.payload);
        if (state.currentAssignment?.id === action.payload) {
          state.currentAssignment = null;
        }
      })
      .addCase(deleteWorkAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown error occurred";
      })

      // Get by Worker ID
      .addCase(getWorkAssignmentsByWorker.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWorkAssignmentsByWorker.fulfilled, (state, action) => {
        state.loading = false;
        state.workerAssignments = action.payload;
      })
      .addCase(getWorkAssignmentsByWorker.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown error occurred";
      })

      // Get by Job ID
      .addCase(getWorkAssignmentsByJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWorkAssignmentsByJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobAssignments = action.payload;
      })
      .addCase(getWorkAssignmentsByJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown error occurred";
      })

      // Get by Recruiter ID
      .addCase(getWorkAssignmentsByRecruiter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWorkAssignmentsByRecruiter.fulfilled, (state, action) => {
        state.loading = false;
        state.recruiterAssignments = action.payload;
      })
      .addCase(getWorkAssignmentsByRecruiter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown error occurred";
      })

      // Update Status
      .addCase(updateWorkAssignmentStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateWorkAssignmentStatus.fulfilled, (state, action) => {
        state.loading = false;
        // Similar update logic as regular update
        const index = state.assignments.findIndex(a => a.id === action.payload.id);
        if (index !== -1) state.assignments[index] = action.payload;
        
        const workerIndex = state.workerAssignments.findIndex(a => a.id === action.payload.id);
        if (workerIndex !== -1) state.workerAssignments[workerIndex] = action.payload;
        
        const jobIndex = state.jobAssignments.findIndex(a => a.id === action.payload.id);
        if (jobIndex !== -1) state.jobAssignments[jobIndex] = action.payload;
        
        const recruiterIndex = state.recruiterAssignments.findIndex(a => a.id === action.payload.id);
        if (recruiterIndex !== -1) state.recruiterAssignments[recruiterIndex] = action.payload;
        
        if (state.currentAssignment?.id === action.payload.id) {
          state.currentAssignment = action.payload;
        }
      })
      .addCase(updateWorkAssignmentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown error occurred";
      });
  },
});

// Actions
export const { clearCurrentAssignment, clearError, resetAssignments } = workAssignmentSlice.actions;

// Selectors
export const selectAllAssignments = (state: RootState) => state.workAssignments.assignments;
export const selectWorkerAssignments = (state: RootState) => state.workAssignments.workerAssignments;
export const selectJobAssignments = (state: RootState) => state.workAssignments.jobAssignments;
export const selectRecruiterAssignments = (state: RootState) => state.workAssignments.recruiterAssignments;
export const selectCurrentAssignment = (state: RootState) => state.workAssignments.currentAssignment;
export const selectAssignmentsLoading = (state: RootState) => state.workAssignments.loading;
export const selectAssignmentsError = (state: RootState) => state.workAssignments.error;

// Additional selectors
export const selectAssignmentById = (state: RootState, id: number) => 
  state.workAssignments.assignments.find(a => a.id === id);
export const selectAssignmentsByStatus = (state: RootState, status: WorkAssignmentStatus) => 
  state.workAssignments.assignments.filter(a => a.status === status);
export const selectActiveAssignmentsCount = (state: RootState) => 
  state.workAssignments.assignments.filter(a => a.status === 'ACTIVE').length;

export default workAssignmentSlice.reducer;