import { query } from '../../config/database';
import { Employee, CreateEmployeeDto, UpdateEmployeeDto, EmployeeFilter } from '../../types';
import { v4 as uuidv4 } from 'uuid';

export class EmployeeRepository {
  async findAll(filter: EmployeeFilter): Promise<{ rows: Employee[]; total: number }> {
    const conditions: string[] = ['1=1'];
    const params: (string | number)[] = [];

    if (filter.department_id) { conditions.push('e.department_id = ?'); params.push(filter.department_id); }
    if (filter.status)         { conditions.push('e.status = ?');        params.push(filter.status); }
    if (filter.contract_type)  { conditions.push('e.contract_type = ?'); params.push(filter.contract_type); }
    if (filter.search) {
      conditions.push('(e.full_name LIKE ? OR e.email LIKE ? OR e.employee_code LIKE ?)');
      const s = `%${filter.search}%`;
      params.push(s, s, s);
    }

    const where  = conditions.join(' AND ');
    const page   = Number(filter.page  || 1);
    const limit  = Number(filter.limit || 20);
    const offset = (page - 1) * limit;

    const countResult = await query(`SELECT COUNT(*) AS total FROM employees e WHERE ${where}`, params);
    const total = Number(countResult.rows[0]?.total || 0);

    const dataResult = await query(
      `SELECT e.*, d.name AS department_name
       FROM employees e
       LEFT JOIN departments d ON e.department_id = d.id
       WHERE ${where}
       ORDER BY e.created_at DESC
       LIMIT ${limit} OFFSET ${offset}`,
      params
    );
    return { rows: dataResult.rows as Employee[], total };
  }

  async findById(id: string): Promise<Employee | null> {
    const result = await query(
      `SELECT e.*, d.name AS department_name
       FROM employees e LEFT JOIN departments d ON e.department_id = d.id
       WHERE e.id = ?`, [id]
    );
    return (result.rows[0] as Employee) || null;
  }

  async findByEmail(email: string): Promise<Employee | null> {
    const result = await query('SELECT * FROM employees WHERE email = ?', [email]);
    return (result.rows[0] as Employee) || null;
  }

  async create(dto: CreateEmployeeDto): Promise<Employee> {
    const id = uuidv4(), code = await this.generateCode();
    await query(
      `INSERT INTO employees (id,employee_code,full_name,email,phone,department_id,position,contract_type,salary,join_date,address)
       VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
      [id, code, dto.full_name, dto.email, dto.phone, dto.department_id,
       dto.position, dto.contract_type, dto.salary, dto.join_date, dto.address || null]
    );
    return (await this.findById(id))!;
  }

  async update(id: string, dto: UpdateEmployeeDto): Promise<Employee | null> {
    const fields: string[] = [], params: (string | number | null)[] = [];
    for (const key of ['full_name','email','phone','department_id','position','contract_type','status','salary','join_date','address']) {
      if ((dto as Record<string,unknown>)[key] !== undefined) {
        fields.push(`${key} = ?`);
        params.push((dto as Record<string,unknown>)[key] as string | number | null);
      }
    }
    if (!fields.length) return this.findById(id);
    params.push(id);
    await query(`UPDATE employees SET ${fields.join(', ')} WHERE id = ?`, params);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM employees WHERE id = ?', [id]);
    return result.rowCount > 0;
  }

  async getStats(): Promise<Record<string, unknown>> {
    const result = await query(`
      SELECT
        COUNT(*) AS total,
        SUM(status = 'active') AS active,
        SUM(status = 'on-leave') AS on_leave,
        SUM(contract_type = 'probation') AS probation,
        SUM(DATE_FORMAT(created_at,'%Y-%m') = DATE_FORMAT(NOW(),'%Y-%m')) AS new_this_month
      FROM employees`);
    return result.rows[0];
  }

  private async generateCode(): Promise<string> {
    const result = await query("SELECT employee_code FROM employees ORDER BY employee_code DESC LIMIT 1");
    if (!result.rows.length) return 'NV-001';
    const last = (result.rows[0] as { employee_code: string }).employee_code;
    return `NV-${String(parseInt(last.replace('NV-', ''), 10) + 1).padStart(3, '0')}`;
  }
}
