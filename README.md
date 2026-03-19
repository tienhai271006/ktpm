# HRM Pro — Hệ thống Quản lý Nhân sự

Hệ thống quản lý nhân sự đầy đủ với 2 module chính: **Quản lý hồ sơ nhân viên** và **Quản lý tuyển dụng**.

## Công nghệ sử dụng

| Layer    | Công nghệ |
|----------|-----------|
| Frontend | React 18, TypeScript, Vite, React Query, Zustand, React Hook Form, React Router v6 |
| Backend  | Node.js, Express, TypeScript, **MySQL** (Aiven), JWT, Zod |
| Database | MySQL 8.0 (hosted trên Aiven Cloud) |
| DevOps   | Docker, Docker Compose |

## Cấu trúc dự án

```
hrm-system/
├── frontend/                  # React + TypeScript + Vite
│   └── src/
│       ├── components/
│       │   ├── common/        # Badge, Button, Modal, Avatar, StatCard...
│       │   ├── layout/        # MainLayout, PageShell, Sidebar
│       │   ├── employees/     # EmployeeForm, EmployeeDetailPanel
│       │   └── recruitment/   # CandidateForm, JobForm
│       ├── pages/
│       │   ├── employees/     # EmployeeListPage, DepartmentPage, AttendancePage
│       │   └── recruitment/   # PipelinePage, JobListPage, CandidateListPage
│       ├── hooks/             # React Query hooks (useEmployees, useCandidates...)
│       ├── services/          # API calls (axios)
│       ├── store/             # Zustand (authStore)
│       ├── types/             # TypeScript interfaces
│       └── utils/             # Helpers (formatDate, formatCurrency...)
│
├── backend/                   # Node.js + Express + TypeScript
│   └── src/
│       ├── modules/
│       │   ├── employees/     # controller, service, repository, routes
│       │   ├── departments/   # controller, service, repository, routes
│       │   ├── recruitment/   # job + candidate (controller, service, repository, routes)
│       │   └── auth/          # login, profile, change-password
│       ├── config/            # database.ts (MySQL pool), env.ts, cors.ts
│       ├── middleware/        # auth (JWT), validate (Zod), error handler
│       ├── database/
│       │   ├── migrations/    # schema.sql
│       │   └── seeds/         # seed.ts (dữ liệu mẫu)
│       └── utils/             # ApiResponse, pagination
│
├── docker-compose.yml
└── README.md
```

## REST API

### Auth
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | /api/auth/login | Đăng nhập, trả về JWT |
| GET  | /api/auth/profile | Thông tin user hiện tại |
| POST | /api/auth/change-password | Đổi mật khẩu |

### Nhân viên
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET    | /api/employees | Danh sách (filter + phân trang) |
| GET    | /api/employees/stats | Thống kê tổng quan |
| GET    | /api/employees/:id | Chi tiết nhân viên |
| POST   | /api/employees | Thêm nhân viên mới |
| PUT    | /api/employees/:id | Cập nhật hồ sơ |
| DELETE | /api/employees/:id | Xóa nhân viên |

### Phòng ban
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET    | /api/departments | Danh sách phòng ban |
| POST   | /api/departments | Thêm phòng ban |
| PUT    | /api/departments/:id | Cập nhật |
| DELETE | /api/departments/:id | Xóa |

### Tuyển dụng — Vị trí
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET    | /api/recruitment/jobs | Danh sách vị trí |
| POST   | /api/recruitment/jobs | Đăng vị trí mới |
| PUT    | /api/recruitment/jobs/:id | Cập nhật / đóng vị trí |
| DELETE | /api/recruitment/jobs/:id | Xóa vị trí |

### Tuyển dụng — Ứng viên
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET    | /api/recruitment/candidates | Danh sách ứng viên |
| GET    | /api/recruitment/candidates/pipeline | Kanban pipeline theo giai đoạn |
| GET    | /api/recruitment/candidates/stats | Thống kê |
| POST   | /api/recruitment/candidates | Thêm ứng viên |
| PUT    | /api/recruitment/candidates/:id | Cập nhật thông tin |
| PATCH  | /api/recruitment/candidates/:id/stage | Chuyển giai đoạn |
| DELETE | /api/recruitment/candidates/:id | Xóa ứng viên |

## Cài đặt & Chạy

### Yêu cầu
- Node.js 18+
- Tài khoản [Aiven](https://aiven.io) với MySQL service (hoặc MySQL local)

### Bước 1 — Cấu hình môi trường

File `.env` đã được cấu hình sẵn trong `backend/.env`. Nếu cần thay đổi, chỉnh sửa các biến:

```env
DB_HOST=mysql-xxxx.aivencloud.com
DB_PORT=14833
DB_NAME=defaultdb
DB_USER=avnadmin
DB_PASSWORD=your_password
DB_SSL=true

JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:5173
```

### Bước 2 — Chạy Backend

```cmd
cd backend
npm install
npm run migrate    # Tạo bảng trong database
npm run seed       # Nhập dữ liệu mẫu
npm run dev        # Chạy tại http://localhost:5000
```

Kiểm tra kết nối: http://localhost:5000/health

### Bước 3 — Chạy Frontend

Mở terminal mới:

```cmd
cd frontend
npm install
npm run dev        # Chạy tại http://localhost:5173
```

### Lưu ý Windows

Nếu gặp lỗi `cannot be loaded because running scripts is disabled`:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Hoặc dùng `cmd.exe` thay vì PowerShell.

## Tài khoản demo

| Email | Mật khẩu | Vai trò |
|-------|----------|---------|
| admin@hrm.vn | Admin@123 | Admin |
| hr@hrm.vn    | Admin@123 | HR Manager |

## Tính năng

### Module 1 — Quản lý hồ sơ nhân viên
- Danh sách nhân viên với filter đa chiều (phòng ban, trạng thái, loại hợp đồng)
- Tìm kiếm fulltext theo tên, email, mã nhân viên
- Thêm / sửa / xóa nhân viên với form validation
- Xem chi tiết nhân viên qua slide-in panel
- Phân trang server-side
- Quản lý phòng ban (CRUD)
- Trang chấm công

### Module 2 — Quản lý tuyển dụng
- Kanban pipeline 4 giai đoạn: Đã nộp → Sàng lọc → Phỏng vấn → Đề xuất
- Chuyển giai đoạn ứng viên bằng 1 click
- Quản lý vị trí tuyển dụng: đăng mới, đóng/mở, progress bar chỉ tiêu
- Danh sách ứng viên với filter theo giai đoạn và vị trí
- Thống kê pipeline realtime trên Dashboard

### Bảo mật
- JWT Authentication (7 ngày)
- RBAC: admin / hr / manager
- Zod schema validation toàn bộ API
- Helmet security headers
- CORS có cấu hình whitelist
- SSL bắt buộc với Aiven MySQL
