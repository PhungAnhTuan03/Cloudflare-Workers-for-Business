CREATE TABLE IF NOT EXISTS auth_users (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	public_id TEXT NOT NULL UNIQUE,
	full_name TEXT NOT NULL,
	email TEXT NOT NULL UNIQUE,
	phone TEXT,
	password_hash TEXT NOT NULL,
	role TEXT NOT NULL DEFAULT 'student',
	status TEXT NOT NULL DEFAULT 'active',
	last_login_at TEXT,
	created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_auth_users_email ON auth_users (email);
CREATE INDEX IF NOT EXISTS idx_auth_users_role_status ON auth_users (role, status);

