import mysql from 'mysql2/promise';
import { config } from './env';

export const pool = mysql.createPool({
  host: config.db.host,
  port: config.db.port,
  database: config.db.name,
  user: config.db.user,
  password: config.db.password,
  ssl: config.db.ssl ? { rejectUnauthorized: false } : undefined,
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,
  timezone: '+07:00',
});

// Unified query helper — same signature as pg so all modules work unchanged
export const query = async (sql: string, params?: unknown[]) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [rows] = await pool.execute(sql, params as any);
  const rowsArr = Array.isArray(rows) ? rows as Record<string, unknown>[] : [];
  return { rows: rowsArr, rowCount: rowsArr.length };
};

export const getClient = () => pool.getConnection();
