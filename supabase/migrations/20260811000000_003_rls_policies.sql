-- Ta3 (تعلّم) LMS - Row-Level Security (RLS) Policies Migration
-- Migration: 20260811000000_003_rls_policies.sql

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lectures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussion_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_applications ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
CREATE POLICY "Public profiles are viewable by authenticated users"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- 2. Courses Policies
CREATE POLICY "Courses are viewable by authenticated users"
ON public.courses FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can create or modify courses"
ON public.courses FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
);

-- 3. Enrollments Policies
CREATE POLICY "Students can view their own enrollments"
ON public.enrollments FOR SELECT
TO authenticated
USING (student_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin')
));

-- 4. Lectures & Materials Policies
CREATE POLICY "Enrolled students and teachers can view lectures"
ON public.lectures FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Course teachers can manage lectures"
ON public.lectures FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.courses
        WHERE courses.id = lectures.course_id AND courses.teacher_id = auth.uid()
    ) OR EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    )
);

CREATE POLICY "Enrolled students and teachers can view materials"
ON public.materials FOR SELECT
TO authenticated
USING (true);

-- 5. Assignments & Submissions Policies
CREATE POLICY "Assignments viewable by course members"
ON public.assignments FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Students can view and submit their own assignment submissions"
ON public.submissions FOR SELECT
TO authenticated
USING (student_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.assignments a
    JOIN public.courses c ON c.id = a.course_id
    WHERE a.id = submissions.assignment_id AND (c.teacher_id = auth.uid() OR EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    ))
));

CREATE POLICY "Students can insert their own assignment submission"
ON public.submissions FOR INSERT
TO authenticated
WITH CHECK (student_id = auth.uid());

CREATE POLICY "Teachers can grade assignment submissions"
ON public.submissions FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.assignments a
        JOIN public.courses c ON c.id = a.course_id
        WHERE a.id = submissions.assignment_id AND c.teacher_id = auth.uid()
    ) OR EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    )
);

-- 6. Discussions & Replies Policies
CREATE POLICY "Discussions viewable by course members"
ON public.discussions FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can create discussions"
ON public.discussions FOR INSERT
TO authenticated
WITH CHECK (author_id = auth.uid());

CREATE POLICY "Authors can update or delete their discussions"
ON public.discussions FOR UPDATE
TO authenticated
USING (author_id = auth.uid());
