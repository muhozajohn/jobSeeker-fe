export interface RecruiterUser {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string;
}

export interface RecruiterResponse {
    filter(arg0: (rid: any) => boolean): unknown;
    id: number;
    userId: number;
    companyName: string;
    type: string;
    description: string;
    location: string;
    website: string;
    verified: boolean;
    createdAt: string;
    updatedAt: string;
    user: RecruiterUser;
    recruiters?:RecruiterResponse[]
}
export interface RecruiterApiResponse {
  data: RecruiterResponse;
}
export interface CreateRecruiterDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    companyName: string;
    type: string;
    description: string;
    location: string;
    website: string;
}

export interface GetParams {
    page?: number;
    limit?: number;
    type?: string;
    location?: string;
    verified?: boolean;
    search?: string;
}
