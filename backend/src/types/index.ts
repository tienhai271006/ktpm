// ===== EMPLOYEE TYPES =====
export type ContractType = 'full-time' | 'part-time' | 'probation';
export type EmployeeStatus = 'active' | 'inactive' | 'on-leave';

export interface Employee {
  id: string;
  employee_code: string;
  full_name: string;
  email: string;
  phone: string;
  department_id: string;
  position: string;
  contract_type: ContractType;
  status: EmployeeStatus;
  salary: number;
  join_date: Date;
  address?: string;
  avatar_url?: string;
  created_at: Date;
  updated_at: Date;
  // joined
  department_name?: string;
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

export interface UpdateEmployeeDto extends Partial<CreateEmployeeDto> {
  status?: EmployeeStatus;
}

export interface EmployeeFilter {
  department_id?: string;
  status?: EmployeeStatus;
  contract_type?: ContractType;
  search?: string;
  page?: number;
  limit?: number;
}

// ===== DEPARTMENT TYPES =====
export interface Department {
  id: string;
  name: string;
  description?: string;
  manager_id?: string;
  budget?: number;
  created_at: Date;
  updated_at: Date;
  // joined
  manager_name?: string;
  employee_count?: number;
}

export interface CreateDepartmentDto {
  name: string;
  description?: string;
  manager_id?: string;
  budget?: number;
}

// ===== RECRUITMENT TYPES =====
export type CandidateStage = 'applied' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
export type JobStatus = 'open' | 'closed' | 'paused';
export type JobType = 'full-time' | 'part-time' | 'internship';

export interface JobPosition {
  id: string;
  title: string;
  department_id: string;
  description?: string;
  requirements?: string;
  salary_min?: number;
  salary_max?: number;
  headcount: number;
  job_type: JobType;
  status: JobStatus;
  deadline?: Date;
  created_at: Date;
  updated_at: Date;
  // joined
  department_name?: string;
  candidate_count?: number;
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
  stage: CandidateStage;
  score?: number;
  experience_years: number;
  source?: string;
  cv_url?: string;
  notes?: string;
  applied_date: Date;
  created_at: Date;
  updated_at: Date;
  // joined
  job_title?: string;
  department_name?: string;
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

export interface UpdateCandidateDto extends Partial<CreateCandidateDto> {
  stage?: CandidateStage;
  score?: number;
}

export interface CandidateFilter {
  job_id?: string;
  stage?: CandidateStage;
  search?: string;
  page?: number;
  limit?: number;
}

// ===== AUTH TYPES =====
export interface User {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  role: 'admin' | 'hr' | 'manager';
  created_at: Date;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}
