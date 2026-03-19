import { query } from '../../config/database';
import { Candidate, CreateCandidateDto, UpdateCandidateDto, CandidateFilter } from '../../types';
import { v4 as uuidv4 } from 'uuid';

export class CandidateRepository {
  async findAll(filter: CandidateFilter): Promise<{ rows: Candidate[]; total: number }> {
    const conditions = ['1=1'];
    const params: (string | number)[] = [];
    if (filter.job_id) { conditions.push('c.job_id = ?');  params.push(filter.job_id); }
    if (filter.stage)  { conditions.push('c.stage = ?');   params.push(filter.stage); }
    if (filter.search) {
      conditions.push('(c.full_name LIKE ? OR c.email LIKE ?)');
      const s = `%${filter.search}%`;
      params.push(s, s);
    }
    const where  = conditions.join(' AND ');
    const page   = filter.page  || 1;
    const limit  = filter.limit || 20;
    const offset = (page - 1) * limit;

    const countResult = await query(`SELECT COUNT(*) AS total FROM candidates c WHERE ${where}`, params);
    const total = Number(countResult.rows[0]?.total || 0);

    const dataResult = await query(`
      SELECT c.*, jp.title AS job_title, d.name AS department_name
      FROM candidates c
      LEFT JOIN job_positions jp ON c.job_id  = jp.id
      LEFT JOIN departments   d  ON jp.department_id = d.id
      WHERE ${where}
      ORDER BY c.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `, params);

    return { rows: dataResult.rows as Candidate[], total };
  }

  async findById(id: string): Promise<Candidate | null> {
    const result = await query(`
      SELECT c.*, jp.title AS job_title, d.name AS department_name
      FROM candidates c
      LEFT JOIN job_positions jp ON c.job_id = jp.id
      LEFT JOIN departments   d  ON jp.department_id = d.id
      WHERE c.id = ?
    `, [id]);
    return (result.rows[0] as Candidate) || null;
  }

  async findByStageGrouped(): Promise<Record<string, Candidate[]>> {
    const result = await query(`
      SELECT c.*, jp.title AS job_title
      FROM candidates c
      LEFT JOIN job_positions jp ON c.job_id = jp.id
      WHERE c.stage NOT IN ('hired','rejected')
      ORDER BY c.applied_date DESC
    `);
    const grouped: Record<string, Candidate[]> = { applied:[], screening:[], interview:[], offer:[] };
    for (const row of result.rows as Candidate[]) {
      if (grouped[row.stage]) grouped[row.stage].push(row);
    }
    return grouped;
  }

  async create(dto: CreateCandidateDto): Promise<Candidate> {
    const id = uuidv4();
    await query(
      `INSERT INTO candidates (id,full_name,email,phone,job_id,experience_years,source,notes)
       VALUES (?,?,?,?,?,?,?,?)`,
      [id, dto.full_name, dto.email, dto.phone, dto.job_id,
       dto.experience_years, dto.source||null, dto.notes||null]
    );
    return (await this.findById(id))!;
  }

  async update(id: string, dto: UpdateCandidateDto): Promise<Candidate | null> {
    const fields: string[] = [];
    const params: unknown[] = [];
    for (const key of ['full_name','email','phone','job_id','stage','score','experience_years','source','cv_url','notes']) {
      if ((dto as Record<string,unknown>)[key] !== undefined) {
        fields.push(`${key} = ?`);
        params.push((dto as Record<string,unknown>)[key]);
      }
    }
    if (!fields.length) return this.findById(id);
    params.push(id);
    await query(`UPDATE candidates SET ${fields.join(', ')} WHERE id = ?`, params);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM candidates WHERE id = ?', [id]);
    return result.rowCount > 0;
  }

  async getStats(): Promise<Record<string, unknown>> {
    const result = await query(`
      SELECT
        COUNT(*)                                   AS total,
        SUM(stage = 'applied')                    AS applied,
        SUM(stage = 'screening')                  AS screening,
        SUM(stage = 'interview')                  AS interview,
        SUM(stage = 'offer')                      AS offer,
        SUM(stage = 'hired')                      AS hired,
        SUM(created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)) AS new_this_week
      FROM candidates
    `);
    return result.rows[0];
  }
}
