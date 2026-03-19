import bcrypt from 'bcryptjs';
import { AuthService } from '../modules/auth/auth.service';

// Mock the db query
jest.mock('../config/database', () => ({
  query: jest.fn(),
}));

import { query } from '../config/database';
const mockQuery = query as jest.Mock;

describe('AuthService', () => {
  let service: AuthService;
  beforeEach(() => {
    service = new AuthService();
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('returns token on valid credentials', async () => {
      const hash = await bcrypt.hash('Admin@123', 10);
      mockQuery.mockResolvedValue({
        rows: [{ id: 'u1', email: 'admin@hrm.vn', password_hash: hash, full_name: 'Admin', role: 'admin' }],
      });

      const result = await service.login({ email: 'admin@hrm.vn', password: 'Admin@123' });
      expect(result.token).toBeTruthy();
      expect(result.user.email).toBe('admin@hrm.vn');
      expect(result.user.role).toBe('admin');
    });

    it('throws 401 when user not found', async () => {
      mockQuery.mockResolvedValue({ rows: [] });
      await expect(service.login({ email: 'no@one.vn', password: 'pass' }))
        .rejects.toMatchObject({ statusCode: 401 });
    });

    it('throws 401 when password is wrong', async () => {
      const hash = await bcrypt.hash('correct_password', 10);
      mockQuery.mockResolvedValue({
        rows: [{ id: 'u1', email: 'x@x.vn', password_hash: hash, full_name: 'X', role: 'hr' }],
      });
      await expect(service.login({ email: 'x@x.vn', password: 'wrong_password' }))
        .rejects.toMatchObject({ statusCode: 401 });
    });
  });
});
