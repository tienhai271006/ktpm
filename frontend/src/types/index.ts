// ===== SHARED =====
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ===== EMPLOYEE =====
export type ContractType = 'full-time' | 'part-time' | 'probation';
export type EmployeeStatus = 'active' | 'inactive' | 'on-leave';

export interface Employee {
  id: string;
  employee_code: string;
  full_name: string;
  email: string;
  phone: string;
  department_id: string;
  department_name?: string;
  position: string;
  contract_type: ContractType;
  status: EmployeeStatus;
  salary: number;
  join_date: string;
  address?: string;
  avatar_url?: string;
  created_at: string;
}

export interface CreateEmployeeDto {
  full_name: string;
  email: string;
  phone: string;
  department_id: string;
  position: string;
  contract_type: ContractType;
  salary: number;
  join_date: string;
  address?: string;
}

export interface EmployeeFilter {
  department_id?: string;
  status?: EmployeeStatus;
  contract_type?: ContractType;
  search?: string;
  page?: number;
  limit?: number;
}

export interface EmployeeStats {
  total: string;
  active: string;
  on_leave: string;
  probation: string;
  new_this_month: string;
}

// ===== DEPARTMENT =====
export interface Department {
  id: string;
  name: string;
  description?: string;
  manager_id?: string;
  manager_name?: string;
  budget?: number;
  employee_count?: number;
  created_at: string;
}

export interface CreateDepartmentDto {
  name: string;
  description?: string;
  manager_id?: string;
  budget?: number;
}

// ===== RECRUITMENT =====
export type CandidateStage = 'applied' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
export type JobStatus = 'open' | 'closed' | 'paused';
export type JobType = 'full-time' | 'part-time' | 'internship';

export interface JobPosition {
  id: string;
  title: string;
  department_id: string;
  department_name?: string;
  description?: string;
  requirements?: string;
  salary_min?: number;
  salary_max?: number;
  headcount: number;
  job_type: JobType;
  status: JobStatus;
  deadline?: string;
  candidate_count?: number;
  created_at: string;
}

export interface CreateJobDto {
  title: string;
  department_id: string;
  description?: string;
  requirements?: string;
  salary_min?: number;
  salary_max?: number;
  headcount: number;
  job_type: JobType;
  deadline?: string;
}

export interface Candidate {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  job_id: string;
  job_title?: string;
  department_name?: string;
  stage: CandidateStage;
  score?: number;
  experience_years: number;
  source?: string;
  cv_url?: string;
  notes?: string;
  applied_date: string;
  created_at: string;
}

export interface CreateCandidateDto {
  full_name: string;
  email: string;
  phone: string;
  job_id: string;
  experience_years: number;
  source?: string;
  notes?: string;
}

export interface Pipeline {
  applied: Candidate[];
  screening: Candidate[];
  interview: Candidate[];
  offer: Candidate[];
}

export interface CandidateStats {
  total: string;
  applied: string;
  screening: string;
  interview: string;
  offer: string;
  hired: string;
  new_this_week: string;
}

// ===== AUTH =====
export interface LoginDto { email: string; password: string; }
export interface AuthUser {
  id: string; email: string; full_name: string; role: string;
}
export interface LoginResponse { token: string; user: AuthUser; }
