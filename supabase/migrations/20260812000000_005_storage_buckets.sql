-- Ta3 (تعلّم) LMS - Storage Buckets & Policies Migration
-- Migration: 20260812000000_005_storage_buckets.sql

-- 1. Create Public Storage Bucket for Course Materials (Lectures & Slides)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'course-materials',
    'course-materials',
    true,
    52428800, -- 50 MB
    ARRAY['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip', 'image/png', 'image/jpeg']
)
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit;

-- 2. Create Private Storage Bucket for Student Assignment Submissions
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'assignment-submissions',
    'assignment-submissions',
    false,
    52428800, -- 50 MB
    ARRAY['application/pdf', 'application/zip', 'application/x-zip-compressed']
)
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit;

-- 3. Storage Security RLS Policies for course-materials
CREATE POLICY "Public Read Access for Course Materials"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'course-materials');

CREATE POLICY "Authenticated Teachers Upload Course Materials"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'course-materials');

-- 4. Storage Security RLS Policies for assignment-submissions
CREATE POLICY "Students Upload Assignment Submissions"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'assignment-submissions');

CREATE POLICY "Students Read Own Assignment Submissions"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'assignment-submissions' AND (auth.uid()::text = (storage.foldername(name))[1] OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin')
)));
