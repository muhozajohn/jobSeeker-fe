import {
    CreateWorkAssignmentDto,
    UpdateWorkAssignmentDto,
    UpdateWorkAssignmentStatusDto,
    WorkAssignmentListResponse,
    SingleWorkAssignmentResponse
} from "@/types/workerAssignment/assignment";
import http from "@/utils/axiosInstance";
import { AxiosResponse } from "axios";

const workAssignment_URL = "/work-assignments";

class WorkAssignmentService {
    // Create a new work assignment
    createWorkAssignment(
        workAssignmentData: CreateWorkAssignmentDto
    ): Promise<AxiosResponse<SingleWorkAssignmentResponse>> {
        return http.post(workAssignment_URL, workAssignmentData);
    }

    // Get all work assignments
    getWorkAssignments(
        params?: Record<string, unknown>
    ): Promise<AxiosResponse<WorkAssignmentListResponse>> {
        return http.get(workAssignment_URL, { params });
    }

    // Get a work assignment by ID
    getWorkAssignmentById(
        id: number
    ): Promise<AxiosResponse<SingleWorkAssignmentResponse>> {
        return http.get(`${workAssignment_URL}/${id}`);
    }

    // Update a work assignment
    updateWorkAssignment(
        id: number,
        workAssignmentData: UpdateWorkAssignmentDto
    ): Promise<AxiosResponse<SingleWorkAssignmentResponse>> {
        return http.patch(`${workAssignment_URL}/${id}`, workAssignmentData);
    }

    // Delete a work assignment
    deleteWorkAssignment(
        id: number
    ): Promise<AxiosResponse<void>> {
        return http.delete(`${workAssignment_URL}/${id}`);
    }

    // Get work assignments by worker ID
    getWorkAssignmentsByWorker(
        workerId: number
    ): Promise<AxiosResponse<WorkAssignmentListResponse>> {
        return http.get(`${workAssignment_URL}/worker/${workerId}`);
    }

    // Get work assignments by job ID
    getWorkAssignmentsByJob(
        jobId: number
    ): Promise<AxiosResponse<WorkAssignmentListResponse>> {
        return http.get(`${workAssignment_URL}/job/${jobId}`);
    }

    // Get work assignments by recruiter ID
    getWorkAssignmentsByRecruiter(
        recruiterId: number
    ): Promise<AxiosResponse<WorkAssignmentListResponse>> {
        return http.get(`${workAssignment_URL}/recruiter/${recruiterId}`);
    }

    // Update work assignment status
    updateWorkAssignmentStatus(
        id: number,
        statusData: UpdateWorkAssignmentStatusDto
    ): Promise<AxiosResponse<SingleWorkAssignmentResponse>> {
        return http.patch(`${workAssignment_URL}/${id}/status`, statusData);
    }
}

export const workAssignmentService = new WorkAssignmentService();