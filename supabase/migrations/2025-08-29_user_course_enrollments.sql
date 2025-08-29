-- Create user_course_enrollments table
create table if not exists public.user_course_enrollments (
  clerk_user_id text unique not null,
  learning_goal text,
  current_path text,
  current_course text,
  total_modules_in_course integer default 0,
  enrolled_at timestamp not null default now(),
  constraint user_course_enrollments_pkey primary key (clerk_user_id),
  constraint user_course_enrollments_clerk_fk foreign key (clerk_user_id)
    references public.user_login_credentials (clerk_user_id)
    on delete cascade
);

-- Enable RLS on related tables
alter table if exists public.user_login_credentials enable row level security;
alter table if exists public.user_course_enrollments enable row level security;

-- Policy: Users can manage their own login row
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'user_login_credentials'
      and policyname = 'Users can manage their own login row'
  ) then
    create policy "Users can manage their own login row"
      on public.user_login_credentials
      for all
      using (clerk_user_id = auth.jwt() ->> 'sub')
      with check (clerk_user_id = auth.jwt() ->> 'sub');
  end if;
end$$;

-- Policies for enrollments: users can manage their own enrollment
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'user_course_enrollments'
      and policyname = 'Users can view their own enrollments'
  ) then
    create policy "Users can view their own enrollments"
      on public.user_course_enrollments
      for select
      using (clerk_user_id = auth.jwt() ->> 'sub');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'user_course_enrollments'
      and policyname = 'Users can insert their own enrollment'
  ) then
    create policy "Users can insert their own enrollment"
      on public.user_course_enrollments
      for insert
      with check (clerk_user_id = auth.jwt() ->> 'sub');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'user_course_enrollments'
      and policyname = 'Users can update their own enrollment'
  ) then
    create policy "Users can update their own enrollment"
      on public.user_course_enrollments
      for update
      using (clerk_user_id = auth.jwt() ->> 'sub')
      with check (clerk_user_id = auth.jwt() ->> 'sub');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'user_course_enrollments'
      and policyname = 'Users can delete their own enrollment'
  ) then
    create policy "Users can delete their own enrollment"
      on public.user_course_enrollments
      for delete
      using (clerk_user_id = auth.jwt() ->> 'sub');
  end if;
end$$;
