import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ApiResponse } from '../utils/ApiResponse';

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return ApiResponse.error(
        res,
        'Validation failed',
        422,
        result.error.flatten().fieldErrors
      );
    }
    req.body = result.data;
    return next();
  };
}
