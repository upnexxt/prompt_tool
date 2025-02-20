# Authentication System Setup

## Prerequisites

Before running the migration, you need to:

1. Generate a secure JWT secret for token encryption:
   ```sql
   -- Generate a random JWT secret using pgcrypto
   select encode(gen_random_bytes(32), 'base64');
   ```

2. Get your Resend API key from the Resend dashboard (https://resend.com)

## Running Migrations

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. First, set up your configuration parameters:
   ```sql
   -- Replace these values with your actual secrets
   select set_config('my_app.jwt_secret', 'I9qE4qDRpWhkCuGiwVwVzhwe9OGmSjd3AdHzFFCdtF8=', false);
   select set_config('my_app.resend_api_key', 're_9oEydS51_MnHceauD1AyJCC4DdbLsetvv', false);
   ```

4. Run the cleanup script first:
   - Open `20240220_01_cleanup.sql`
   - Execute the script to remove all existing objects
   - Wait for completion

5. Then run the main migration:
   - Open `20240220_recreate_auth_tables.sql`
   - Replace the placeholder values in the first few lines:
     - Replace 'your_jwt_secret' with your generated JWT secret
     - Replace 'your_resend_api_key' with your Resend API key
   - Execute the script

The cleanup script will:
1. Drop all existing policies
2. Drop all existing triggers
3. Drop all related functions
4. Drop the pending_users table

The main migration script will:
1. Set up necessary configuration parameters
2. Enable the pgcrypto extension for encryption
3. Create all necessary tables, functions, and policies for the authentication system

Note: This is a destructive operation that will remove existing pending users data. Only run this if you need to completely reset the authentication system.

## Troubleshooting

If you encounter any errors:
1. Make sure both scripts are run in order (cleanup first, then main migration)
2. Ensure you've set up the configuration parameters correctly
3. Check that you've replaced all placeholder values in the main migration script
4. Verify that your Resend API key is valid
5. Ensure you have the necessary permissions in your Supabase project

If you still get "relation already exists" errors:
1. Try running the cleanup script again
2. If that doesn't work, you can manually drop the objects in this order:
   ```sql
   drop policy if exists "Anyone can create a pending user request" on pending_users;
   drop policy if exists "Users can view their own pending status" on pending_users;
   drop policy if exists "Admins can view all pending users" on pending_users;
   drop trigger if exists on_pending_user_created on pending_users;
   drop function if exists approve_user(text) cascade;
   drop function if exists handle_new_user_registration() cascade;
   drop function if exists add_approved_column_to_users() cascade;
   drop table if exists pending_users cascade;