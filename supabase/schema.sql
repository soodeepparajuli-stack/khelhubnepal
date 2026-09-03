-- ============================================================
-- KhelHub Nepal News Portal - Production Supabase Schema
-- Run this in your Supabase SQL Editor (supabase.com)
-- ============================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  color TEXT DEFAULT '#e31e24',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. News articles table
CREATE TABLE IF NOT EXISTS news (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  category_name TEXT,
  category_slug TEXT,
  image_url TEXT,
  author TEXT DEFAULT 'KhelHub Nepal',
  published_at TIMESTAMPTZ DEFAULT NOW(),
  is_featured BOOLEAN DEFAULT false,
  is_breaking BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Ads table
CREATE TABLE IF NOT EXISTS ads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL CHECK (position IN ('header', 'sidebar', 'footer', 'in-article', 'breaking')),
  image_url TEXT,
  link_url TEXT,
  code TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Seed default sports categories
INSERT INTO categories (name, slug, color) VALUES
  ('फुटबल', 'football', '#2ecc71'),
  ('क्रिकेट', 'cricket', '#3498db'),
  ('भलिबल', 'volleyball', '#e67e22'),
  ('बास्केटबल', 'basketball', '#e31e24'),
  ('eSports', 'esports', '#9b59b6'),
  ('अन्य खेल', 'others', '#1abc9c')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  color = EXCLUDED.color;

-- 6. Enable Row Level Security (RLS)
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;

-- 7. Drop existing policies to prevent conflict when rerunning
DROP POLICY IF EXISTS "Public can read published news" ON news;
DROP POLICY IF EXISTS "Public can read categories" ON categories;
DROP POLICY IF EXISTS "Public can read active ads" ON ads;

DROP POLICY IF EXISTS "Admin full access news" ON news;
DROP POLICY IF EXISTS "Admin full access categories" ON categories;
DROP POLICY IF EXISTS "Admin full access ads" ON ads;

-- 8. Create Public Read Policies
CREATE POLICY "Public can read published news" ON news
  FOR SELECT USING (is_published = true);

CREATE POLICY "Public can read categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Public can read active ads" ON ads
  FOR SELECT USING (is_active = true);

-- Note: The service_role key automatically bypasses RLS for admin actions.
-- For authenticated anon/custom roles if used:
CREATE POLICY "Admin full access news" ON news
  FOR ALL USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Admin full access categories" ON categories
  FOR ALL USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Admin full access ads" ON ads
  FOR ALL USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- 9. Storage Bucket setup for News Images
-- Create 'news-images' bucket if it doesn't already exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('news-images', 'news-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage RLS policies (proper WITH CHECK for INSERT)
DROP POLICY IF EXISTS "Public can view news images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated and service role image uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow image deletions" ON storage.objects;

CREATE POLICY "Public can view news images" ON storage.objects
  FOR SELECT USING (bucket_id = 'news-images');

CREATE POLICY "Allow authenticated and service role image uploads" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'news-images');

CREATE POLICY "Allow image deletions" ON storage.objects
  FOR DELETE USING (bucket_id = 'news-images');

-- 10. View Counter Function (invoked when users view an article)
CREATE OR REPLACE FUNCTION increment_views(article_slug TEXT)
RETURNS void AS $$
BEGIN
  UPDATE news SET views = views + 1 WHERE slug = article_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
