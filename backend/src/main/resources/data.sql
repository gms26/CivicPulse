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
