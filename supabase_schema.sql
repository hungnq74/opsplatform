-- Schema for Operations Platform

-- 1. Create custom enum types
DO $$ BEGIN
    CREATE TYPE public.user_role AS ENUM ('admin', 'user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Organizations table
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'locked', 'archived'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 3. Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
    role public.user_role DEFAULT 'user',
    full_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own profile or if they are admin" ON public.profiles;
CREATE POLICY "Users can view their own profile or if they are admin" ON public.profiles
FOR SELECT USING (
  auth.uid() = id OR 
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- 4. Forms table
CREATE TABLE IF NOT EXISTS public.forms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    version INTEGER DEFAULT 1,
    status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'published', 'archived'
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 5. Form Fields table
CREATE TABLE IF NOT EXISTS public.form_fields (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    form_id UUID REFERENCES public.forms(id) ON DELETE CASCADE,
    label VARCHAR(255) NOT NULL,
    field_type VARCHAR(50) NOT NULL,
    is_required BOOLEAN DEFAULT false,
    validation_rules JSONB,
    display_order INTEGER DEFAULT 0,
    options JSONB
);

-- 6. Submissions table
CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    form_id UUID REFERENCES public.forms(id) ON DELETE CASCADE,
    form_version INTEGER DEFAULT 1,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
    submitted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'submitted',
    data JSONB NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS for Submissions
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can only view and insert their own org's submissions" ON public.submissions;
CREATE POLICY "Users can only view and insert their own org's submissions" ON public.submissions
FOR ALL USING (
  organization_id = (SELECT organization_id FROM public.profiles WHERE id = auth.uid()) OR 
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- 7. Submission History
CREATE TABLE IF NOT EXISTS public.submission_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID REFERENCES public.submissions(id) ON DELETE CASCADE,
    edited_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    changes JSONB,
    previous_data JSONB,
    edited_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Bỏ Trigger Cũ (Gây lỗi tạo account)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Viết lại hàm Trigger An Toàn (tự động bỏ qua lỗi nếu metadata sai lệch)
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  BEGIN
    INSERT INTO public.profiles (id, full_name, role)
    VALUES (
      new.id, 
      NULLIF(new.raw_user_meta_data->>'full_name', ''),
      COALESCE(NULLIF(new.raw_user_meta_data->>'role', '')::public.user_role, 'user'::public.user_role)
    );
  EXCEPTION WHEN OTHERS THEN
    -- Bắt mọi ngoại lệ về format DB và bỏ qua để auth.users vẫn được Insert bình thường
  END;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Cài lại Trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- AUTO ADMIN SEEDER: Tự động khởi tạo tài khoản cố định
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  new_admin_id UUID := gen_random_uuid();
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@opsplatform.com') THEN
    -- 1. Insert Core Auth User
    INSERT INTO auth.users (
      id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, 
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at
    ) VALUES (
      new_admin_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
      'admin@opsplatform.com', crypt('admin123', gen_salt('bf')), NOW(),
      '{"provider":"email","providers":["email"]}', '{"role":"admin","full_name":"Super Admin"}', NOW(), NOW()
    );

    -- 2. Đảm bảo chèn dữ liệu Profile (nếu Trigger failed)
    INSERT INTO public.profiles (id, full_name, role)
    VALUES (new_admin_id, 'Super Admin', 'admin')
    ON CONFLICT (id) DO UPDATE SET role = 'admin', full_name = 'Super Admin';
    
    RAISE NOTICE 'Auto Admin Account created successfully!';
  ELSE
    RAISE NOTICE 'Account admin@opsplatform.com already exists. Skipped.';
  END IF;
END $$;
