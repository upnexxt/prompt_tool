# Authentication System Setup

## Running Migrations

To reset and recreate the authentication tables:

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy the contents of `20240220_recreate_auth_tables.sql`
4. Paste into the SQL editor
5. Click "Run" to execute the migration

This script will:
1. Drop existing objects (functions, triggers, and tables) if they exist
2. Enable the pgcrypto extension for encryption
3. Recreate all necessary tables, functions, and policies for the authentication system

Note: This is a destructive operation that will remove existing pending users data. Only run this if you need to completely reset the authentication system.