import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { connectionRequestService } from "@/lib/services/notification";
import Toast from "@/components/Toasty";
import { AxiosError } from "axios";
import { formatError } from "@/utils/errors";
import { ConnectionRequest, CreateConnectionRequestDto, UpdateConnectionStatusDto } from "@/types/notification";
import { RootState } from "../store";

interface ConnectionRequestState {
  requests: ConnectionRequest[];
  loading: boolean;
  error: string | null;
}

const initialState: ConnectionRequestState = {
  requests: [],
  loading: false,
  error: null,
};

// CREATE
export const createConnectionRequest = createAsyncThunk<
  ConnectionRequest,
  CreateConnectionRequestDto,
  { rejectValue: string }
>("connectionRequests/create", async (payload, { rejectWithValue }) => {
  try {
    const response = await connectionRequestService.create(payload);
    Toast({ message: "Connection request sent", type: "success" });
    return response.data.data as ConnectionRequest;
  } catch (error) {
    const message = error instanceof AxiosError
      ? formatError(error.response?.data)
      : "Unknown error occurred";
    Toast({ message, type: "error" });
    return rejectWithValue(message);
  }
});

// GET ALL (Admin)
export const getConnectionRequests = createAsyncThunk<
  ConnectionRequest[],
  void,
  { rejectValue: string }
>("connectionRequests/getAll", async (_, { rejectWithValue }) => {
  try {
    const response = await connectionRequestService.getAll();
    return response.data;
  } catch (error) {
    const message = error instanceof AxiosError
      ? formatError(error.response?.data)
      : "Unknown error occurred";
    return rejectWithValue(message);
  }
});

// UPDATE STATUS (Admin)
export const updateConnectionRequestStatus = createAsyncThunk<
  ConnectionRequest,
  { id: number; data: UpdateConnectionStatusDto },
  { rejectValue: string }
>("connectionRequests/updateStatus", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await connectionRequestService.updateStatus(id, data);
    Toast({ message: `Connection request ${data.status.toLowerCase()}`, type: "success" });
    return response.data.data as ConnectionRequest;
  } catch (error) {
    const message = error instanceof AxiosError
      ? formatError(error.response?.data)
      : "Unknown error occurred";
    Toast({ message, type: "error" });
    return rejectWithValue(message);
  }
});

const connectionRequestSlice = createSlice({
  name: "connectionRequests",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createConnectionRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createConnectionRequest.fulfilled, (state, action: PayloadAction<ConnectionRequest>) => {
        state.loading = false;
        state.requests.push(action.payload);
      })
      .addCase(createConnectionRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown error";
      })

      // Get all
      .addCase(getConnectionRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getConnectionRequests.fulfilled, (state, action: PayloadAction<ConnectionRequest[]>) => {
        state.loading = false;
        state.requests = action.payload;
      })
      .addCase(getConnectionRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown error";
      })

      // Update status
      .addCase(updateConnectionRequestStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateConnectionRequestStatus.fulfilled, (state, action: PayloadAction<ConnectionRequest>) => {
        state.loading = false;
        const index = state.requests.findIndex((req) => req.id === action.payload.id);
        if (index !== -1) {
          state.requests[index] = action.payload;
        }
      })
      .addCase(updateConnectionRequestStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown error";
      });
  },
});

// Selectors
export const selectConnectionRequests = (state: RootState) => state.connectionRequests.requests;
export const selectConnectionRequestsLoading = (state: RootState) => state.connectionRequests.loading;
export const selectConnectionRequestsError = (state: RootState) => state.connectionRequests.error;

export default connectionRequestSlice.reducer;
