-- Set up custom configuration parameters
-- Note: Replace 'your_jwt_secret' and 'your_resend_api_key' with actual values
select set_config('my_app.jwt_secret', 'I9qE4qDRpWhkCuGiwVwVzhwe9OGmSjd3AdHzFFCdtF8=', false);
select set_config('my_app.resend_api_key', 're_9oEydS51_MnHceauD1AyJCC4DdbLsetvv', false);

-- Drop existing objects first
drop function if exists approve_user(text);
drop function if exists handle_new_user_registration() cascade;
drop function if exists add_approved_column_to_users();
drop function if exists get_user_approval_status(uuid);
drop table if exists pending_users;

-- Enable crypto extension
create extension if not exists "pgcrypto";

-- Create pending_users table
create table pending_users (
  id uuid primary key default uuid_generate_v4(),
  email text not null unique,
  user_id uuid references auth.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add approved column to auth.users via postgres function
create or replace function add_approved_column_to_users()
returns void as $$
begin
  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'auth'
    and table_name = 'users'
    and column_name = 'approved'
  ) then
    execute 'alter table auth.users add column approved boolean default false';
  end if;
end;
$$ language plpgsql;

select add_approved_column_to_users();

-- Create function to get user approval status
create or replace function get_user_approval_status(user_id uuid)
returns table (approved boolean) as $$
begin
  return query
  select u.approved from auth.users u where u.id = user_id;
end;
$$ language plpgsql security definer;

-- Create function to handle new user registration
create or replace function handle_new_user_registration()
returns trigger as $$
declare
  admin_email text := 'vanleeuwen.daniel@upnexxt.nl';
  approval_url text;
begin
  -- Generate approval URL with your actual frontend URL
  approval_url := 'https://upnexxt.nl/approve?token=' || 
                  encode(encrypt(new.id::text::bytea, current_setting('my_app.jwt_secret')::bytea, 'aes-cbc/pad:pkcs')::bytea, 'base64');

  -- Insert notification for admin
  perform net.http_post(
    url := 'https://api.resend.com/emails',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || current_setting('my_app.resend_api_key'),
      'Content-Type', 'application/json'
    ),
    body := jsonb_build_object(
      'from', 'noreply@upnexxt.nl',
      'to', admin_email,
      'subject', 'New User Registration Request',
      'html', format(
        'New user registration request from %s.<br><br>' ||
        'Click <a href="%s">here</a> to approve the registration.',
        new.email,
        approval_url
      )
    )
  );

  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user registration
create trigger on_pending_user_created
  after insert on pending_users
  for each row
  execute function handle_new_user_registration();

-- RLS Policies

-- Enable RLS on pending_users
alter table pending_users enable row level security;

-- Policy for inserting new pending users (anyone can create)
create policy "Anyone can create a pending user request"
  on pending_users for insert
  to public
  with check (true);

-- Policy for viewing own pending status
create policy "Users can view their own pending status"
  on pending_users for select
  to public
  using (auth.uid() = user_id);

-- Policy for admin to view all pending users
create policy "Admins can view all pending users"
  on pending_users for select
  to authenticated
  using (auth.email() = 'vanleeuwen.daniel@upnexxt.nl');

-- Function to approve a user
create or replace function approve_user(user_email text)
returns void as $$
declare
  target_user_id uuid;
begin
  -- Verify the current user is the admin
  if auth.email() != 'vanleeuwen.daniel@upnexxt.nl' then
    raise exception 'Unauthorized';
  end if;

  -- Get the user ID from pending_users
  select user_id into target_user_id
  from pending_users
  where email = user_email;

  if target_user_id is null then
    raise exception 'User not found in pending requests';
  end if;

  -- Update user's approved status
  update auth.users
  set approved = true
  where id = target_user_id;

  -- Delete from pending_users
  delete from pending_users
  where user_id = target_user_id;

  -- Send approval notification to user
  perform net.http_post(
    url := 'https://api.resend.com/emails',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || current_setting('my_app.resend_api_key'),
      'Content-Type', 'application/json'
    ),
    body := jsonb_build_object(
      'from', 'noreply@upnexxt.nl',
      'to', user_email,
      'subject', 'Account Approved',
      'html', 'Your account has been approved. You can now log in to the application.'
    )
  );
end;
$$ language plpgsql security definer;