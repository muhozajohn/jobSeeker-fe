import { ApplicationResponse, CreateApplicationDto } from "@/types/application/application";
import http from "@/utils/axiosInstance";
import { AxiosResponse } from "axios";

const application_URL = "/applications";

class ApplicationService {
  // Create a new application
  createApplication(applicationData: CreateApplicationDto): Promise<AxiosResponse<ApplicationResponse>> {
    return http.post(application_URL, applicationData);
  }

  // Get all applications
  getApplications(params?: Record<string, unknown>): Promise<AxiosResponse> {
    return http.get(application_URL, { params });
  }

  // Get applications posted by the current user
  getMyApplications(): Promise<AxiosResponse> {
    return http.get(`${application_URL}/myapplications`);
  }

  // Get an application by ID
  getApplicationById(id: number): Promise<AxiosResponse<ApplicationResponse>> {
    return http.get(`${application_URL}/${id}`);
  }

  // Update an application
  updateApplication(id: number, applicationData: CreateApplicationDto): Promise<AxiosResponse<ApplicationResponse>> {
    return http.patch(`${application_URL}/${id}`, applicationData);
  }

  // Delete an application
  deleteApplication(id: number): Promise<AxiosResponse<void>> {
    return http.delete(`${application_URL}/${id}`);
  }

  toggleApplicationActive(id: number, status: string): Promise<AxiosResponse<ApplicationResponse>> {
    return http.patch(`${application_URL}/${id}/status?status=${status}`);
  }
}

export const applicationService = new ApplicationService();
