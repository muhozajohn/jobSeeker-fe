// Types for Work Assignment
export type WorkAssignmentStatus = 'ACTIVE' | 'INACTIVE' | 'COMPLETED' | 'CANCELLED';

export interface Worker {
  id: number;
  firstName: string;
  lastName: string;
}

export interface Recruiter {
  id: number;
  firstName: string;
  lastName: string;
}

export interface JobCategory {
  id: number;
  name: string;
  description: string;
  createdAt: string;
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
  category: JobCategory;
}

export interface WorkAssignmentResponse {
  [x: string]: number;
  id: number;
  startTime: string;
  endTime: string;
  workDate: string;
  status: WorkAssignmentStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
  jobId: number;
  workerId: number;
  recruiterId: number;
  job: Job;
  worker: Worker;
  recruiter: Recruiter;
}

export interface CreateWorkAssignmentDto {
  startTime: string;
  endTime: string;
  workDate: string;
  status: WorkAssignmentStatus;
  notes: string;
  jobId: number;
  workerId: number;
  recruiterId: number;
}

export interface UpdateWorkAssignmentDto extends Partial<CreateWorkAssignmentDto> {}

export interface UpdateWorkAssignmentStatusDto {
  status: WorkAssignmentStatus;
}

export interface WorkAssignmentListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: WorkAssignmentResponse[];
}

export interface SingleWorkAssignmentResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: WorkAssignmentResponse;
}