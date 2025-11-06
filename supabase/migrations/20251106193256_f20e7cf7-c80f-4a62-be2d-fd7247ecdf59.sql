-- Create profiles table for user data
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies: users can read their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Update questions table RLS policies
-- Remove the public read policy
DROP POLICY IF EXISTS "Allow select for anon users" ON public.questions;

-- Add authenticated user policy for questions (without answers initially)
CREATE POLICY "Authenticated users can view questions"
  ON public.questions
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Update exams table to allow authenticated reads
CREATE POLICY "Authenticated users can read exams"
  ON public.exams
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Trigger for updating updated_at on profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();