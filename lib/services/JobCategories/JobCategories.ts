import { JobCategoryApiResponse, CreateJobCategoryDto, UpdateJobCategoryDto } from "@/types/JobCategories";
import http from "@/utils/axiosInstance";
import { AxiosResponse } from "axios";

const JOB_CATEGORY_URL = "/job-categories";

class JobCategoryService {
    // Create a new job category
    createJobCategory(jobCategoryData: CreateJobCategoryDto): Promise<AxiosResponse<JobCategoryApiResponse>> {
        return http.post(JOB_CATEGORY_URL, jobCategoryData);
    }

    // Get all job categories
    getJobCategories(): Promise<AxiosResponse<JobCategoryApiResponse>> {
        return http.get(JOB_CATEGORY_URL);
    }

    // Get a job category by ID
    getJobCategoryById(id: number): Promise<AxiosResponse<JobCategoryApiResponse>> {
        return http.get(`${JOB_CATEGORY_URL}/${id}`);
    }

    // Update a job category
    updateJobCategory(id: number, jobCategoryData: UpdateJobCategoryDto): Promise<AxiosResponse<JobCategoryApiResponse>> {
        return http.patch(`${JOB_CATEGORY_URL}/${id}`, jobCategoryData);
    }

    // Delete a job category
    deleteJobCategory(id: number): Promise<AxiosResponse<void>> {
        return http.delete(`${JOB_CATEGORY_URL}/${id}`);
    }
}

export const jobCategoryService = new JobCategoryService();