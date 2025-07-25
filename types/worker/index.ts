export interface CreateOrUpdateWorkerDto {
  location: string;
  experience: string;
  skills: string;
  resume: string; 
  available: boolean;
  userId:number;
}
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

export interface Worker {
  id: number;
  userId: number;
  location: string;
  experience: string;
  skills: string;
  resume: string;
  rating?: string;
  jobsCompleted?: string;
  available: boolean;
  createdAt: string; 
  updatedAt: string; 
  user: User;
}

export interface WorkerResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Worker[];
}
