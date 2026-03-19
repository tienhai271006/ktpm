import { Request, Response, NextFunction } from 'express';
import { DepartmentService } from './department.service';
import { ApiResponse } from '../../utils/ApiResponse';

const service = new DepartmentService();

export class DepartmentController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await service.getAll();
      return ApiResponse.success(res, data);
    } catch (err) { return next(err); }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await service.getById(req.params.id);
      return ApiResponse.success(res, data);
    } catch (err) { return next(err); }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await service.create(req.body);
      return ApiResponse.created(res, data);
    } catch (err) { return next(err); }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await service.update(req.params.id, req.body);
      return ApiResponse.success(res, data, 'Updated successfully');
    } catch (err) { return next(err); }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await service.delete(req.params.id);
      return ApiResponse.success(res, null, 'Deleted successfully');
    } catch (err) { return next(err); }
  }
}
