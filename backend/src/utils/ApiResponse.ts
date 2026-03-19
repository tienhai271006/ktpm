import { Response } from 'express';

export class ApiResponse {
  static success<T>(res: Response, data: T, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static created<T>(res: Response, data: T, message = 'Created successfully') {
    return res.status(201).json({
      success: true,
      message,
      data,
    });
  }

  static paginated<T>(
    res: Response,
    data: T[],
    total: number,
    page: number,
    limit: number,
    message = 'Success'
  ) {
    return res.status(200).json({
      success: true,
      message,
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  }

  static error(res: Response, message: string, statusCode = 400, errors?: unknown) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors: errors || null,
    });
  }

  static notFound(res: Response, message = 'Resource not found') {
    return res.status(404).json({ success: false, message });
  }

  static unauthorized(res: Response, message = 'Unauthorized') {
    return res.status(401).json({ success: false, message });
  }

  static forbidden(res: Response, message = 'Forbidden') {
    return res.status(403).json({ success: false, message });
  }
}
