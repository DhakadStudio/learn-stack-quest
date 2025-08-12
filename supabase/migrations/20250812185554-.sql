-- Create enum types
CREATE TYPE public.question_difficulty AS ENUM ('easy', 'medium', 'hard');
CREATE TYPE public.question_status AS ENUM ('not_attempted', 'completed', 'bookmarked', 'incomplete');

-- Create subjects table
CREATE TABLE public.subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id TEXT NOT NULL,
    name TEXT NOT NULL,
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chapters table
CREATE TABLE public.chapters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    chapter_number INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create topics table
CREATE TABLE public.topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chapter_id UUID REFERENCES public.chapters(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    topic_number INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create questions table
CREATE TABLE public.questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id UUID REFERENCES public.topics(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    answer_text TEXT NOT NULL,
    year INTEGER,
    difficulty public.question_difficulty,
    image_url TEXT,
    concepts TEXT[],
    estimated_time INTEGER DEFAULT 60,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_progress table for tracking individual question progress
CREATE TABLE public.user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
    status public.question_status DEFAULT 'not_attempted',
    time_spent INTEGER DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE,
    bookmarked_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, question_id)
);

-- Create user_stats table for overall performance tracking
CREATE TABLE public.user_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE,
    total_questions_attempted INTEGER DEFAULT 0,
    total_questions_completed INTEGER DEFAULT 0,
    total_time_spent INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create topic_progress table for topic-level progress tracking
CREATE TABLE public.topic_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    topic_id UUID REFERENCES public.topics(id) ON DELETE CASCADE,
    total_questions INTEGER DEFAULT 0,
    completed_questions INTEGER DEFAULT 0,
    time_spent INTEGER DEFAULT 0,
    percentage_completed DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, topic_id)
);

-- Create bug_reports table
CREATE TABLE public.bug_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    question_id UUID REFERENCES public.questions(id) ON DELETE SET NULL,
    topic_id UUID REFERENCES public.topics(id) ON DELETE SET NULL,
    report_type TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'open',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create app_settings table for managing app configuration
CREATE TABLE public.app_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topic_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bug_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Public read access for educational content
CREATE POLICY "Public read access for subjects" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Public read access for chapters" ON public.chapters FOR SELECT USING (true);
CREATE POLICY "Public read access for topics" ON public.topics FOR SELECT USING (true);
CREATE POLICY "Public read access for questions" ON public.questions FOR SELECT USING (true);
CREATE POLICY "Public read access for app_settings" ON public.app_settings FOR SELECT USING (true);

-- User-specific access for progress and stats
CREATE POLICY "Users can view their own progress" ON public.user_progress FOR SELECT USING (user_id::text = current_setting('request.jwt.claim.sub', true));
CREATE POLICY "Users can insert their own progress" ON public.user_progress FOR INSERT WITH CHECK (user_id::text = current_setting('request.jwt.claim.sub', true));
CREATE POLICY "Users can update their own progress" ON public.user_progress FOR UPDATE USING (user_id::text = current_setting('request.jwt.claim.sub', true));

CREATE POLICY "Users can view their own stats" ON public.user_stats FOR SELECT USING (user_id::text = current_setting('request.jwt.claim.sub', true));
CREATE POLICY "Users can insert their own stats" ON public.user_stats FOR INSERT WITH CHECK (user_id::text = current_setting('request.jwt.claim.sub', true));
CREATE POLICY "Users can update their own stats" ON public.user_stats FOR UPDATE USING (user_id::text = current_setting('request.jwt.claim.sub', true));

CREATE POLICY "Users can view their own topic progress" ON public.topic_progress FOR SELECT USING (user_id::text = current_setting('request.jwt.claim.sub', true));
CREATE POLICY "Users can insert their own topic progress" ON public.topic_progress FOR INSERT WITH CHECK (user_id::text = current_setting('request.jwt.claim.sub', true));
CREATE POLICY "Users can update their own topic progress" ON public.topic_progress FOR UPDATE USING (user_id::text = current_setting('request.jwt.claim.sub', true));

