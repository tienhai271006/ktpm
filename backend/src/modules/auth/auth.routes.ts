import { Request, Response, NextFunction } from 'express';
import { Router } from 'express';
import { z } from 'zod';
import { AuthService } from './auth.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';

const service = new AuthService();

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await service.login(req.body);
      return ApiResponse.success(res, data, 'Login successful');
    } catch (err) { return next(err); }
  }

  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await service.getProfile(req.user!.userId);
      return ApiResponse.success(res, data);
    } catch (err) { return next(err); }
  }

  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { old_password, new_password } = req.body;
      const data = await service.changePassword(req.user!.userId, old_password, new_password);
      return ApiResponse.success(res, data);
    } catch (err) { return next(err); }
  }
}

const router = Router();
const ctrl = new AuthController();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const changePasswordSchema = z.object({
  old_password: z.string().min(6),
  new_password: z.string().min(8, 'New password must be at least 8 characters'),
});

router.post('/login', validate(loginSchema), (req, res, next) => ctrl.login(req, res, next));
router.get('/profile', authenticate, (req, res, next) => ctrl.getProfile(req, res, next));
router.post('/change-password', authenticate, validate(changePasswordSchema), (req, res, next) => ctrl.changePassword(req, res, next));

export default router;
