export interface JobCategory {
    id: number;
    name: string;
    description?: string;
    createdAt?: string;
}

export interface JobCategoryApiResponse {
    success: boolean;
    message: string;
    data: JobCategory | JobCategory[] | null;
}

export interface CreateJobCategoryDto {
    name: string;
    description?: string;
}

export interface UpdateJobCategoryDto {
    name?: string;
    description?: string;
}