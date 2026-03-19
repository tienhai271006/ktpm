import { EmployeeRepository } from './employee.repository';
import { CreateEmployeeDto, UpdateEmployeeDto, EmployeeFilter } from '../../types';
import { AppError } from '../../middleware/error.middleware';

const repo = new EmployeeRepository();

export class EmployeeService {
  async getAll(filter: EmployeeFilter) {
    return repo.findAll(filter);
  }

  async getById(id: string) {
    const emp = await repo.findById(id);
    if (!emp) throw new AppError('Employee not found', 404);
    return emp;
  }

  async create(dto: CreateEmployeeDto) {
    const existing = await repo.findByEmail(dto.email);
    if (existing) throw new AppError('Email already exists', 409);
    return repo.create(dto);
  }

  async update(id: string, dto: UpdateEmployeeDto) {
    await this.getById(id); // ensure exists
    if (dto.email) {
      const existing = await repo.findByEmail(dto.email);
      if (existing && existing.id !== id) throw new AppError('Email already exists', 409);
    }
    return repo.update(id, dto);
  }

  async delete(id: string) {
    await this.getById(id);
    return repo.delete(id);
  }

  async getStats() {
    return repo.getStats();
  }
}
