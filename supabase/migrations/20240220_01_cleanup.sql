-- Clean up existing objects
do $$ 
declare
    r record;
begin
    -- Drop policies
    for r in (select policyname from pg_policies where schemaname = 'public' and tablename = 'pending_users') loop
        execute format('drop policy if exists %I on pending_users', r.policyname);
    end loop;

    -- Drop triggers
    drop trigger if exists on_pending_user_created on pending_users;
    
    -- Drop functions with cascade
    drop function if exists approve_user(text) cascade;
    drop function if exists handle_new_user_registration() cascade;
    drop function if exists add_approved_column_to_users() cascade;
    
    -- Finally drop the table
    drop table if exists pending_users cascade;
end $$;