import { CreateUserDto, GetSpecificUsersParams, GetUsersParams, LoginDto, Role, SearchUsersParams, UpdateUserDto, UsersResponse } from "@/types/users";
import http from "@/utils/axiosInstance";
import { AxiosResponse } from "axios";

const BASE_URL = "/auth";
const USER_URL = "/users";


class AuthService {


    // Create new user
    Login(loginData: LoginDto) {
        return http.post(`${BASE_URL}`, loginData);
    }
    // Create new user
    createUser(userData: CreateUserDto, avatar?: File) {
        const formData = new FormData();

        // Append user data fields
        Object.keys(userData).forEach(key => {
            const value = userData[key as keyof UpdateUserDto];
            if (value !== undefined && value !== null) {
                formData.append(key, value.toString());
            }
        });

        // Append avatar file if provided
        if (avatar) {
            formData.append('avatar', avatar);
        }

        return http.post(`${USER_URL}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }

    
    // get me
    myProfile() {
        return http.get(`${BASE_URL}/profile`,);
    }


    // Get all users with pagination and filtering
    getUsers(params?: GetUsersParams) : Promise<AxiosResponse<UsersResponse>> {
        return http.get(`${USER_URL}`, { params });
    }

    // Search users by name or email
    searchUsers(params: SearchUsersParams) {
        return http.get(`${USER_URL}/search`, { params });
    }

    // Get all recruiters
    getRecruiters(params?: GetSpecificUsersParams) {
        return http.get(`${USER_URL}/recruiters`, { params });
    }

    // Get all workers
    getWorkers(params?: GetSpecificUsersParams) {
        return http.get(`${USER_URL}/workers`, { params });
    }

    // Get user by ID
    getUserById(id: number, includeRelations?: boolean) {
        const params = includeRelations ? { includeRelations } : {};
        return http.get(`${USER_URL}/${id}`, { params });
    }

    // Get jobs created by recruiter
    getUserJobs(id: number) {
        return http.get(`${USER_URL}/${id}/jobs`);
    }

    // Get applications submitted by worker
    getUserApplications(id: number) {
        return http.get(`${USER_URL}/${id}/applications`);
    }

    // Get work assignments for user
    getUserWorkAssignments(id: number) {
        return http.get(`${USER_URL}/${id}/work-assignments`);
    }

    // Update user information
    updateUser(id: number, userData: UpdateUserDto, avatar?: File) {
        const formData = new FormData();

        // Append user data fields
        Object.keys(userData).forEach(key => {
            const value = userData[key as keyof UpdateUserDto];
            if (value !== undefined && value !== null) {
                formData.append(key, value.toString());
            }
        });

        // Append avatar file if provided
        if (avatar) {
            formData.append('avatar', avatar);
        }

        return http.patch(`${USER_URL}/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }

    // Update user avatar
    updateUserAvatar(id: number, avatar: File) {
        const formData = new FormData();
        formData.append('avatar', avatar);

        return http.patch(`${USER_URL}/${id}/avatar`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }

    // Update user role (Admin only)
    updateUserRole(id: number, role: Role) {
        return http.patch(`${USER_URL}/${id}/role`, { role });
    }

    // Toggle user active status (Admin only)
    toggleUserStatus(id: number) {
        return http.patch(`${USER_URL}/${id}/status`);
    }

    // Delete user (Admin only)
    deleteUser(id: number): Promise<AxiosResponse<void>> {
        return http.delete(`${USER_URL}/${id}`);
    }
}

const authService = new AuthService();
export default authService;