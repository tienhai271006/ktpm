import { Request, Response, NextFunction } from 'express';
import { JobService, CandidateService } from './recruitment.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { getPagination } from '../../utils/pagination';
import { CandidateFilter } from '../../types';

const jobService = new JobService();
const candService = new CandidateService();

export class JobController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await jobService.getAll({
        status: req.query.status as string,
        department_id: req.query.department_id as string,
      });
      return ApiResponse.success(res, data);
    } catch (err) { return next(err); }
  }
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      return ApiResponse.success(res, await jobService.getById(req.params.id));
    } catch (err) { return next(err); }
  }
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      return ApiResponse.created(res, await jobService.create(req.body));
    } catch (err) { return next(err); }
  }
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      return ApiResponse.success(res, await jobService.update(req.params.id, req.body));
    } catch (err) { return next(err); }
  }
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await jobService.delete(req.params.id);
      return ApiResponse.success(res, null, 'Deleted');
    } catch (err) { return next(err); }
  }
}

export class CandidateController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit } = getPagination(req);
      const filter: CandidateFilter = {
        job_id: req.query.job_id as string,
        stage: req.query.stage as CandidateFilter['stage'],
        search: req.query.search as string,
        page, limit,
      };
      const { rows, total } = await candService.getAll(filter);
      return ApiResponse.paginated(res, rows, total, page, limit);
    } catch (err) { return next(err); }
  }
  async getPipeline(req: Request, res: Response, next: NextFunction) {
    try {
      return ApiResponse.success(res, await candService.getPipeline());
    } catch (err) { return next(err); }
  }
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      return ApiResponse.success(res, await candService.getById(req.params.id));
    } catch (err) { return next(err); }
  }
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      return ApiResponse.created(res, await candService.create(req.body));
    } catch (err) { return next(err); }
  }
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      return ApiResponse.success(res, await candService.update(req.params.id, req.body));
    } catch (err) { return next(err); }
  }
  async moveStage(req: Request, res: Response, next: NextFunction) {
    try {
      return ApiResponse.success(
        res,
        await candService.moveStage(req.params.id, req.body.stage),
        'Stage updated'
      );
    } catch (err) { return next(err); }
  }
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await candService.delete(req.params.id);
      return ApiResponse.success(res, null, 'Deleted');
    } catch (err) { return next(err); }
  }
  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      return ApiResponse.success(res, await candService.getStats());
    } catch (err) { return next(err); }
  }
}
