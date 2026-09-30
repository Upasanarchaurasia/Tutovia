-- ============================================================================
-- ICAI Study Material Indexing & Delivery System - Database Schema
-- Compatible with Supabase / PostgreSQL
-- ============================================================================

-- 1. Create table
CREATE TABLE IF NOT EXISTS public.icai_study_materials (
    id VARCHAR(120) PRIMARY KEY,
    course VARCHAR(50) NOT NULL,            -- e.g. 'CA Intermediate', 'CA Final', 'CA Foundation'
    group_name VARCHAR(50),                 -- e.g. 'Group 1', 'Group 2', 'Core'
    subject VARCHAR(120) NOT NULL,          -- e.g. 'Advanced Accounting', 'Corporate and Other Laws'
    module VARCHAR(120),                    -- e.g. 'Module 1', 'Accounting Standards'
    chapter_title TEXT NOT NULL,            -- e.g. 'AS 7 Construction Contracts', 'Chapter 1: Preliminary'
    pdf_url TEXT NOT NULL,                  -- Direct ICAI CDN link: 'https://resource.cdn.icai.org/...'
    portal_source_url TEXT,                 -- ICAI BoS page where it was indexed from
    file_size_approx VARCHAR(30),           -- e.g. '1.2 MB'
    page_count INTEGER,                     -- Optional page count
    is_active BOOLEAN DEFAULT TRUE,
    last_scraped_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Indexes for high-performance instant searches and filtering
CREATE INDEX IF NOT EXISTS idx_icai_materials_course ON public.icai_study_materials(course);
CREATE INDEX IF NOT EXISTS idx_icai_materials_subject ON public.icai_study_materials(subject);
CREATE INDEX IF NOT EXISTS idx_icai_materials_group ON public.icai_study_materials(group_name);
CREATE INDEX IF NOT EXISTS idx_icai_materials_chapter ON public.icai_study_materials USING gin(to_tsvector('english', chapter_title || ' ' || subject || ' ' || COALESCE(module, '')));

-- 3. Row Level Security (RLS)
ALTER TABLE public.icai_study_materials ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all students and guests
DROP POLICY IF EXISTS "Public can view study materials" ON public.icai_study_materials;
CREATE POLICY "Public can view study materials" 
ON public.icai_study_materials 
FOR SELECT 
USING (true);

-- Allow authenticated admins / service role to insert or update study materials
DROP POLICY IF EXISTS "Admins can manage study materials" ON public.icai_study_materials;
CREATE POLICY "Admins can manage study materials" 
ON public.icai_study_materials 
FOR ALL 
USING (
    auth.role() = 'service_role' OR 
    auth.uid() IN (SELECT id FROM public.profiles WHERE email = 'chaurasiaupasana70@gmail.com')
);

-- 4. Automatic updated_at trigger
CREATE OR REPLACE FUNCTION update_icai_materials_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_icai_materials_updated_at ON public.icai_study_materials;
CREATE TRIGGER trigger_icai_materials_updated_at
BEFORE UPDATE ON public.icai_study_materials
FOR EACH ROW
EXECUTE FUNCTION update_icai_materials_updated_at();

-- Comment explaining copyright & bandwidth architecture
COMMENT ON TABLE public.icai_study_materials IS 'Official ICAI BoS Study Material PDF catalog. Contains direct CDN links without storing proprietary binaries.';
