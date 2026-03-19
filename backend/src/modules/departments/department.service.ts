import { DepartmentRepository } from './department.repository';
import { CreateDepartmentDto } from '../../types';
import { AppError } from '../../middleware/error.middleware';

const repo = new DepartmentRepository();

export class DepartmentService {
  async getAll() { return repo.findAll(); }

  async getById(id: string) {
    const dept = await repo.findById(id);
    if (!dept) throw new AppError('Department not found', 404);
    return dept;
  }

  async create(dto: CreateDepartmentDto) { return repo.create(dto); }

  async update(id: string, dto: Partial<CreateDepartmentDto>) {
    await this.getById(id);
    return repo.update(id, dto);
  }

  async delete(id: string) {
    await this.getById(id);
    return repo.delete(id);
  }
}