CREATE POLICY "Users can insert bug reports" ON public.bug_reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view their own bug reports" ON public.bug_reports FOR SELECT USING (user_id::text = current_setting('request.jwt.claim.sub', true));

-- Create indexes for performance
CREATE INDEX idx_questions_topic_id ON public.questions(topic_id);
CREATE INDEX idx_questions_year ON public.questions(year);
CREATE INDEX idx_questions_difficulty ON public.questions(difficulty);
CREATE INDEX idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX idx_user_progress_question_id ON public.user_progress(question_id);
CREATE INDEX idx_topic_progress_user_id ON public.topic_progress(user_id);
CREATE INDEX idx_topic_progress_topic_id ON public.topic_progress(topic_id);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON public.subjects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_chapters_updated_at BEFORE UPDATE ON public.chapters FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_topics_updated_at BEFORE UPDATE ON public.topics FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON public.questions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON public.user_progress FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_stats_updated_at BEFORE UPDATE ON public.user_stats FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_topic_progress_updated_at BEFORE UPDATE ON public.topic_progress FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bug_reports_updated_at BEFORE UPDATE ON public.bug_reports FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_app_settings_updated_at BEFORE UPDATE ON public.app_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.subjects (id, class_id, name, icon) VALUES 
('550e8400-e29b-41d4-a716-446655440001', '10', 'Mathematics', '📐'),
('550e8400-e29b-41d4-a716-446655440002', '10', 'Physics', '⚛️'),
('550e8400-e29b-41d4-a716-446655440003', '10', 'Chemistry', '🧪'),
('550e8400-e29b-41d4-a716-446655440004', '12', 'Mathematics', '📐'),
('550e8400-e29b-41d4-a716-446655440005', '12', 'Physics', '⚛️'),
('550e8400-e29b-41d4-a716-446655440006', '12', 'Chemistry', '🧪');

INSERT INTO public.chapters (id, subject_id, name, chapter_number) VALUES 
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Real Numbers', 1),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Polynomials', 2),
('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'Light', 1),
('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'Electricity', 2);

INSERT INTO public.topics (id, chapter_id, name, topic_number) VALUES 
('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'Euclid Division Algorithm', 1),
('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 'Fundamental Theorem of Arithmetic', 2),
('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002', 'Relationship between Zeros and Coefficients', 1),
('770e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440003', 'Reflection of Light', 1);

INSERT INTO public.questions (topic_id, question_text, answer_text, year, difficulty, concepts, estimated_time) VALUES 
('770e8400-e29b-41d4-a716-446655440001', 'Use Euclid division algorithm to find HCF of 96 and 404.', '404 = 96 × 4 + 20, 96 = 20 × 4 + 16, 20 = 16 × 1 + 4, 16 = 4 × 4 + 0. Therefore, HCF = 4.', 2023, 'medium', ARRAY['HCF', 'Euclid Algorithm'], 180),
('770e8400-e29b-41d4-a716-446655440001', 'Find the HCF of 867 and 255 using Euclid division algorithm.', '867 = 255 × 3 + 102, 255 = 102 × 2 + 51, 102 = 51 × 2 + 0. Therefore, HCF = 51.', 2022, 'easy', ARRAY['HCF', 'Euclid Algorithm'], 120),
('770e8400-e29b-41d4-a716-446655440002', 'Express 156 as a product of its prime factors.', '156 = 2² × 3 × 13', 2023, 'easy', ARRAY['Prime Factorization'], 90),
('770e8400-e29b-41d4-a716-446655440004', 'State the laws of reflection of light.', 'The two laws of reflection are: 1) The incident ray, reflected ray and normal all lie in the same plane. 2) The angle of incidence is equal to the angle of reflection.', 2022, 'easy', ARRAY['Reflection', 'Laws of Reflection'], 60);

-- Insert app settings
INSERT INTO public.app_settings (key, value) VALUES 
('app_name', '"? Bank"'),
('app_version', '"1.0.0"'),
('maintenance_mode', 'false'),
('loading_message', '"Fetching questions... This may take 10-15 seconds"');