# HRM Pro — Hệ thống Quản lý Nhân sự

Hệ thống quản lý nhân sự đầy đủ với 2 module chính: **Quản lý hồ sơ nhân viên** và **Quản lý tuyển dụng**.

## Công nghệ sử dụng

| Layer    | Công nghệ |
|----------|-----------|
| Frontend | React 18, TypeScript, Vite, React Query, Zustand, React Hook Form, React Router v6 |
| Backend  | Node.js, Express, TypeScript, PostgreSQL, JWT, Zod |
| Database | PostgreSQL 16 |
| DevOps   | Docker, Docker Compose |

## Cấu trúc dự án

```
hrm-system/
├── frontend/          # React + TypeScript + Vite
│   └── src/
│       ├── components/   # UI components tái sử dụng
│       ├── pages/        # Route pages
│       ├── hooks/        # React Query hooks
│       ├── services/     # API calls (axios)
│       ├── store/        # Zustand global state
│       ├── types/        # TypeScript types
│       └── utils/        # Helpers
├── backend/           # Node.js + Express + TypeScript
│   └── src/
│       ├── modules/      # employees / departments / recruitment / auth
│       ├── config/       # database, env
│       ├── middleware/   # auth, validate, error handler
│       ├── database/     # migrations, seeds
│       └── utils/        # ApiResponse, pagination
└── docker-compose.yml
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
| GET    | /api/recruitment/jobs | Danh sách vị trí tuyển dụng |
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

### Cách 1: Docker (khuyến nghị)
```bash
git clone <repo>
cd hrm-system
docker-compose up -d

# Chạy migration & seed
docker exec hrm_backend npm run migrate
docker exec hrm_backend npm run seed
```
Truy cập: http://localhost:5173

### Cách 2: Chạy trực tiếp

**Yêu cầu:** Node.js 18+, PostgreSQL 14+

```bash
# 1. Tạo database PostgreSQL
createdb hrm_db

# 2. Backend
cd backend
cp .env.example .env     # Điền thông tin DB vào .env
npm install
npm run migrate          # Tạo bảng
npm run seed             # Dữ liệu mẫu
npm run dev              # Chạy tại port 5000

# 3. Frontend (terminal mới)
cd frontend
npm install
npm run dev              # Chạy tại port 5173
```

## Tài khoản demo

| Email | Mật khẩu | Vai trò |
|-------|----------|---------|
| admin@hrm.vn | Admin@123 | Admin |
| hr@hrm.vn    | Admin@123 | HR Manager |

## Tính năng

### Module 1: Quản lý hồ sơ nhân viên
- ✅ Danh sách nhân viên với filter đa chiều (phòng ban, trạng thái, hợp đồng)
- ✅ Tìm kiếm fulltext
- ✅ Thêm / sửa / xóa nhân viên
- ✅ Phân trang server-side
- ✅ Quản lý phòng ban (CRUD)
- ✅ Dashboard thống kê
- ✅ Chấm công (demo)

### Module 2: Quản lý tuyển dụng
- ✅ Kanban pipeline 4 giai đoạn: Đã nộp → Sàng lọc → Phỏng vấn → Đề xuất
- ✅ Chuyển giai đoạn ứng viên bằng 1 click
- ✅ Quản lý vị trí tuyển dụng (đăng mới, đóng/mở)
- ✅ Danh sách ứng viên với filter
- ✅ Thống kê pipeline realtime

### Bảo mật
- ✅ JWT Authentication
- ✅ RBAC (admin, hr, manager)
- ✅ Zod schema validation
- ✅ Helmet security headers
- ✅ CORS configuration
