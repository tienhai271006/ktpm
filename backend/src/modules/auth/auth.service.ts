import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../../config/database';
import { config } from '../../config/env';
import { LoginDto, User } from '../../types';
import { AppError } from '../../middleware/error.middleware';

export class AuthService {
  async login(dto: LoginDto) {
    const result = await query('SELECT * FROM users WHERE email = ?', [dto.email]);
    const user = result.rows[0] as User;
    if (!user) throw new AppError('Email hoặc mật khẩu không đúng', 401);

    const valid = await bcrypt.compare(dto.password, user.password_hash);
    if (!valid) throw new AppError('Email hoặc mật khẩu không đúng', 401);

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn } as jwt.SignOptions
    );

    return {
      token,
      user: { id: user.id, email: user.email, full_name: user.full_name, role: user.role },
    };
  }

  async getProfile(userId: string) {
    const result = await query(
      'SELECT id, email, full_name, role, created_at FROM users WHERE id = ?', [userId]
    );
    if (!result.rows[0]) throw new AppError('User not found', 404);
    return result.rows[0];
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const result = await query('SELECT * FROM users WHERE id = ?', [userId]);
    const user = result.rows[0] as User;
    if (!user) throw new AppError('User not found', 404);
    const valid = await bcrypt.compare(oldPassword, user.password_hash);
    if (!valid) throw new AppError('Mật khẩu hiện tại không đúng', 400);
    const hash = await bcrypt.hash(newPassword, 10);
    await query('UPDATE users SET password_hash = ? WHERE id = ?', [hash, userId]);
    return { message: 'Đổi mật khẩu thành công' };
  }
}
