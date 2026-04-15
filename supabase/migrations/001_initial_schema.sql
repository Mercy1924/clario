-- Clarios Database Schema
-- April 2026

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- PROFILES (extends auth.users)
-- ============================================================================

CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  preferences JSONB DEFAULT '{}'::jsonb
);

-- RLS Policies for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- SESSIONS
-- ============================================================================

CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  mode TEXT NOT NULL CHECK (mode IN ('tidy', 'restructure')),
  status TEXT NOT NULL CHECK (status IN ('active', 'complete', 'abandoned')) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for user's sessions
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_status ON sessions(status);

-- RLS Policies for sessions
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions"
  ON sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own sessions"
  ON sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================================
-- SPACES
-- ============================================================================

CREATE TABLE spaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  name TEXT,
  type TEXT,
  goal TEXT,
  description_method TEXT CHECK (description_method IN ('type', 'voice', 'skipped')),
  images TEXT[], -- Array of Supabase Storage URLs
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_spaces_session_id ON spaces(session_id);

-- RLS Policies for spaces
ALTER TABLE spaces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own spaces"
  ON spaces FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM sessions
    WHERE sessions.id = spaces.session_id
    AND sessions.user_id = auth.uid()
  ));

CREATE POLICY "Users can create own spaces"
  ON spaces FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM sessions
    WHERE sessions.id = spaces.session_id
    AND sessions.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own spaces"
  ON spaces FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM sessions
    WHERE sessions.id = spaces.session_id
    AND sessions.user_id = auth.uid()
  ));

-- ============================================================================
-- ANALYSIS
-- ============================================================================

CREATE TABLE analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  annotated_image_url TEXT,
  findings JSONB DEFAULT '[]'::jsonb,
  mode_recommendation TEXT CHECK (mode_recommendation IN ('tidy', 'restructure')),
  mode_rationale TEXT,
  context_confirmed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analysis_session_id ON analysis(session_id);

-- RLS Policies for analysis
ALTER TABLE analysis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own analysis"
  ON analysis FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM sessions
    WHERE sessions.id = analysis.session_id
    AND sessions.user_id = auth.uid()
  ));

CREATE POLICY "Users can create own analysis"
  ON analysis FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM sessions
    WHERE sessions.id = analysis.session_id
    AND sessions.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own analysis"
  ON analysis FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM sessions
    WHERE sessions.id = analysis.session_id
    AND sessions.user_id = auth.uid()
  ));

-- ============================================================================
-- DIAGRAMS (Restructure Mode only)
-- ============================================================================

CREATE TABLE diagrams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  before_svg TEXT,
  after_svg TEXT,
  annotations JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_diagrams_session_id ON diagrams(session_id);

-- RLS Policies for diagrams
ALTER TABLE diagrams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own diagrams"
  ON diagrams FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM sessions
    WHERE sessions.id = diagrams.session_id
    AND sessions.user_id = auth.uid()
  ));

CREATE POLICY "Users can create own diagrams"
  ON diagrams FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM sessions
    WHERE sessions.id = diagrams.session_id
    AND sessions.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own diagrams"
  ON diagrams FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM sessions
    WHERE sessions.id = diagrams.session_id
    AND sessions.user_id = auth.uid()
  ));

-- ============================================================================
-- STEPS
-- ============================================================================

CREATE TABLE steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  step_order INTEGER NOT NULL,
  title TEXT NOT NULL,
  substeps JSONB DEFAULT '[]'::jsonb,
  time_estimate INTEGER, -- in minutes
  status TEXT NOT NULL CHECK (status IN ('pending', 'done', 'skipped')) DEFAULT 'pending',
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_steps_session_id ON steps(session_id);
CREATE INDEX idx_steps_order ON steps(session_id, step_order);

-- RLS Policies for steps
ALTER TABLE steps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own steps"
  ON steps FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM sessions
    WHERE sessions.id = steps.session_id
    AND sessions.user_id = auth.uid()
  ));

CREATE POLICY "Users can create own steps"
  ON steps FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM sessions
    WHERE sessions.id = steps.session_id
    AND sessions.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own steps"
  ON steps FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM sessions
    WHERE sessions.id = steps.session_id
    AND sessions.user_id = auth.uid()
  ));

-- ============================================================================
-- TRIGGERS FOR updated_at
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at
  BEFORE UPDATE ON sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- FUNCTION: Create profile on user signup
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
