-- Ta3 (تعلّم) LMS - Seed Data SQL Script
-- Migration: 20260810000001_002_seed_data.sql

-- Insert Courses
INSERT INTO public.courses (id, code, name, category, difficulty, period, bg_image)
VALUES 
    (1, 'CS101', 'البرمجة بلغة جافا', 'علوم الحاسب', 'مبتدئ', 'صيف 2026', '/coursesbg/coding.png'),
    (2, 'MATH201', 'الرياضيات المتقدمة', 'الرياضيات', 'متوسط', 'صيف 2026', '/coursesbg/math.png'),
    (3, 'AI101', 'مبادئ الذكاء الاصطناعي', 'علوم الحاسب', 'متقدم', 'صيف 2026', '/coursesbg/coding.png')
ON CONFLICT (id) DO NOTHING;

-- Insert Lectures for Course 1
INSERT INTO public.lectures (id, course_id, title, description, duration, order_num)
VALUES 
    (1, 1, 'المقدمة في البرمجة وتركيب البيئة', 'تعرف على مفاهيم البرمجة الأساسية ولغة جافا', '45 دقيقة', 1),
    (2, 1, 'المتغيرات وأنواع البيانات', 'أنواع البيانات الأساسية والمتحولات في جافا', '50 دقيقة', 2),
    (3, 1, 'الجمل الشرطية وحلقات التكرار', 'التحكم بالتدفق باستخدام if-else و loops', '60 دقيقة', 3)
ON CONFLICT (id) DO NOTHING;

-- Insert Lectures for Course 2
INSERT INTO public.lectures (id, course_id, title, description, duration, order_num)
VALUES 
    (4, 2, 'مقدمة في التفاضل والتكامل', 'المفاهيم المتقدمة في الجبر والتفاضل', '55 دقيقة', 1),
    (5, 2, 'المصفوفات والمتجهات', 'العمليات الحسابية على المصفوفات المتعددة', '50 دقيقة', 2)
ON CONFLICT (id) DO NOTHING;

-- Insert Materials
INSERT INTO public.materials (id, lecture_id, course_id, title, type, url)
VALUES
    (1, 1, 1, 'دليل التثبيت والإعداد Java JDK', 'pdf', '/materials/java_setup_guide.pdf'),
    (2, 1, 1, 'فيديو الشرح المفصل للمحاضرة الأولى', 'video', 'https://www.youtube.com/watch?v=demo1'),
    (3, 4, 2, 'ملخص قانون التفاضل والتكامل', 'pdf', '/materials/calculus_summary.pdf')
ON CONFLICT (id) DO NOTHING;

-- Insert Assignments
INSERT INTO public.assignments (id, course_id, title, description, due_date)
VALUES
    (1, 1, 'الواجب الأول: كتابة برنامج أهلاً بالعالم', 'أنشئ مشروع جافا يطبع رسالة أهلاً بك مع اسم الطالب', '2026-09-15T23:59:59Z'),
    (2, 1, 'الواجب الثاني: حاسبة المعدل الأكاديمي', 'برنامج يستقبل درجات المواد ويحسب المتوسط', '2026-09-25T23:59:59Z'),
    (3, 2, 'حل تمارين المصفوفات المتعددة', 'حل الأسئلة من 1 إلى 5 في الفصل الثالث', '2026-10-01T23:59:59Z')
ON CONFLICT (id) DO NOTHING;

-- Insert Study Groups
INSERT INTO public.study_groups (id, course_id, name, description, max_members)
VALUES
    (1, 1, 'فريق البرمجة المتقدمة (Alpha)', 'مجموعة دراسية لمراجعة تمارين الواجبات والمشروع النهائي', 5),
    (2, 1, 'مجموعة مراجعة الخوارزميات (Beta)', 'مناقشة المفاهيم النظرية والاستعداد للاختبارات القادمة', 4)
ON CONFLICT (id) DO NOTHING;
