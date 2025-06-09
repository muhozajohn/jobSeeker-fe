export interface JobResponse {
  id: number;
  title: string;
  description: string;
  location: string;
  salary: number;
  salaryType: string; // Could be enum: "HOURLY" | "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY"
  requirements: string;
  workingHours: string;
  isActive: boolean;
  allowMultiple: boolean;
  urgent  : boolean;
  createdAt: string;
  updatedAt: string;
  categoryId: number;
  recruiterId: number;
  category: {
    id: number;
    name: string;
    description: string;
    createdAt: string;
  };
  recruiter: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string;
  };
}

export interface JobApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: JobResponse | JobResponse[];
}

export interface CreateJobDto {
  title: string;
  description: string;
  skills: string[];
  location: string;
  salary: number;
  salaryType: string;
  requirements: string;
  workingHours: string;
  allowMultiple?: boolean;
  categoryId: number;
}

export interface UpdateJobDto extends Partial<CreateJobDto> {
  isActive?: boolean;
}