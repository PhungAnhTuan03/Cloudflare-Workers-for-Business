CREATE TABLE IF NOT EXISTS cart_items (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	user_id INTEGER NOT NULL,
	course_id INTEGER NOT NULL,
	coupon_id INTEGER,
	created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	UNIQUE (user_id, course_id),
	FOREIGN KEY (user_id) REFERENCES auth_users(id) ON DELETE CASCADE,
	FOREIGN KEY (course_id) REFERENCES instructor_courses(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_cart_items_user ON cart_items (user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS coupons (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	code TEXT NOT NULL UNIQUE,
	course_id INTEGER,
	instructor_id INTEGER,
	discount_type TEXT NOT NULL DEFAULT 'percent',
	discount_value INTEGER NOT NULL DEFAULT 0,
	max_redemptions INTEGER,
	used_count INTEGER NOT NULL DEFAULT 0,
	starts_at TEXT,
	expires_at TEXT,
	status TEXT NOT NULL DEFAULT 'active',
	created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (course_id) REFERENCES instructor_courses(id) ON DELETE CASCADE,
	FOREIGN KEY (instructor_id) REFERENCES auth_users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_coupons_code_status ON coupons (code, status);
CREATE INDEX IF NOT EXISTS idx_coupons_course ON coupons (course_id, status);
