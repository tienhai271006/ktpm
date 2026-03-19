import { EmployeeService } from '../modules/employees/employee.service';
import { EmployeeRepository } from '../modules/employees/employee.repository';

// Mock the repository
jest.mock('../modules/employees/employee.repository');

const MockRepo = EmployeeRepository as jest.MockedClass<typeof EmployeeRepository>;

describe('EmployeeService', () => {
  let service: EmployeeService;
  let repoInstance: jest.Mocked<EmployeeRepository>;

  beforeEach(() => {
    MockRepo.mockClear();
    service = new EmployeeService();
    repoInstance = MockRepo.mock.instances[0] as jest.Mocked<EmployeeRepository>;
  });

  describe('getById', () => {
    it('returns employee when found', async () => {
      const mockEmp = { id: '123', full_name: 'Nguyễn Văn An', email: 'nva@test.vn' } as any;
      repoInstance.findById = jest.fn().mockResolvedValue(mockEmp);

      const result = await service.getById('123');
      expect(result).toEqual(mockEmp);
      expect(repoInstance.findById).toHaveBeenCalledWith('123');
    });

    it('throws 404 when employee not found', async () => {
      repoInstance.findById = jest.fn().mockResolvedValue(null);
      await expect(service.getById('nonexistent')).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  describe('create', () => {
    const dto = {
      full_name: 'Test User', email: 'test@test.vn', phone: '0900000000',
      department_id: 'dept-1', position: 'Dev', contract_type: 'full-time' as const,
      salary: 20000000, join_date: '2024-01-01',
    };

    it('creates employee when email is unique', async () => {
      repoInstance.findByEmail = jest.fn().mockResolvedValue(null);
      repoInstance.create = jest.fn().mockResolvedValue({ id: 'new-id', ...dto } as any);

      const result = await service.create(dto);
      expect(result.email).toBe(dto.email);
      expect(repoInstance.create).toHaveBeenCalledWith(dto);
    });

    it('throws 409 when email already exists', async () => {
      repoInstance.findByEmail = jest.fn().mockResolvedValue({ id: 'existing' } as any);
      await expect(service.create(dto)).rejects.toMatchObject({ statusCode: 409 });
    });
  });

  describe('delete', () => {
    it('deletes successfully when employee exists', async () => {
      repoInstance.findById = jest.fn().mockResolvedValue({ id: '123' } as any);
      repoInstance.delete = jest.fn().mockResolvedValue(true);

      await service.delete('123');
      expect(repoInstance.delete).toHaveBeenCalledWith('123');
    });
  });
});
