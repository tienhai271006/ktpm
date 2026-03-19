import { Router } from 'express';
import { z } from 'zod';
import { EmployeeController } from './employee.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';

const router = Router();
const ctrl = new EmployeeController();

const createSchema = z.object({
  full_name: z.string().min(2, 'Full name required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(9, 'Invalid phone'),
  department_id: z.string().uuid('Invalid department'),
  position: z.string().min(2, 'Position required'),
  contract_type: z.enum(['full-time', 'part-time', 'probation']),
  salary: z.number().min(0),
  join_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date format: YYYY-MM-DD'),
  address: z.string().optional(),
});

const updateSchema = createSchema.partial().extend({
  status: z.enum(['active', 'inactive', 'on-leave']).optional(),
});

router.use(authenticate);

router.get('/', (req, res, next) => ctrl.getAll(req, res, next));
router.get('/stats', (req, res, next) => ctrl.getStats(req, res, next));
router.get('/:id', (req, res, next) => ctrl.getById(req, res, next));
router.post('/', validate(createSchema), (req, res, next) => ctrl.create(req, res, next));
router.put('/:id', validate(updateSchema), (req, res, next) => ctrl.update(req, res, next));
router.delete('/:id', (req, res, next) => ctrl.delete(req, res, next));

export default router;
