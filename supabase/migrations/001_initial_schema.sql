-- Profiles table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  bio TEXT,
  voice_description TEXT,
  timezone TEXT DEFAULT 'America/New_York',
  digest_hour INTEGER DEFAULT 18,
  digest_enabled BOOLEAN DEFAULT true,
  onboarding_complete BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Writing samples for voice matching
CREATE TABLE public.writing_samples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Links saved by users
CREATE TABLE public.links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  image_url TEXT,
  site_name TEXT,
  extracted_content TEXT,
  ai_summary TEXT,
  user_note TEXT,
  link_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- File uploads
CREATE TABLE public.uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  storage_path TEXT NOT NULL,
  public_url TEXT,
  user_note TEXT,
  upload_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Generated daily digests
CREATE TABLE public.digests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  digest_date DATE NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  link_count INTEGER DEFAULT 0,
  upload_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  export_linkedin TEXT,
  export_x TEXT,
  export_medium TEXT,
  export_substack TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, digest_date)
);

-- Indexes
CREATE INDEX idx_links_user_date ON public.links(user_id, link_date DESC);
CREATE INDEX idx_uploads_user_date ON public.uploads(user_id, upload_date DESC);
CREATE INDEX idx_digests_user_date ON public.digests(user_id, digest_date DESC);
CREATE INDEX idx_digests_slug ON public.digests(slug);

-- RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

ALTER TABLE public.writing_samples ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own samples" ON public.writing_samples FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own samples" ON public.writing_samples FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own samples" ON public.writing_samples FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own links" ON public.links FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own links" ON public.links FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own links" ON public.links FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own links" ON public.links FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE public.uploads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own uploads" ON public.uploads FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own uploads" ON public.uploads FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own uploads" ON public.uploads FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own uploads" ON public.uploads FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE public.digests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own digests" ON public.digests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view published digests" ON public.digests FOR SELECT USING (is_published = true);
CREATE POLICY "Users can insert own digests" ON public.digests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own digests" ON public.digests FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own digests" ON public.digests FOR DELETE USING (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Storage bucket for user content
INSERT INTO storage.buckets (id, name, public) VALUES ('user-content', 'user-content', false);

-- Storage RLS
CREATE POLICY "Users can upload own files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'user-content'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can read own files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'user-content'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'user-content'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
