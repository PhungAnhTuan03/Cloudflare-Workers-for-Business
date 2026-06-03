CREATE TABLE IF NOT EXISTS user_profiles (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	user_id INTEGER NOT NULL UNIQUE,
	headline TEXT,
	bio TEXT,
	avatar_url TEXT,
	expertise TEXT,
	website_url TEXT,
	created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (user_id) REFERENCES auth_users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS instructor_courses (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	public_id TEXT NOT NULL UNIQUE,
	instructor_id INTEGER NOT NULL,
	title TEXT NOT NULL,
	slug TEXT NOT NULL UNIQUE,
	description TEXT NOT NULL,
	price INTEGER NOT NULL DEFAULT 0,
	currency TEXT NOT NULL DEFAULT 'VND',
	status TEXT NOT NULL DEFAULT 'draft',
	cover_url TEXT,
	created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (instructor_id) REFERENCES auth_users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_instructor_courses_instructor ON instructor_courses (instructor_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_instructor_courses_status ON instructor_courses (status, created_at DESC);

CREATE TABLE IF NOT EXISTS course_lessons (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	course_id INTEGER NOT NULL,
	title TEXT NOT NULL,
	content TEXT NOT NULL,
	sort_order INTEGER NOT NULL DEFAULT 0,
	status TEXT NOT NULL DEFAULT 'published',
	created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (course_id) REFERENCES instructor_courses(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_course_lessons_course ON course_lessons (course_id, sort_order ASC);

CREATE TABLE IF NOT EXISTS course_materials (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	course_id INTEGER NOT NULL,
	title TEXT NOT NULL,
	file_url TEXT NOT NULL,
	file_type TEXT,
	sort_order INTEGER NOT NULL DEFAULT 0,
	status TEXT NOT NULL DEFAULT 'published',
	created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (course_id) REFERENCES instructor_courses(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_course_materials_course ON course_materials (course_id, sort_order ASC);

CREATE TABLE IF NOT EXISTS course_purchases (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	student_id INTEGER NOT NULL,
	course_id INTEGER NOT NULL,
	instructor_id INTEGER NOT NULL,
	status TEXT NOT NULL DEFAULT 'active',
	amount INTEGER NOT NULL DEFAULT 0,
	currency TEXT NOT NULL DEFAULT 'VND',
	created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	UNIQUE (student_id, course_id),
	FOREIGN KEY (student_id) REFERENCES auth_users(id) ON DELETE CASCADE,
	FOREIGN KEY (course_id) REFERENCES instructor_courses(id) ON DELETE CASCADE,
	FOREIGN KEY (instructor_id) REFERENCES auth_users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_course_purchases_student ON course_purchases (student_id, status);
CREATE INDEX IF NOT EXISTS idx_course_purchases_instructor ON course_purchases (instructor_id, status);

CREATE TABLE IF NOT EXISTS private_messages (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	course_id INTEGER NOT NULL,
	student_id INTEGER NOT NULL,
	instructor_id INTEGER NOT NULL,
	sender_id INTEGER NOT NULL,
	body TEXT NOT NULL,
	created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (course_id) REFERENCES instructor_courses(id) ON DELETE CASCADE,
	FOREIGN KEY (student_id) REFERENCES auth_users(id) ON DELETE CASCADE,
	FOREIGN KEY (instructor_id) REFERENCES auth_users(id) ON DELETE CASCADE,
	FOREIGN KEY (sender_id) REFERENCES auth_users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_private_messages_thread ON private_messages (course_id, student_id, instructor_id, created_at ASC);
