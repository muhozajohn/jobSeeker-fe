
// Types
export interface Category {
  id: number;
  name: string;
  description: string;
  createdAt: string;
}

export interface Recruiter {
  id: number;
  firstName: string;
  lastName: string;
}

export interface Job {
  id: number;
  title: string;
  description: string;
  location: string;
  salary: number;
  salaryType: string;
  requirements: string;
  skills: string[];
  workingHours: string;
  isActive: boolean;
  urgent: boolean;
  allowMultiple: boolean;
  createdAt: string;
  updatedAt: string;
  categoryId: number;
  recruiterId: number;
  category: Category;
  recruiter: Recruiter;
}

export interface Worker {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
}

export interface Application {
  id: number;
  message: string;
  status: string;
  appliedAt: string;
  updatedAt: string;
  jobId: number;
  workerId: number;
  job: Job;
  worker: Worker;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

// Specific response types
export interface ApplicationResponse extends ApiResponse<Application> {}
export interface ApplicationsListResponse extends ApiResponse<Application[]> {}

export interface CreateApplicationDto {
  message: string;
  jobId: number;
  workerId: number;
  status?: string; // Optional, default is 'PENDING'
}