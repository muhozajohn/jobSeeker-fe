import { JobApiResponse, CreateJobDto, UpdateJobDto } from "@/types/jobs";
import http from "@/utils/axiosInstance";
import { AxiosResponse } from "axios";

const JOB_URL = "/jobs";

class JobService {
    // Create a new job
    createJob(jobData: CreateJobDto): Promise<AxiosResponse<JobApiResponse>> {
        return http.post(JOB_URL, jobData);
    }

    // Get all jobs
    getJobs(params?: Record<string, unknown>): Promise<AxiosResponse<JobApiResponse>> {
        return http.get(JOB_URL, { params });
    }

    // Get jobs posted by the current user
    getMyJobs(): Promise<AxiosResponse<JobApiResponse>> {
        return http.get(`${JOB_URL}/myjobs`);
    }

    // Get a job by ID
    getJobById(id: number): Promise<AxiosResponse<JobApiResponse>> {
        return http.get(`${JOB_URL}/${id}`);
    }

    // Update a job
    updateJob(id: number, jobData: UpdateJobDto): Promise<AxiosResponse<JobApiResponse>> {
        return http.patch(`${JOB_URL}/${id}`, jobData);
    }

    // Delete a job
    deleteJob(id: number): Promise<AxiosResponse<void>> {
        return http.delete(`${JOB_URL}/${id}`);
    }

    // Toggle job active status
    toggleJobActive(id: number): Promise<AxiosResponse<JobApiResponse>> {
        return http.patch(`${JOB_URL}/${id}/toggle-active`);
    }
}

export const jobService = new JobService();