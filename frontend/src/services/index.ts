import api from './api';
import {
  Employee, CreateEmployeeDto, EmployeeFilter, EmployeeStats,
  Department, CreateDepartmentDto,
  JobPosition, CreateJobDto,
  Candidate, CreateCandidateDto, Pipeline, CandidateStats,
  LoginDto, LoginResponse,
  PaginatedResponse, ApiResponse,
} from '@/types';

// ===== AUTH =====
export const authService = {
  login: (dto: LoginDto) =>
    api.post<ApiResponse<LoginResponse>>('/auth/login', dto).then(r => r.data.data),
  getProfile: () =>
    api.get<ApiResponse<LoginResponse['user']>>('/auth/profile').then(r => r.data.data),
  changePassword: (old_password: string, new_password: string) =>
    api.post('/auth/change-password', { old_password, new_password }),
};

// ===== EMPLOYEES =====
export const employeeService = {
  getAll: (filter?: EmployeeFilter) =>
    api.get<PaginatedResponse<Employee>>('/employees', { params: filter }).then(r => r.data),
  getById: (id: string) =>
    api.get<ApiResponse<Employee>>(`/employees/${id}`).then(r => r.data.data),
  getStats: () =>
    api.get<ApiResponse<EmployeeStats>>('/employees/stats').then(r => r.data.data),
  create: (dto: CreateEmployeeDto) =>
    api.post<ApiResponse<Employee>>('/employees', dto).then(r => r.data.data),
  update: (id: string, dto: Partial<CreateEmployeeDto> & { status?: string }) =>
    api.put<ApiResponse<Employee>>(`/employees/${id}`, dto).then(r => r.data.data),
  delete: (id: string) =>
    api.delete(`/employees/${id}`),
};

// ===== DEPARTMENTS =====
export const departmentService = {
  getAll: () =>
    api.get<ApiResponse<Department[]>>('/departments').then(r => r.data.data),
  getById: (id: string) =>
    api.get<ApiResponse<Department>>(`/departments/${id}`).then(r => r.data.data),
  create: (dto: CreateDepartmentDto) =>
    api.post<ApiResponse<Department>>('/departments', dto).then(r => r.data.data),
  update: (id: string, dto: Partial<CreateDepartmentDto>) =>
    api.put<ApiResponse<Department>>(`/departments/${id}`, dto).then(r => r.data.data),
  delete: (id: string) =>
    api.delete(`/departments/${id}`),
};

// ===== JOBS =====
export const jobService = {
  getAll: (filters?: { status?: string; department_id?: string }) =>
    api.get<ApiResponse<JobPosition[]>>('/recruitment/jobs', { params: filters }).then(r => r.data.data),
  getById: (id: string) =>
    api.get<ApiResponse<JobPosition>>(`/recruitment/jobs/${id}`).then(r => r.data.data),
  create: (dto: CreateJobDto) =>
    api.post<ApiResponse<JobPosition>>('/recruitment/jobs', dto).then(r => r.data.data),
  update: (id: string, dto: Partial<CreateJobDto> & { status?: string }) =>
    api.put<ApiResponse<JobPosition>>(`/recruitment/jobs/${id}`, dto).then(r => r.data.data),
  delete: (id: string) =>
    api.delete(`/recruitment/jobs/${id}`),
};

// ===== CANDIDATES =====
export const candidateService = {
  getAll: (filter?: { job_id?: string; stage?: string; search?: string; page?: number }) =>
    api.get<PaginatedResponse<Candidate>>('/recruitment/candidates', { params: filter }).then(r => r.data),
  getPipeline: () =>
    api.get<ApiResponse<Pipeline>>('/recruitment/candidates/pipeline').then(r => r.data.data),
  getStats: () =>
    api.get<ApiResponse<CandidateStats>>('/recruitment/candidates/stats').then(r => r.data.data),
  getById: (id: string) =>
    api.get<ApiResponse<Candidate>>(`/recruitment/candidates/${id}`).then(r => r.data.data),
  create: (dto: CreateCandidateDto) =>
    api.post<ApiResponse<Candidate>>('/recruitment/candidates', dto).then(r => r.data.data),
  update: (id: string, dto: Partial<CreateCandidateDto>) =>
    api.put<ApiResponse<Candidate>>(`/recruitment/candidates/${id}`, dto).then(r => r.data.data),
  moveStage: (id: string, stage: string) =>
    api.patch<ApiResponse<Candidate>>(`/recruitment/candidates/${id}/stage`, { stage }).then(r => r.data.data),
  delete: (id: string) =>
    api.delete(`/recruitment/candidates/${id}`),
};
