-- Hubio 2026 Enterprise Relational Database Schema
-- PostgreSQL 16 Initialization Script

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    client_id VARCHAR(64),
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    company_title VARCHAR(255),
    user_type VARCHAR(32) NOT NULL DEFAULT 'individual',
    tax_number VARCHAR(64),
    phone VARCHAR(32),
    role VARCHAR(32) NOT NULL DEFAULT 'client_viewer',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_client_id ON users(client_id);
CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type);

-- 2. Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR(64) PRIMARY KEY,
    client_id VARCHAR(64) NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'in_progress',
    progress_percentage INT DEFAULT 0,
    total_budget_formatted VARCHAR(64),
    spent_budget_formatted VARCHAR(64),
    start_date VARCHAR(64),
    target_launch_date VARCHAR(64),
    live_url TEXT,
    repo_url TEXT,
    tech_stack JSONB DEFAULT '[]'::jsonb,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);

-- 3. Documents Table (with Foreign Key Cascading)
CREATE TABLE IF NOT EXISTS documents (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(32) NOT NULL,
    file_url TEXT NOT NULL,
    file_size_bytes BIGINT DEFAULT 0,
    file_size_formatted VARCHAR(32),
    mime_type VARCHAR(64) DEFAULT 'application/pdf',
    version VARCHAR(32) DEFAULT 'v1.0',
    is_signed BOOLEAN DEFAULT FALSE,
    signed_at TIMESTAMP WITH TIME ZONE,
    signed_by VARCHAR(255),
    download_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_documents_project_id ON documents(project_id);
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(type);

-- 4. Media Assets Table
CREATE TABLE IF NOT EXISTS media (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    media_type VARCHAR(32) NOT NULL,
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    resolution VARCHAR(32),
    duration_seconds INT,
    tags JSONB DEFAULT '[]'::jsonb,
    uploader_name VARCHAR(255),
    file_size_bytes BIGINT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_media_project_id ON media(project_id);

-- 5. Milestone Revisions Table
CREATE TABLE IF NOT EXISTS revisions (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    milestone_id VARCHAR(64) NOT NULL,
    title VARCHAR(255) NOT NULL,
    tag VARCHAR(64) NOT NULL,
    notes TEXT NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'in_progress',
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_revisions_project_id ON revisions(project_id);
CREATE INDEX IF NOT EXISTS idx_revisions_milestone_id ON revisions(milestone_id);

-- 6. Services Catalog Table
CREATE TABLE IF NOT EXISTS services (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL,
    price_formatted VARCHAR(64) NOT NULL,
    price_amount NUMERIC(12, 2) NOT NULL,
    deliverables_count INT DEFAULT 1,
    turnaround_days INT DEFAULT 7,
    description TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    is_popular BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);

-- 7. One-off Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(64) PRIMARY KEY,
    client_id VARCHAR(64) NOT NULL,
    service_id VARCHAR(64) NOT NULL REFERENCES services(id),
    service_title VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL,
    price_formatted VARCHAR(64) NOT NULL,
    invoice_number VARCHAR(64),
    payment_status VARCHAR(32) NOT NULL DEFAULT 'pending',
    order_status VARCHAR(32) NOT NULL DEFAULT 'in_progress',
    deliverables JSONB DEFAULT '[]'::jsonb,
    ordered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    delivered_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_orders_client_id ON orders(client_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_status ON orders(order_status);

-- 8. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    category VARCHAR(64) NOT NULL,
    target_path VARCHAR(255) DEFAULT '/(tabs)/projects',
    read BOOLEAN DEFAULT FALSE,
    timestamp VARCHAR(64) DEFAULT 'Şimdi',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);

-- 9. Enterprise Audit Logs Table
CREATE TABLE IF NOT EXISTS audit (
    id VARCHAR(64) PRIMARY KEY,
    entity_type VARCHAR(64) NOT NULL,
    entity_id VARCHAR(64) NOT NULL,
    action VARCHAR(64) NOT NULL,
    performed_by VARCHAR(255) NOT NULL,
    details TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit(entity_type, entity_id);
