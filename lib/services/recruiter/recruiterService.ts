import { RecruiterResponse, RecruiterApiResponse, CreateRecruiterDto } from "@/types/recruiter";
import http from "@/utils/axiosInstance";
import { AxiosResponse } from "axios";

const RECRUITER_URL = "/recruiters";

class RecruiterService {
    // Create recruiter - returns RecruiterApiResponse wrapping RecruiterResponse
    createRecruiter(recruiterData: CreateRecruiterDto): Promise<AxiosResponse<RecruiterApiResponse>> {
        return http.post(RECRUITER_URL, recruiterData);
    }

    // Get all recruiters - returns array of RecruiterApiResponse wrapped in rows
    getRecruiters(
        params?: Record<string, unknown>
    ): Promise<AxiosResponse<{
        data: RecruiterResponse[]; rows: RecruiterApiResponse[]; count: number 
}>> {
        return http.get(RECRUITER_URL, { params });
    }

    // Get recruiter stats - returns unknown stats data
    getRecruiterStats(): Promise<AxiosResponse<unknown>> {
        return http.get(`${RECRUITER_URL}/stats`);
    }

    // Get recruiter by user ID - returns RecruiterApiResponse
    getRecruiterByUserId(userId: number): Promise<AxiosResponse<RecruiterApiResponse>> {
        return http.get(`${RECRUITER_URL}/user/${userId}`);
    }

    // Get recruiter by ID - returns direct RecruiterResponse (no wrapper)
    getRecruiterById(id: number): Promise<AxiosResponse<RecruiterApiResponse>> {
        return http.get(`${RECRUITER_URL}/${id}`);
    }

    // Update recruiter - returns direct RecruiterResponse
    updateRecruiter(
        id: number, 
        recruiterData: Partial<RecruiterResponse>
    ): Promise<AxiosResponse<RecruiterApiResponse>> {
        return http.patch(`${RECRUITER_URL}/${id}`, recruiterData);
    }

    // Delete recruiter - returns void
    deleteRecruiter(id: number): Promise<AxiosResponse<void>> {
        return http.delete(`${RECRUITER_URL}/${id}`);
    }

    // Verify recruiter - returns direct RecruiterResponse
    verifyRecruiter(id: number): Promise<AxiosResponse<RecruiterApiResponse>> {
        return http.patch(`${RECRUITER_URL}/${id}/verify`);
    }

    // Unverify recruiter - returns direct RecruiterResponse
    unverifyRecruiter(id: number): Promise<AxiosResponse<RecruiterResponse>> {
        return http.patch(`${RECRUITER_URL}/${id}/unverify`);
    }
}

export const recruiterService = new RecruiterService();