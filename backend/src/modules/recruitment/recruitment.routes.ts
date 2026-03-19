import { Router } from 'express';
import { z } from 'zod';
import { JobController, CandidateController } from './recruitment.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';

const router = Router();
const jobCtrl = new JobController();
const candCtrl = new CandidateController();

const jobSchema = z.object({
  title: z.string().min(2),
  department_id: z.string().uuid(),
  description: z.string().optional(),
  requirements: z.string().optional(),
  salary_min: z.number().min(0).optional(),
  salary_max: z.number().min(0).optional(),
  headcount: z.number().int().min(1),
  job_type: z.enum(['full-time', 'part-time', 'internship']),
  deadline: z.string().optional(),
});

const candidateSchema = z.object({
  full_name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(9),
  job_id: z.string().uuid(),
  experience_years: z.number().int().min(0),
  source: z.string().optional(),
  notes: z.string().optional(),
});

const stageSchema = z.object({
  stage: z.enum(['applied', 'screening', 'interview', 'offer', 'hired', 'rejected']),
});

router.use(authenticate);

// Job routes
router.get('/jobs', (req, res, next) => jobCtrl.getAll(req, res, next));
router.get('/jobs/:id', (req, res, next) => jobCtrl.getById(req, res, next));
router.post('/jobs', validate(jobSchema), (req, res, next) => jobCtrl.create(req, res, next));
router.put('/jobs/:id', validate(jobSchema.partial()), (req, res, next) => jobCtrl.update(req, res, next));
router.delete('/jobs/:id', (req, res, next) => jobCtrl.delete(req, res, next));

// Candidate routes
router.get('/candidates/pipeline', (req, res, next) => candCtrl.getPipeline(req, res, next));
router.get('/candidates/stats', (req, res, next) => candCtrl.getStats(req, res, next));
router.get('/candidates', (req, res, next) => candCtrl.getAll(req, res, next));
router.get('/candidates/:id', (req, res, next) => candCtrl.getById(req, res, next));
router.post('/candidates', validate(candidateSchema), (req, res, next) => candCtrl.create(req, res, next));
router.put('/candidates/:id', validate(candidateSchema.partial()), (req, res, next) => candCtrl.update(req, res, next));
router.patch('/candidates/:id/stage', validate(stageSchema), (req, res, next) => candCtrl.moveStage(req, res, next));
router.delete('/candidates/:id', (req, res, next) => candCtrl.delete(req, res, next));

export default router;
