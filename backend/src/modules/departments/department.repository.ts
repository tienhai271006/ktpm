import { query } from '../../config/database';
import { Department, CreateDepartmentDto } from '../../types';
import { v4 as uuidv4 } from 'uuid';

export class DepartmentRepository {
  async findAll(): Promise<Department[]> {
    const result = await query(`
      SELECT d.*,
        e.full_name AS manager_name,
        COUNT(emp.id) AS employee_count
      FROM departments d
      LEFT JOIN employees e   ON d.manager_id = e.id
      LEFT JOIN employees emp ON emp.department_id = d.id
      GROUP BY d.id, d.name, d.description, d.manager_id, d.budget, d.created_at, d.updated_at, e.full_name
      ORDER BY d.name
    `);
    return result.rows as Department[];
  }

  async findById(id: string): Promise<Department | null> {
    const result = await query(`
      SELECT d.*, e.full_name AS manager_name, COUNT(emp.id) AS employee_count
      FROM departments d
      LEFT JOIN employees e   ON d.manager_id = e.id
      LEFT JOIN employees emp ON emp.department_id = d.id
      WHERE d.id = ?
      GROUP BY d.id, d.name, d.description, d.manager_id, d.budget, d.created_at, d.updated_at, e.full_name
    `, [id]);
    return (result.rows[0] as Department) || null;
  }

  async create(dto: CreateDepartmentDto): Promise<Department> {
    const id = uuidv4();
    await query(
      'INSERT INTO departments (id,name,description,manager_id,budget) VALUES (?,?,?,?,?)',
      [id, dto.name, dto.description || null, dto.manager_id || null, dto.budget || null]
    );
    return (await this.findById(id))!;
  }

  async update(id: string, dto: Partial<CreateDepartmentDto>): Promise<Department | null> {
    const fields: string[] = [];
    const params: unknown[] = [];
    for (const key of ['name','description','manager_id','budget']) {
      if ((dto as Record<string,unknown>)[key] !== undefined) {
        fields.push(`${key} = ?`);
        params.push((dto as Record<string,unknown>)[key]);
      }
    }
    if (!fields.length) return this.findById(id);
    params.push(id);
    await query(`UPDATE departments SET ${fields.join(', ')} WHERE id = ?`, params);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM departments WHERE id = ?', [id]);
    return result.rowCount > 0;
  }
}
