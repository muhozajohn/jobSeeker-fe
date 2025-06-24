export type ConnectionStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface CreateConnectionRequestDto {
  recruiterId: number;
  workerId: number;
  message?: string;
}

export interface UpdateConnectionStatusDto {
  status: ConnectionStatus;
  adminNotes?: string;
}

export interface ConnectionRequest {
  id: number;
  recruiterId: number;
  workerId: number;
  message?: string;
  status: ConnectionStatus;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
  recruiter: {
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
    user: User;
  };
  worker: {
    id: number;
    userId: number;
    location: string;
    experience: string;
    skills: string;
    resume: string;
    available: boolean;
    createdAt: string;
    updatedAt: string;
    user: User;
  };
}

export interface User {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatar: string | null;
  role: 'ADMIN' | 'RECRUITER' | 'WORKER';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ConnectionRequestApiResponse {
  success: boolean;
  data: ConnectionRequest | ConnectionRequest[];
  message?: string;
}
