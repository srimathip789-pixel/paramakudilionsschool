-- =====================================================================
-- SECURITY FIX: only listed admins can change data (not every logged-in user)
-- Run once in Supabase Dashboard → SQL Editor.
-- BEFORE running: replace the email below with the real admin login email.
-- ALSO: Authentication → Providers → Email → turn OFF "Allow new users to sign up"
-- =====================================================================

-- 1. Admin allow-list
CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  added_at timestamptz DEFAULT now()
);
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
-- No policies on admin_users = nobody can read/modify it through the API.

INSERT INTO public.admin_users (user_id)
SELECT id FROM auth.users WHERE email = 'REPLACE_WITH_ADMIN_EMAIL@example.com'
ON CONFLICT DO NOTHING;

-- 2. Helper: is the current user an admin?
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()); $$;
REVOKE ALL ON FUNCTION public.is_admin() FROM public;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- 3. Replace "any authenticated user" write policies with admin-only ones
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['committee_members','staff','albums','gallery_photos','videos',
                           'news','events','achievements','downloads','notices','contact_settings']
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', 'Allow admin write ' || t, t);
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', 'Admins only write ' || t, t);
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin())',
      'Admins only write ' || t, t);
  END LOOP;
END $$;

-- 4. Storage bucket: only admins can upload / change / delete files
DROP POLICY IF EXISTS "Admin Access" ON storage.objects;
DROP POLICY IF EXISTS "Admins only school-assets" ON storage.objects;
CREATE POLICY "Admins only school-assets" ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'school-assets' AND public.is_admin())
  WITH CHECK (bucket_id = 'school-assets' AND public.is_admin());

-- 5. Check: should return true when run while logged in as the admin, and
--    SELECT * FROM public.admin_users;  should list exactly one row.
