import { WorkerResponse, CreateOrUpdateWorkerDto } from "@/types/worker/index";
import http from "@/utils/axiosInstance";
import { AxiosResponse } from "axios";

const worker_URL = "/worker";

class WorkerService {
  // Create a worker profile
  createWorker(workerData: CreateOrUpdateWorkerDto): Promise<AxiosResponse<WorkerResponse>> {
    return http.post(worker_URL, workerData);
  }

  // Get all worker profiles (Admin, Recruiter only)
  getWorkers(): Promise<AxiosResponse<WorkerResponse>> {
    return http.get(worker_URL);
  }

  // Get current worker profile
  getMyWorkerProfile(): Promise<AxiosResponse<WorkerResponse>> {
    return http.get(`${worker_URL}/me`);
  }

  // Update current worker profile
  updateMyWorkerProfile(workerData: CreateOrUpdateWorkerDto): Promise<AxiosResponse<WorkerResponse>> {
    return http.patch(`${worker_URL}/me`, workerData);
  }

  // Get worker profile by ID (Admin only)
  getWorkerById(id: number): Promise<AxiosResponse<WorkerResponse>> {
    return http.get(`${worker_URL}/${id}`);
  }

  // Update worker profile by ID (Admin only)
  updateWorkerById(id: number, workerData: CreateOrUpdateWorkerDto): Promise<AxiosResponse<WorkerResponse>> {
    return http.patch(`${worker_URL}/${id}`, workerData);
  }

  // Delete worker profile by ID (Admin only)
  deleteWorkerById(id: number): Promise<AxiosResponse<void>> {
    return http.delete(`${worker_URL}/${id}`);
  }

  // Toggle current worker availability
  toggleMyAvailability(): Promise<AxiosResponse<WorkerResponse>> {
    return http.patch(`${worker_URL}/me/toggle-availability`);
  }
}

export const workerService = new WorkerService();