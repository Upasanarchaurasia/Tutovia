-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcard_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doubts ENABLE ROW LEVEL SECURITY;

-- 1. Profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. User Progress
CREATE POLICY "Users can view own progress" ON public.user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON public.user_progress FOR ALL USING (auth.uid() = user_id);

-- 3. Schedule
CREATE POLICY "Users can manage own schedule" ON public.schedule FOR ALL USING (auth.uid() = user_id);

-- 4. Exam Attempts
CREATE POLICY "Users can manage own exam attempts" ON public.exam_attempts FOR ALL USING (auth.uid() = user_id);

-- 5. Flashcards (Global read, no write)
CREATE POLICY "Anyone can read flashcards" ON public.flashcards FOR SELECT USING (true);

-- 6. Flashcard Progress
CREATE POLICY "Users can manage own flashcard progress" ON public.flashcard_progress FOR ALL USING (auth.uid() = user_id);

-- 7. Mood Logs
CREATE POLICY "Users can manage own mood logs" ON public.mood_logs FOR ALL USING (auth.uid() = user_id);

-- 8. Doubts
CREATE POLICY "Users can manage own doubts" ON public.doubts FOR ALL USING (auth.uid() = user_id);
