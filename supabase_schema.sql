-- Create a table for reviews
create table if not exists reviews (
  id uuid default gen_random_uuid() primary key,
  course_id text not null,
  course_title_context text,
  professor text not null,
  year text not null,
  content text not null,
  author text,
  created_at timestamptz default now()
);

-- Enable Row Level Security (RLS) on reviews
alter table reviews enable row level security;

-- Create policies for reviews
create policy "Public reviews are viewable by everyone"
on reviews for select
to anon
using (true);

create policy "Anyone can insert reviews"
on reviews for insert
to anon
with check (true);

-- Create a table for courses
create table if not exists courses (
  id uuid default gen_random_uuid() primary key,
  sln text not null,
  code text not null,
  section text not null,
  title text not null,
  credits int not null,
  instructor text not null,
  room text not null,
  days text not null,
  time text not null,
  quarter text not null,
  info text,
  syllabus_link text,
  course_catalog_link text,
  syllabus jsonb,
  created_at timestamptz default now()
);

-- Enable Row Level Security (RLS) on courses
alter table courses enable row level security;

-- Create policies for courses
create policy "Public courses are viewable by everyone"
on courses for select
to anon
using (true);

create policy "Anyone can insert courses"
on courses for insert
to anon
with check (true);

-- Create a table for votes
create table if not exists votes (
  id uuid default gen_random_uuid() primary key,
  course_id text not null,
  created_at timestamptz default now()
);

-- Enable Row Level Security (RLS) on votes
alter table votes enable row level security;

-- Create policies for votes
create policy "Public votes are viewable by everyone"
on votes for select
to anon
using (true);

create policy "Anyone can insert votes"
on votes for insert
to anon
with check (true);
