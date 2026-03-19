import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { pool } from '../../config/database';

async function seed() {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    console.log('🌱 Seeding database...');

    const hash = await bcrypt.hash('Admin@123', 10);

    // Users
    const adminId = uuidv4(), hrId = uuidv4();
    await conn.execute(`
      INSERT IGNORE INTO users (id, email, password_hash, full_name, role) VALUES
        (?, 'admin@hrm.vn', ?, 'Admin HRM', 'admin'),
        (?, 'hr@hrm.vn',    ?, 'HR Manager', 'hr')
    `, [adminId, hash, hrId, hash]);

    // Departments
    const deptIds = { kt: uuidv4(), sl: uuidv4(), mk: uuidv4(), tc: uuidv4(), hr: uuidv4() };
    await conn.execute(`
      INSERT IGNORE INTO departments (id, name, description, budget) VALUES
        (?, 'Phòng Kỹ thuật',  'Phát triển phần mềm và hạ tầng', 1200000000),
        (?, 'Phòng Sales',     'Kinh doanh và bán hàng',          800000000),
        (?, 'Phòng Marketing', 'Marketing và truyền thông',        600000000),
        (?, 'Phòng Tài chính', 'Kế toán và tài chính',            500000000),
        (?, 'Phòng HR',        'Quản lý nhân sự',                  400000000)
    `, [deptIds.kt, deptIds.sl, deptIds.mk, deptIds.tc, deptIds.hr]);

    // Employees
    const empData = [
      [uuidv4(),'NV-001','Nguyễn Văn An',  'nva@hrm.vn','0912000001',deptIds.kt,'Senior Developer','full-time','active',35000000,'2021-03-15'],
      [uuidv4(),'NV-002','Trần Thị Hoa',   'tth@hrm.vn','0912000002',deptIds.mk,'Marketing Lead',  'full-time','active',28000000,'2022-07-01'],
      [uuidv4(),'NV-003','Lê Minh Khoa',   'lmk@hrm.vn','0912000003',deptIds.sl,'Sales Executive', 'full-time','active',22000000,'2023-01-10'],
      [uuidv4(),'NV-004','Phạm Thị Lan',   'ptl@hrm.vn','0912000004',deptIds.tc,'Finance Manager', 'full-time','active',42000000,'2020-06-05'],
      [uuidv4(),'NV-005','Vũ Đình Nam',    'vdn@hrm.vn','0912000005',deptIds.hr,'HR Manager',      'full-time','active',38000000,'2019-09-20'],
      [uuidv4(),'NV-006','Đặng Thị Mai',   'dtm@hrm.vn','0912000006',deptIds.kt,'Junior Developer','probation','active',18000000,'2024-02-02'],
      [uuidv4(),'NV-007','Hoàng Văn Tú',   'hvt@hrm.vn','0912000007',deptIds.kt,'DevOps Engineer', 'full-time','active',32000000,'2022-11-14'],
      [uuidv4(),'NV-008','Bùi Thị Cúc',   'btc@hrm.vn','0912000008',deptIds.mk,'Content Writer',  'full-time','on-leave',20000000,'2023-08-08'],
    ];
    for (const e of empData) {
      await conn.execute(
        `INSERT IGNORE INTO employees (id,employee_code,full_name,email,phone,department_id,position,contract_type,status,salary,join_date) VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
        e
      );
    }

    // Job positions
    const j1 = uuidv4(), j2 = uuidv4(), j3 = uuidv4(), j4 = uuidv4(), j5 = uuidv4();
    await conn.execute(`
      INSERT IGNORE INTO job_positions (id,title,department_id,description,salary_min,salary_max,headcount,job_type,status,deadline) VALUES
        (?,?,?,'Phát triển giao diện React/TypeScript',25000000,40000000,2,'full-time','open','2025-01-31'),
        (?,?,?,'Quản lý sản phẩm và roadmap',30000000,50000000,1,'full-time','open','2025-01-25'),
        (?,?,?,'Phân tích dữ liệu kinh doanh',20000000,35000000,3,'full-time','open','2025-01-20'),
        (?,?,?,'Quản lý đội ngũ sales',35000000,55000000,1,'full-time','open','2025-02-05'),
        (?,?,?,'Chuyên viên nhân sự',15000000,25000000,2,'full-time','open','2025-01-28')
    `, [
      j1,'Senior Frontend Developer',deptIds.kt,
      j2,'Product Manager',          deptIds.kt,
      j3,'Data Analyst',             deptIds.kt,
      j4,'Sales Manager',            deptIds.sl,
      j5,'HR Specialist',            deptIds.hr,
    ]);

    // Candidates
    await conn.execute(`
      INSERT IGNORE INTO candidates (id,full_name,email,phone,job_id,stage,score,experience_years,source,applied_date) VALUES
        (?,  'Nguyễn Minh Anh','nma@gmail.com','0901000001',?,'interview',87,6,'LinkedIn','2025-01-15'),
        (?,  'Phạm Hữu Đức',  'phd@gmail.com','0901000002',?,'offer',    91,4,'Giới thiệu nội bộ','2025-01-13'),
        (?,  'Trần Lê Phương','tlp@gmail.com','0901000003',?,'screening', 72,4,'LinkedIn','2025-01-14'),
        (?,  'Đỗ Thanh Long', 'dtl@gmail.com','0901000004',?,'applied',   70,5,'TopCV',   '2025-01-16'),
        (?,  'Lý Thị Thu',    'ltt@gmail.com','0901000005',?,'screening', 68,3,'JobStreet','2025-01-12')
    `, [
      uuidv4(), j1,
      uuidv4(), j3,
      uuidv4(), j3,
      uuidv4(), j1,
      uuidv4(), j1,
    ]);

    await conn.commit();
    console.log('✅ Seed data inserted successfully');
  } catch (err) {
    await conn.rollback();
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  } finally {
    conn.release();
    await pool.end();
  }
}

seed();
