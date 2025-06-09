// Types for request/response
export interface CreateUserDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    avatar?: string;
    role?: Role;
    isActive?: boolean;
}

export interface UpdateUserDto {
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatar?: string;
    isActive?: boolean;
}

export interface UpdateRoleDto {
    role: Role;
}

export interface SearchUsersParams {
    query: string;
    role?: Role;
    isActive?: boolean;
    page?: number;
    limit?: number;
}

export interface GetUsersParams {
    page?: number;
    limit?: number;
    role?: Role;
    isActive?: boolean;
    includeRelations?: boolean;
}

export interface GetSpecificUsersParams {
    includeJobs?: boolean;
    includeApplications?: boolean;
    page?: number;
    limit?: number;
}

export enum Role {
    ADMIN = 'ADMIN',
    RECRUITER = 'RECRUITER',
    WORKER = 'WORKER'
}

export interface LoginDto {
    email: string;
    password: string;

}

export interface UserProfileResponse {
    id: number;
    email: string;
    role: Role
}


export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatar: string | null;
  role: 'ADMIN' | 'RECRUITER' | 'WORKER';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UsersData {
  totalCount: number;
  page: number;
  pageSize: number;
  users: User[];
}

export interface UsersResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: UsersData;
}
