CREATE TABLE IF NOT EXISTS contacts (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT,
	email TEXT NOT NULL,
	phone TEXT,
	subject TEXT,
	message TEXT NOT NULL,
	ip_address TEXT,
	created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts (created_at);
