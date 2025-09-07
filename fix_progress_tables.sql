-- Fix Progress Tables Schema
-- Run this in your Supabase SQL Editor

-- 1. Drop foreign key constraints and unique constraints
ALTER TABLE minimal_user_progress DROP CONSTRAINT IF EXISTS minimal_user_progress_clerk_user_id_key;
ALTER TABLE moderate_user_progress DROP CONSTRAINT IF EXISTS moderate_user_progress_clerk_user_id_key;
ALTER TABLE significant_user_progress DROP CONSTRAINT IF EXISTS significant_user_progress_clerk_user_id_key;
ALTER TABLE intensive_user_progress DROP CONSTRAINT IF EXISTS intensive_user_progress_clerk_user_id_key;

-- 2. Add module_id column if it doesn't exist
ALTER TABLE minimal_user_progress ADD COLUMN IF NOT EXISTS module_id INTEGER;
ALTER TABLE moderate_user_progress ADD COLUMN IF NOT EXISTS module_id INTEGER;
ALTER TABLE significant_user_progress ADD COLUMN IF NOT EXISTS module_id INTEGER;
ALTER TABLE intensive_user_progress ADD COLUMN IF NOT EXISTS module_id INTEGER;

-- 3. Add composite unique constraint to prevent duplicate module progress per user
ALTER TABLE minimal_user_progress ADD CONSTRAINT minimal_unique_user_module 
    UNIQUE(clerk_user_id, module_id, current_course);
ALTER TABLE moderate_user_progress ADD CONSTRAINT moderate_unique_user_module 
    UNIQUE(clerk_user_id, module_id, current_course);
ALTER TABLE significant_user_progress ADD CONSTRAINT significant_unique_user_module 
    UNIQUE(clerk_user_id, module_id, current_course);
ALTER TABLE intensive_user_progress ADD CONSTRAINT intensive_unique_user_module 
    UNIQUE(clerk_user_id, module_id, current_course);

-- 4. Optional: Remove foreign key constraints temporarily for simple user IDs
-- (Re-add them later when you have proper user management)
ALTER TABLE minimal_user_progress DROP CONSTRAINT IF EXISTS minimal_user_progress_clerk_user_id_fkey;
ALTER TABLE moderate_user_progress DROP CONSTRAINT IF EXISTS moderate_user_progress_clerk_user_id_fkey;
ALTER TABLE significant_user_progress DROP CONSTRAINT IF EXISTS significant_user_progress_clerk_user_id_fkey;
ALTER TABLE intensive_user_progress DROP CONSTRAINT IF EXISTS intensive_user_progress_clerk_user_id_fkey;
