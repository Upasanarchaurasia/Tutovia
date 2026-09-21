-- Supabase Schema for Tutovia

-- 1. Users Profile Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users NOT NULL PRIMARY KEY,
  email text,
  name text,
  ca_stage text,
  ca_group text,
  attempt text,
  target_score text,
  exam_date date,
  daily_study_hours int,
  wake_time text,
  sleep_time text,
  commitments text,
  why_this_schedule text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. User Progress
CREATE TABLE IF NOT EXISTS public.user_progress (
  user_id uuid REFERENCES public.profiles(id) NOT NULL PRIMARY KEY,
  total_study_minutes int DEFAULT 0,
  completed_pomodoros int DEFAULT 0,
  completed_exams int DEFAULT 0,
  current_streak int DEFAULT 0
);

-- 3. Schedule / Timetable
CREATE TABLE IF NOT EXISTS public.schedule (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) NOT NULL,
  time_range text,
  start_mins int,
  activity text,
  focus text,
  type text,
  status text DEFAULT 'Not Completed',
  done boolean DEFAULT false,
  link text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Exam Attempts
CREATE TABLE IF NOT EXISTS public.exam_attempts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) NOT NULL,
  exam_id text,
  exam_title text,
  score int,
  total_questions int,
  accuracy numeric,
  weak_topics text[],
  completed_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Flashcards
CREATE TABLE IF NOT EXISTS public.flashcards (
  id text PRIMARY KEY,
  subject text,
  chapter text,
  question text,
  answer text
);

-- 6. Flashcard Progress
CREATE TABLE IF NOT EXISTS public.flashcard_progress (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) NOT NULL,
  flashcard_id text REFERENCES public.flashcards(id) NOT NULL,
  status text, -- 'memorized', 'learning', etc.
  last_reviewed timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Mood Tracker
CREATE TABLE IF NOT EXISTS public.mood_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) NOT NULL,
  mood text,
  note text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Doubts (Tutor Chat)
CREATE TABLE IF NOT EXISTS public.doubts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) NOT NULL,
  question text,
  answer text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Disable Row Level Security temporarily for easy migration (Important for current backend to function without full JWT auth refactor yet)
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_attempts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcards DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcard_progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.doubts DISABLE ROW LEVEL SECURITY;
