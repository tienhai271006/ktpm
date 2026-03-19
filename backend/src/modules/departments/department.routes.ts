import { Router } from 'express';
import { z } from 'zod';
import { DepartmentController } from './department.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';

const router = Router();
const ctrl = new DepartmentController();

const schema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  manager_id: z.string().uuid().optional(),
  budget: z.number().min(0).optional(),
});

router.use(authenticate);
router.get('/', (req, res, next) => ctrl.getAll(req, res, next));
router.get('/:id', (req, res, next) => ctrl.getById(req, res, next));
router.post('/', validate(schema), (req, res, next) => ctrl.create(req, res, next));
router.put('/:id', validate(schema.partial()), (req, res, next) => ctrl.update(req, res, next));
router.delete('/:id', (req, res, next) => ctrl.delete(req, res, next));

export default router;
