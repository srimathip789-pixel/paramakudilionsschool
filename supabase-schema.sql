-- ====================================================
-- Database Schema for Paramakudi Lions School Website
-- Copy and paste this script into your Supabase SQL Editor
-- ====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Committee Members
CREATE TABLE IF NOT EXISTS committee_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  designation TEXT NOT NULL,
  description TEXT,
  photo_url TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Staff (Teachers)
CREATE TABLE IF NOT EXISTS staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  department TEXT NOT NULL, -- 'primary', 'high_school', 'kindergarten', 'sports', 'office'
  subject TEXT,
  qualification TEXT NOT NULL,
  experience TEXT,
  photo_url TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Gallery Albums
CREATE TABLE IF NOT EXISTS albums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Gallery Photos
CREATE TABLE IF NOT EXISTS gallery_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id UUID REFERENCES albums(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Videos
CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT DEFAULT 'youtube' NOT NULL, -- 'youtube' or 'mp4'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. News
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  pinned BOOLEAN DEFAULT false NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Events
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  venue TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Achievements
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name TEXT NOT NULL,
  competition TEXT NOT NULL,
  achievement TEXT NOT NULL,
  photo_url TEXT,
  certificate_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Downloads
CREATE TABLE IF NOT EXISTS downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  category TEXT NOT NULL, -- 'circular', 'admission', 'timetable', 'syllabus', 'other'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. Notices (Notice Board)
CREATE TABLE IF NOT EXISTS notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  pdf_url TEXT,
  expiry_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. Contact Settings (Single Config Row)
CREATE TABLE IF NOT EXISTS contact_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL DEFAULT '+91 - 4564- 228900',
  mobile TEXT NOT NULL DEFAULT '+91 - 89031 14444',
  email TEXT NOT NULL DEFAULT 'paramakudilions@yahoo.com',
  address TEXT NOT NULL DEFAULT 'Paramakudi Lions Matriculation Higher secondary School, Thelichathanallur, Paramakudi - 623707',
  google_maps_embed TEXT,
  office_hours TEXT DEFAULT 'Mon - Sat: 9:00 AM - 4:30 PM',
  facebook_url TEXT DEFAULT 'https://www.facebook.com/Lionsschoolpmk/',
  instagram_url TEXT,
  youtube_url TEXT DEFAULT 'https://www.youtube.com/channel/UCsUpLU-nTY_0iC59z8IvvPA',
  whatsapp_number TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ====================================================
-- Enable Row Level Security (RLS)
-- ====================================================
ALTER TABLE committee_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_settings ENABLE ROW LEVEL SECURITY;

-- ====================================================
-- RLS Policies - Allow Public Read, Admin Write
-- ====================================================

-- Committee Members Policies
CREATE POLICY "Allow public read committee_members" ON committee_members FOR SELECT USING (true);
CREATE POLICY "Allow admin write committee_members" ON committee_members FOR ALL TO authenticated USING (true);

-- Staff Policies
CREATE POLICY "Allow public read staff" ON staff FOR SELECT USING (true);
CREATE POLICY "Allow admin write staff" ON staff FOR ALL TO authenticated USING (true);

-- Albums Policies
CREATE POLICY "Allow public read albums" ON albums FOR SELECT USING (true);
CREATE POLICY "Allow admin write albums" ON albums FOR ALL TO authenticated USING (true);

-- Gallery Photos Policies
CREATE POLICY "Allow public read gallery_photos" ON gallery_photos FOR SELECT USING (true);
CREATE POLICY "Allow admin write gallery_photos" ON gallery_photos FOR ALL TO authenticated USING (true);

-- Videos Policies
CREATE POLICY "Allow public read videos" ON videos FOR SELECT USING (true);
CREATE POLICY "Allow admin write videos" ON videos FOR ALL TO authenticated USING (true);

-- News Policies
CREATE POLICY "Allow public read news" ON news FOR SELECT USING (true);
CREATE POLICY "Allow admin write news" ON news FOR ALL TO authenticated USING (true);

-- Events Policies
CREATE POLICY "Allow public read events" ON events FOR SELECT USING (true);
CREATE POLICY "Allow admin write events" ON events FOR ALL TO authenticated USING (true);

-- Achievements Policies
CREATE POLICY "Allow public read achievements" ON achievements FOR SELECT USING (true);
CREATE POLICY "Allow admin write achievements" ON achievements FOR ALL TO authenticated USING (true);

-- Downloads Policies
CREATE POLICY "Allow public read downloads" ON downloads FOR SELECT USING (true);
CREATE POLICY "Allow admin write downloads" ON downloads FOR ALL TO authenticated USING (true);

-- Notices Policies
CREATE POLICY "Allow public read notices" ON notices FOR SELECT USING (true);
CREATE POLICY "Allow admin write notices" ON notices FOR ALL TO authenticated USING (true);

-- Contact Settings Policies
CREATE POLICY "Allow public read contact_settings" ON contact_settings FOR SELECT USING (true);
CREATE POLICY "Allow admin write contact_settings" ON contact_settings FOR ALL TO authenticated USING (true);

-- ====================================================
-- Seed Contact Settings Default Entry
-- ====================================================
INSERT INTO contact_settings (id, phone, mobile, email, address, google_maps_embed, office_hours, facebook_url, youtube_url)
VALUES (
  'd3b07384-d113-431e-a5e2-04e82df43831',
  '+91 - 4564- 228900',
  '+91 - 89031 14444',
  'paramakudilions@yahoo.com',
  'Paramakudi Lions Matriculation Higher secondary School, Thelichathanallur, Paramakudi - 623707, Ramanathapuram - Dist, Tamilnadu, India.',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3936.31135439775!2d78.583908!3d9.544605!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b01511d5ffffff%3A0xc0fb1309f7a77d85!2sParamakudi%20Lions%20Matriculation%20Higher%20Secondary%20School!5e0!3m2!1sen!2sin!4v1700000000000',
  'Mon - Sat: 9:00 AM - 4:30 PM',
  'https://www.facebook.com/Lionsschoolpmk/',
  'https://www.youtube.com/channel/UCsUpLU-nTY_0iC59z8IvvPA'
) ON CONFLICT DO NOTHING;

-- ====================================================
-- Storage Buckets Configuration Instructions
-- ====================================================
-- In your Supabase Dashboard:
-- 1. Navigate to "Storage".
-- 2. Create the following public bucket:
--    - 'school-assets' (used for news, events, members, staff, achievements, and downloads)
-- 3. Set the following RLS policy for the 'school-assets' bucket:
--    - Allow SELECT to everyone (public)
--    - Allow INSERT/UPDATE/DELETE to authenticated users only
--
-- Alternatively, you can run this SQL to create the bucket and configure policies (if db extensions are active):
--
-- INSERT INTO storage.buckets (id, name, public) VALUES ('school-assets', 'school-assets', true) ON CONFLICT DO NOTHING;
--
-- CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'school-assets');
-- CREATE POLICY "Admin Access" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'school-assets');
