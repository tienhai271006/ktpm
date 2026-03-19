import { JobRepository } from './job.repository';
import { CandidateRepository } from './candidate.repository';
import { CreateJobDto, CreateCandidateDto, UpdateCandidateDto, CandidateFilter } from '../../types';
import { AppError } from '../../middleware/error.middleware';

const jobRepo = new JobRepository();
const candRepo = new CandidateRepository();

export class JobService {
  async getAll(filters: { status?: string; department_id?: string }) {
    return jobRepo.findAll(filters);
  }
  async getById(id: string) {
    const job = await jobRepo.findById(id);
    if (!job) throw new AppError('Job position not found', 404);
    return job;
  }
  async create(dto: CreateJobDto) { return jobRepo.create(dto); }
  async update(id: string, dto: Partial<CreateJobDto> & { status?: string }) {
    await this.getById(id);
    return jobRepo.update(id, dto);
  }
  async delete(id: string) {
    await this.getById(id);
    return jobRepo.delete(id);
  }
}

export class CandidateService {
  async getAll(filter: CandidateFilter) { return candRepo.findAll(filter); }
  async getById(id: string) {
    const c = await candRepo.findById(id);
    if (!c) throw new AppError('Candidate not found', 404);
    return c;
  }
  async getPipeline() { return candRepo.findByStageGrouped(); }
  async create(dto: CreateCandidateDto) { return candRepo.create(dto); }
  async update(id: string, dto: UpdateCandidateDto) {
    await this.getById(id);
    return candRepo.update(id, dto);
  }
  async moveStage(id: string, stage: string) {
    const validStages = ['applied','screening','interview','offer','hired','rejected'];
    if (!validStages.includes(stage)) throw new AppError('Invalid stage', 400);
    await this.getById(id);
    return candRepo.update(id, { stage: stage as UpdateCandidateDto['stage'] });
  }
  async delete(id: string) {
    await this.getById(id);
    return candRepo.delete(id);
  }
  async getStats() { return candRepo.getStats(); }
}
