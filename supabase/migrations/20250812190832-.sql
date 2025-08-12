-- Fix security issue: Restrict questions access to authenticated users only
-- Remove the public read policy that allows unrestricted access
DROP POLICY IF EXISTS "Public read access for questions" ON public.questions;

-- Create new policy that requires authentication
CREATE POLICY "Authenticated users can view questions" 
ON public.questions 
FOR SELECT 
TO authenticated
USING (true);

-- Also update other tables to require authentication for consistency
DROP POLICY IF EXISTS "Public read access for subjects" ON public.subjects;
CREATE POLICY "Authenticated users can view subjects" 
ON public.subjects 
FOR SELECT 
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Public read access for chapters" ON public.chapters;
CREATE POLICY "Authenticated users can view chapters" 
ON public.chapters 
FOR SELECT 
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Public read access for topics" ON public.topics;
CREATE POLICY "Authenticated users can view topics" 
ON public.topics 
FOR SELECT 
TO authenticated
USING (true);

-- Keep app_settings public as it may contain non-sensitive configuration data
-- Keep the existing app_settings policy unchanged