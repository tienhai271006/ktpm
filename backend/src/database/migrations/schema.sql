SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS users (
  id            CHAR(36)     NOT NULL,
  email         VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name     VARCHAR(255) NOT NULL,
  role          VARCHAR(20)  NOT NULL DEFAULT 'hr',
  created_at    DATETIME     DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS departments (
  id          CHAR(36)      NOT NULL,
  name        VARCHAR(255)  NOT NULL,
  description TEXT,
  manager_id  CHAR(36),
  budget      DECIMAL(15,2),
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_dept_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS employees (
  id              CHAR(36)     NOT NULL,
  employee_code   VARCHAR(20)  NOT NULL,
  full_name       VARCHAR(255) NOT NULL,
  email           VARCHAR(255) NOT NULL,
  phone           VARCHAR(20),
  department_id   CHAR(36),
  position        VARCHAR(255) NOT NULL,
  contract_type   VARCHAR(20)  NOT NULL DEFAULT 'full-time',
  status          VARCHAR(20)  NOT NULL DEFAULT 'active',
  salary          DECIMAL(15,2) NOT NULL DEFAULT 0,
  join_date       DATE         NOT NULL,
  address         TEXT,
  avatar_url      TEXT,
  created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_emp_code  (employee_code),
  UNIQUE KEY uq_emp_email (email),
  KEY idx_emp_dept   (department_id),
  KEY idx_emp_status (status),
  CONSTRAINT fk_emp_dept FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS job_positions (
  id            CHAR(36)     NOT NULL,
  title         VARCHAR(255) NOT NULL,
  department_id CHAR(36),
  description   TEXT,
  requirements  TEXT,
  salary_min    DECIMAL(15,2),
  salary_max    DECIMAL(15,2),
  headcount     INT          NOT NULL DEFAULT 1,
  job_type      VARCHAR(20)  NOT NULL DEFAULT 'full-time',
  status        VARCHAR(20)  NOT NULL DEFAULT 'open',
  deadline      DATE,
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_job_dept (department_id),
  CONSTRAINT fk_job_dept FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS candidates (
  id               CHAR(36)     NOT NULL,
  full_name        VARCHAR(255) NOT NULL,
  email            VARCHAR(255) NOT NULL,
  phone            VARCHAR(20),
  job_id           CHAR(36),
  stage            VARCHAR(20)  NOT NULL DEFAULT 'applied',
  score            INT,
  experience_years INT          NOT NULL DEFAULT 0,
  source           VARCHAR(100),
  cv_url           TEXT,
  notes            TEXT,
  applied_date     DATE         DEFAULT (CURRENT_DATE),
  created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_cand_job   (job_id),
  KEY idx_cand_stage (stage),
  CONSTRAINT fk_cand_job FOREIGN KEY (job_id) REFERENCES job_positions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
