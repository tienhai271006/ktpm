import { Request, Response, NextFunction } from 'express';
import { EmployeeService } from './employee.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { getPagination } from '../../utils/pagination';
import { EmployeeFilter } from '../../types';

const service = new EmployeeService();

export class EmployeeController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit } = getPagination(req);
      const filter: EmployeeFilter = {
        department_id: req.query.department_id as string,
        status: req.query.status as EmployeeFilter['status'],
        contract_type: req.query.contract_type as EmployeeFilter['contract_type'],
        search: req.query.search as string,
        page,
        limit,
      };
      const { rows, total } = await service.getAll(filter);
      return ApiResponse.paginated(res, rows, total, page, limit);
    } catch (err) { return next(err); }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const emp = await service.getById(req.params.id);
      return ApiResponse.success(res, emp);
    } catch (err) { return next(err); }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const emp = await service.create(req.body);
      return ApiResponse.created(res, emp, 'Employee created successfully');
    } catch (err) { return next(err); }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const emp = await service.update(req.params.id, req.body);
      return ApiResponse.success(res, emp, 'Employee updated successfully');
    } catch (err) { return next(err); }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await service.delete(req.params.id);
      return ApiResponse.success(res, null, 'Employee deleted successfully');
    } catch (err) { return next(err); }
  }

  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await service.getStats();
      return ApiResponse.success(res, stats);
    } catch (err) { return next(err); }
  }
}
