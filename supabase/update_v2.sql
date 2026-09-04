-- ============================================================
-- KhelHub Nepal - Database Update (Our Team & Banner News)
-- Copy and paste this into Supabase SQL Editor and click 'Run'
-- Link: https://supabase.com/dashboard/project/nvixnwtwilzezytqsjfp/sql
-- ============================================================

-- 1. Add is_banner column to news table
ALTER TABLE news ADD COLUMN IF NOT EXISTS is_banner BOOLEAN DEFAULT false;

-- 2. Create team_members (हाम्रो टिम) table
CREATE TABLE IF NOT EXISTS team_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  image_url TEXT,
  bio TEXT,
  display_order INTEGER DEFAULT 1,
  phone TEXT,
  email TEXT,
  facebook_url TEXT,
  twitter_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- 4. Policies for team_members
DROP POLICY IF EXISTS "Public can read team members" ON team_members;
CREATE POLICY "Public can read team members" ON team_members
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin full access team members" ON team_members;
CREATE POLICY "Admin full access team members" ON team_members
  FOR ALL USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- 5. Seed initial team member if empty
INSERT INTO team_members (name, role, image_url, bio, display_order, phone, email)
SELECT 'सुदीप पराजुली', 'प्रबन्ध निर्देशक तथा प्रधान सम्पादक', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop', 'नेपाली खेलकुद पत्रकारितामा दशक लामो अनुभव। KhelHub Nepal का संस्थापक।', 1, '९८६७४२३१९७', 'khelhub61@gmail.com'
WHERE NOT EXISTS (SELECT 1 FROM team_members LIMIT 1);
