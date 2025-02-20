# Authentication Setup Guide

This guide will help you set up the authentication system with admin approval workflow.

## Prerequisites

1. A Supabase project (create one at https://supabase.com if you haven't already)
2. Your Supabase project URL and anon key

## Setup Steps

### 1. Environment Variables

Create a `.env` file in the root directory and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 2. Database Setup

1. Go to your Supabase project's SQL editor
2. Copy the contents of `supabase/migrations/create_auth_tables.sql`
3. Run the SQL commands to create:
   - Pending users table
   - Approval system
   - Email notification triggers
   - Row Level Security policies

### 3. Email Settings

1. Go to your Supabase project settings
2. Under "Auth > Email Templates", customize the following templates:
   - Confirmation email
   - Magic Link
   - Invite user

### 4. Authentication Settings

1. In Supabase project settings, go to "Auth > Settings"
2. Enable "Email" provider
3. Configure Site URL to match your application URL
4. Set any additional security settings as needed

## How it Works

1. **User Registration Flow**:
   - User signs up with email/password
   - Entry is created in `pending_users` table
   - Email notification sent to admin (vanleeuwen.daniel@upnexxt.nl)
   - User sees "pending approval" message

2. **Admin Approval Flow**:
   - Admin receives email with approval link
   - Clicking link approves the user
   - User receives confirmation email
   - User can now log in

3. **Security Measures**:
   - Row Level Security (RLS) policies protect data
   - Only admin can approve users
   - Users can only view their own pending status

## Troubleshooting

1. **Email Not Received**:
   - Check Supabase logs for email delivery status
   - Verify email templates are configured
   - Check spam folder

2. **Access Denied Errors**:
   - Verify RLS policies are correctly set up
   - Check user roles and permissions
   - Ensure environment variables are correct

3. **Approval Link Not Working**:
   - Check URL configuration in Supabase settings
   - Verify token encryption settings
   - Check for any network/CORS issues

## Testing

To test the complete flow:

1. Sign up with a test email
2. Check admin email for approval request
3. Click approval link
4. Verify user can log in
5. Check user's approved status in database

## Security Notes

- Keep your Supabase credentials secure
- Regularly monitor pending registrations
- Consider implementing rate limiting
- Review authentication logs periodically

For additional help or questions, please contact the development team.