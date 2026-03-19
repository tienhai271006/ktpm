import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { employeeService, departmentService, jobService, candidateService } from '@/services';
import { EmployeeFilter, CreateEmployeeDto, CreateDepartmentDto, CreateJobDto, CreateCandidateDto } from '@/types';

// ===== EMPLOYEES =====
export const useEmployees = (filter?: EmployeeFilter) =>
  useQuery({ queryKey: ['employees', filter], queryFn: () => employeeService.getAll(filter) });

export const useEmployee = (id: string) =>
  useQuery({ queryKey: ['employee', id], queryFn: () => employeeService.getById(id), enabled: !!id });

export const useEmployeeStats = () =>
  useQuery({ queryKey: ['employee-stats'], queryFn: employeeService.getStats });

export const useCreateEmployee = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateEmployeeDto) => employeeService.create(dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['employees'] }); qc.invalidateQueries({ queryKey: ['employee-stats'] }); toast.success('Thêm nhân viên thành công!'); },
    onError: (e: { response?: { data?: { message?: string } } }) => toast.error(e.response?.data?.message || 'Có lỗi xảy ra'),
  });
};

export const useUpdateEmployee = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Partial<CreateEmployeeDto> & { status?: string } }) => employeeService.update(id, dto),
    onSuccess: (_, { id }) => { qc.invalidateQueries({ queryKey: ['employees'] }); qc.invalidateQueries({ queryKey: ['employee', id] }); toast.success('Cập nhật thành công!'); },
    onError: (e: { response?: { data?: { message?: string } } }) => toast.error(e.response?.data?.message || 'Có lỗi xảy ra'),
  });
};

export const useDeleteEmployee = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => employeeService.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['employees'] }); qc.invalidateQueries({ queryKey: ['employee-stats'] }); toast.success('Đã xóa nhân viên'); },
    onError: () => toast.error('Không thể xóa nhân viên'),
  });
};

// ===== DEPARTMENTS =====
export const useDepartments = () =>
  useQuery({ queryKey: ['departments'], queryFn: departmentService.getAll });

export const useCreateDepartment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateDepartmentDto) => departmentService.create(dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['departments'] }); toast.success('Thêm phòng ban thành công!'); },
    onError: () => toast.error('Có lỗi xảy ra'),
  });
};

export const useDeleteDepartment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => departmentService.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['departments'] }); toast.success('Đã xóa phòng ban'); },
    onError: () => toast.error('Không thể xóa phòng ban này'),
  });
};

// ===== JOBS =====
export const useJobs = (filters?: { status?: string; department_id?: string }) =>
  useQuery({ queryKey: ['jobs', filters], queryFn: () => jobService.getAll(filters) });

export const useCreateJob = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateJobDto) => jobService.create(dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['jobs'] }); toast.success('Đăng vị trí thành công!'); },
    onError: () => toast.error('Có lỗi xảy ra'),
  });
};

export const useUpdateJob = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Partial<CreateJobDto> & { status?: string } }) => jobService.update(id, dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['jobs'] }); toast.success('Cập nhật thành công!'); },
    onError: () => toast.error('Có lỗi xảy ra'),
  });
};

export const useDeleteJob = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => jobService.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['jobs'] }); toast.success('Đã xóa vị trí tuyển dụng'); },
    onError: () => toast.error('Có lỗi xảy ra'),
  });
};

// ===== CANDIDATES =====
export const useCandidates = (filter?: { job_id?: string; stage?: string; search?: string; page?: number }) =>
  useQuery({ queryKey: ['candidates', filter], queryFn: () => candidateService.getAll(filter) });

export const usePipeline = () =>
  useQuery({ queryKey: ['pipeline'], queryFn: candidateService.getPipeline });

export const useCandidateStats = () =>
  useQuery({ queryKey: ['candidate-stats'], queryFn: candidateService.getStats });

export const useCreateCandidate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateCandidateDto) => candidateService.create(dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['candidates'] }); qc.invalidateQueries({ queryKey: ['pipeline'] }); qc.invalidateQueries({ queryKey: ['candidate-stats'] }); toast.success('Thêm ứng viên thành công!'); },
    onError: (e: { response?: { data?: { message?: string } } }) => toast.error(e.response?.data?.message || 'Có lỗi xảy ra'),
  });
};

export const useMoveStage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: string }) => candidateService.moveStage(id, stage),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['pipeline'] }); qc.invalidateQueries({ queryKey: ['candidates'] }); qc.invalidateQueries({ queryKey: ['candidate-stats'] }); toast.success('Cập nhật giai đoạn!'); },
    onError: () => toast.error('Có lỗi xảy ra'),
  });
};

export const useDeleteCandidate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => candidateService.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['candidates'] }); qc.invalidateQueries({ queryKey: ['pipeline'] }); toast.success('Đã xóa ứng viên'); },
    onError: () => toast.error('Có lỗi xảy ra'),
  });
};
