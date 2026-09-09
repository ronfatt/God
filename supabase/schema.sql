-- =========================================================
-- TIANJI 52 (天机52) · Supabase Production Database Schema (Idempotent)
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard/project/ycgpxtegqmfpdydipmzm/sql)
-- =========================================================

-- 1. Profiles Table (用户信息与本命命格)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  nickname TEXT,
  avatar TEXT DEFAULT '☯',
  tokens INTEGER DEFAULT 150,
  streak INTEGER DEFAULT 1,
  total_draws INTEGER DEFAULT 0,
  birth_date DATE,
  birth_time TIME,
  gender TEXT,
  birth_place TEXT,
  zodiac TEXT,
  main_element TEXT,
  collected_card_ids JSONB DEFAULT '["H-A", "D-A", "C-A", "S-A"]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Readings Table (占验神谕记录)
CREATE TABLE IF NOT EXISTS public.readings (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  category TEXT NOT NULL,
  spread_type TEXT NOT NULL,
  cards JSONB NOT NULL, -- Array of drawn cards + manifestations
  overall_score INTEGER,
  wealth_score INTEGER,
  career_score INTEGER,
  love_score INTEGER,
  nobleman_score INTEGER,
  oracle_quote TEXT,
  dominant_element TEXT,
  element_trend JSONB,
  action_advices JSONB,
  overall_manifestation JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Daily Oracles Table (每日一牌打卡)
CREATE TABLE IF NOT EXISTS public.daily_oracles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  card_id TEXT NOT NULL,
  action_score INTEGER,
  theme_title TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_oracles ENABLE ROW LEVEL SECURITY;

-- 5. Safe Drop Existing Policies to prevent duplicate error
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

DROP POLICY IF EXISTS "Users can view their own readings" ON public.readings;
DROP POLICY IF EXISTS "Users can insert their own readings" ON public.readings;

DROP POLICY IF EXISTS "Users can view their own daily oracles" ON public.daily_oracles;
DROP POLICY IF EXISTS "Users can insert their own daily oracles" ON public.daily_oracles;

-- 6. Recreate Policies Cleanly
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view their own readings" 
ON public.readings FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own readings" 
ON public.readings FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own daily oracles" 
ON public.daily_oracles FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily oracles" 
ON public.daily_oracles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 7. Trigger for Automatic Profile Creation on Supabase Auth Sign Up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, nickname, tokens)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'nickname', split_part(NEW.email, '@', 1)),
    150
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
