import { query } from '../../config/database';
import { JobPosition, CreateJobDto } from '../../types';
import { v4 as uuidv4 } from 'uuid';

export class JobRepository {
  async findAll(filters: { status?: string; department_id?: string }): Promise<JobPosition[]> {
    const conditions = ['1=1'];
    const params: unknown[] = [];
    if (filters.status)        { conditions.push('jp.status = ?');        params.push(filters.status); }
    if (filters.department_id) { conditions.push('jp.department_id = ?'); params.push(filters.department_id); }
    const result = await query(`
      SELECT jp.*, d.name AS department_name, COUNT(c.id) AS candidate_count
      FROM job_positions jp
      LEFT JOIN departments d ON jp.department_id = d.id
      LEFT JOIN candidates  c ON c.job_id = jp.id
      WHERE ${conditions.join(' AND ')}
      GROUP BY jp.id, jp.title, jp.department_id, jp.description, jp.requirements,
               jp.salary_min, jp.salary_max, jp.headcount, jp.job_type, jp.status,
               jp.deadline, jp.created_at, jp.updated_at, d.name
      ORDER BY jp.created_at DESC
    `, params);
    return result.rows as JobPosition[];
  }

  async findById(id: string): Promise<JobPosition | null> {
    const result = await query(`
      SELECT jp.*, d.name AS department_name, COUNT(c.id) AS candidate_count
      FROM job_positions jp
      LEFT JOIN departments d ON jp.department_id = d.id
      LEFT JOIN candidates  c ON c.job_id = jp.id
      WHERE jp.id = ?
      GROUP BY jp.id, jp.title, jp.department_id, jp.description, jp.requirements,
               jp.salary_min, jp.salary_max, jp.headcount, jp.job_type, jp.status,
               jp.deadline, jp.created_at, jp.updated_at, d.name
    `, [id]);
    return (result.rows[0] as JobPosition) || null;
  }

  async create(dto: CreateJobDto): Promise<JobPosition> {
    const id = uuidv4();
    await query(
      `INSERT INTO job_positions (id,title,department_id,description,requirements,salary_min,salary_max,headcount,job_type,deadline)
       VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [id, dto.title, dto.department_id, dto.description||null, dto.requirements||null,
       dto.salary_min||null, dto.salary_max||null, dto.headcount, dto.job_type, dto.deadline||null]
    );
    return (await this.findById(id))!;
  }

  async update(id: string, dto: Partial<CreateJobDto> & { status?: string }): Promise<JobPosition | null> {
    const fields: string[] = [];
    const params: unknown[] = [];
    for (const key of ['title','department_id','description','requirements','salary_min','salary_max','headcount','job_type','status','deadline']) {
      if ((dto as Record<string,unknown>)[key] !== undefined) {
        fields.push(`${key} = ?`);
        params.push((dto as Record<string,unknown>)[key]);
      }
    }
    if (!fields.length) return this.findById(id);
    params.push(id);
    await query(`UPDATE job_positions SET ${fields.join(', ')} WHERE id = ?`, params);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM job_positions WHERE id = ?', [id]);
    return result.rowCount > 0;
  }
}
