-- ============================================================
-- CivicPulse — Default Admin Seed
-- ============================================================
-- This script runs on every application startup.
-- The ON CONFLICT clause ensures it's idempotent (safe to re-run).
--
-- Default Admin Credentials:
--   Email:    admin@civicpulse.com
--   Password: Admin@123
--
-- The password_hash below is the BCrypt encoding of "Admin@123".
-- To regenerate: python -c "import bcrypt; print(bcrypt.hashpw(b'Admin@123', bcrypt.gensalt(10)).decode())"
-- ============================================================

INSERT INTO users (full_name, email, password_hash, role, phone, created_at, updated_at)
VALUES (
    'CivicPulse Admin',
    'admin@civicpulse.com',
    '$2a$10$VIfmuv7sJYMvkJkajTCaRe41Jx7UDJIifo9lDtZ9tKoewhPb6Aav2',
    'ADMIN',
    '9999999999',
    NOW(),
    NOW()
)
ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- Sample Data Seed (Citizens and Issues)
-- ============================================================

-- Seed Sample Citizen
INSERT INTO users (full_name, email, password_hash, role, phone, created_at, updated_at)
VALUES (
    'John Doe',
    'john@civicpulse.com',
    '$2a$10$VIfmuv7sJYMvkJkajTCaRe41Jx7UDJIifo9lDtZ9tKoewhPb6Aav2',
    'CITIZEN',
    '5551234567',
    NOW(),
    NOW()
)
ON CONFLICT (email) DO NOTHING;

-- Seed Sample Issues (Idempotent)
INSERT INTO issues (title, description, category, status, priority, location_address, latitude, longitude, reporter_id, created_at, updated_at)
SELECT 'Massive Pothole on 5th Ave', 'Deep pothole causing traffic and vehicle damage.', 'ROAD', 'OPEN', 'HIGH', '5th Ave & 42nd St', 40.753, -73.983, id, NOW(), NOW()
FROM users WHERE email = 'john@civicpulse.com'
AND NOT EXISTS (SELECT 1 FROM issues WHERE title = 'Massive Pothole on 5th Ave');

INSERT INTO issues (title, description, category, status, priority, location_address, latitude, longitude, reporter_id, created_at, updated_at)
SELECT 'Broken Pipe Leaking', 'Water leaking onto the sidewalk for 2 days.', 'WATER', 'IN_PROGRESS', 'CRITICAL', '100 Main St', 40.712, -74.006, id, NOW(), NOW()
FROM users WHERE email = 'john@civicpulse.com'
AND NOT EXISTS (SELECT 1 FROM issues WHERE title = 'Broken Pipe Leaking');

INSERT INTO issues (title, description, category, status, priority, location_address, latitude, longitude, reporter_id, created_at, updated_at)
SELECT 'Streetlight Out', 'Completely dark street corner, very unsafe.', 'POWER', 'OPEN', 'MEDIUM', 'Elm St & Oak St', 40.730, -73.995, id, NOW(), NOW()
FROM users WHERE email = 'john@civicpulse.com'
AND NOT EXISTS (SELECT 1 FROM issues WHERE title = 'Streetlight Out');

INSERT INTO issues (title, description, category, status, priority, location_address, latitude, longitude, reporter_id, created_at, updated_at)
SELECT 'Missed Trash Pickup', 'Garbage has not been collected all week.', 'GARBAGE', 'RESOLVED', 'LOW', '200 Broadway', 40.748, -73.985, id, NOW(), NOW()
FROM users WHERE email = 'john@civicpulse.com'
AND NOT EXISTS (SELECT 1 FROM issues WHERE title = 'Missed Trash Pickup');
