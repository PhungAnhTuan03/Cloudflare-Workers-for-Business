CREATE TABLE IF NOT EXISTS business_leads (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	public_id TEXT NOT NULL UNIQUE,
	full_name TEXT NOT NULL,
	phone TEXT NOT NULL,
	email TEXT,
	course_slug TEXT,
	location_slug TEXT,
	preferred_time TEXT,
	message TEXT,
	source_path TEXT,
	utm_source TEXT,
	utm_medium TEXT,
	utm_campaign TEXT,
	status TEXT NOT NULL DEFAULT 'new',
	assigned_to TEXT,
	ip_address TEXT,
	user_agent TEXT,
	created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_business_leads_status_created ON business_leads (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_business_leads_phone ON business_leads (phone);
CREATE INDEX IF NOT EXISTS idx_business_leads_course_location ON business_leads (course_slug, location_slug);

CREATE TABLE IF NOT EXISTS business_lead_events (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	lead_id INTEGER NOT NULL,
	event_type TEXT NOT NULL,
	note TEXT,
	actor_id TEXT,
	created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (lead_id) REFERENCES business_leads(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_business_lead_events_lead ON business_lead_events (lead_id, created_at DESC);

CREATE TABLE IF NOT EXISTS business_locations (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	slug TEXT NOT NULL UNIQUE,
	name TEXT NOT NULL,
	address TEXT NOT NULL,
	province TEXT NOT NULL,
	district TEXT,
	ward TEXT,
	phone TEXT,
	email TEXT,
	map_url TEXT,
	latitude REAL,
	longitude REAL,
	is_active INTEGER NOT NULL DEFAULT 1,
	created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS business_course_profiles (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	course_slug TEXT NOT NULL UNIQUE,
	category_slug TEXT,
	price_from INTEGER,
	price_note TEXT,
	duration_note TEXT,
	level TEXT,
	certificate_name TEXT,
	is_featured INTEGER NOT NULL DEFAULT 0,
	created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS business_cohorts (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	course_slug TEXT NOT NULL,
	location_slug TEXT NOT NULL,
	instructor_slug TEXT,
	start_date TEXT,
	schedule_label TEXT NOT NULL,
	shift TEXT,
	seats_total INTEGER,
	seats_left INTEGER,
	price INTEGER,
	status TEXT NOT NULL DEFAULT 'open',
	created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_business_cohorts_course_location ON business_cohorts (course_slug, location_slug, status);
CREATE INDEX IF NOT EXISTS idx_business_cohorts_start_date ON business_cohorts (start_date);

CREATE TABLE IF NOT EXISTS business_certificates (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	code TEXT NOT NULL UNIQUE,
	student_name TEXT NOT NULL,
	course_name TEXT NOT NULL,
	issued_at TEXT NOT NULL,
	expires_at TEXT,
	status TEXT NOT NULL DEFAULT 'valid',
	verification_hash TEXT,
	created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_business_certificates_code_status ON business_certificates (code, status);

CREATE TABLE IF NOT EXISTS business_student_portal_links (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	label TEXT NOT NULL,
	url TEXT NOT NULL,
	is_primary INTEGER NOT NULL DEFAULT 0,
	is_active INTEGER NOT NULL DEFAULT 1,
	created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS business_audit_logs (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	actor_id TEXT,
	action TEXT NOT NULL,
	entity_type TEXT NOT NULL,
	entity_id TEXT NOT NULL,
	payload_json TEXT,
	ip_address TEXT,
	created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
