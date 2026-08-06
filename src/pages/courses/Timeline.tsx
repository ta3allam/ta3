import { useState, useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useParams, Link } from "react-router-dom";
import { useCourseData } from "@/contexts/CourseContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Clock, CheckCircle2, AlertCircle, ArrowRight, BookOpen, FileText } from "lucide-react";

interface TimelineItem {
  id: number;
  title: string;
  description: string;
  date: string;
  type: 'assignment' | 'quiz' | 'lecture' | 'exam';
  status: 'upcoming' | 'completed';
}

function formatStandardDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
}

export default function CourseTimeline() {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const { courseData } = useCourseData();
  const course = courseData[Number(courseId)];
  const [filter, setFilter] = useState<'all' | 'assignment' | 'quiz' | 'lecture'>('all');

  const timelineItems: TimelineItem[] = useMemo(() => {
    if (!course) return [];

    const items: TimelineItem[] = [];

    // Map lectures
    (course.lectures || []).forEach((lecture, idx) => {
      items.push({
        id: 100 + lecture.id,
        title: lecture.title,
        description: lecture.description || "محاضرة في إطار المنهاج الدراسي للمقرر",
        date: new Date(Date.now() - (3 - idx) * 86400000 * 7).toISOString(),
        type: 'lecture',
        status: 'completed'
      });
    });

    // Map events
    (course.events || []).forEach((ev) => {
      items.push({
        id: 200 + ev.id,
        title: ev.title,
        description: ev.description || "حدث وأنشطة المقرر",
        date: ev.due_date,
        type: ev.event_type === 'quiz' ? 'quiz' : 'assignment',
        status: new Date(ev.due_date).getTime() < Date.now() ? 'completed' : 'upcoming'
      });
    });

    // Map assignments
    (course.assignments || []).forEach((assign) => {
      items.push({
        id: 300 + assign.id,
        title: assign.title,
        description: assign.description,
        date: assign.dueDate,
        type: 'assignment',
        status: new Date(assign.dueDate).getTime() < Date.now() ? 'completed' : 'upcoming'
      });
    });

    return items.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [course]);

  const filteredItems = useMemo(() => {
    if (filter === 'all') return timelineItems;
    return timelineItems.filter(item => item.type === filter);
  }, [timelineItems, filter]);

  if (!course) {
    return (
      <DashboardLayout title="المقرر غير موجود">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-muted-foreground">المقرر غير موجود</h1>
        </div>
      </DashboardLayout>
    );
  }

  const backPath = user?.role === 'teacher' ? `/teacher/courses/${courseId}` : `/student/courses/${courseId}`;

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'assignment':
        return <Badge className="bg-[#6B1F2A]/15 text-[#6B1F2A] border-[#6B1F2A]/30">واجب دراسي</Badge>;
      case 'quiz':
        return <Badge className="bg-[#988561]/20 text-[#002623] border-[#988561]/40">اختبار قصير</Badge>;
      default:
        return <Badge className="bg-[#428177]/15 text-[#054239] border-[#428177]/30">محاضرة</Badge>;
    }
  };

  return (
    <DashboardLayout title={`الجدول الزمني - ${course.name}`}>
      <div className="space-y-6" dir="rtl">
        {/* Navigation Breadcrumb & Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#428177]/20 pb-4">
          <div className="text-right space-y-1">
            <div className="flex items-center gap-2 justify-start text-xs text-[#3D3A3B]">
              <Link to={backPath} className="hover:text-[#428177] transition-colors flex items-center gap-1 font-semibold">
                {course.name}
                <ArrowRight className="h-3 w-3" />
              </Link>
              <span>/</span>
              <span className="font-bold text-[#002623]">الجدول الزمني</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#002623]">الجدول الزمني ومحطات الأسبوع</h1>
            <p className="text-xs text-[#3D3A3B] font-medium">متابعة كافة المحاضرات، الواجبات، والاختبارات القادمة بترتيب زمني دقيق</p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-[#EDEBE0] p-1.5 rounded-xl border border-[#428177]/20">
            <Button
              size="sm"
              variant={filter === 'all' ? 'default' : 'ghost'}
              onClick={() => setFilter('all')}
              className={filter === 'all' ? 'bg-[#428177] text-white font-bold' : 'text-[#002623] font-bold'}
            >
              الكل ({timelineItems.length})
            </Button>
            <Button
              size="sm"
              variant={filter === 'assignment' ? 'default' : 'ghost'}
              onClick={() => setFilter('assignment')}
              className={filter === 'assignment' ? 'bg-[#428177] text-white font-bold' : 'text-[#002623] font-bold'}
            >
              الواجبات
            </Button>
            <Button
              size="sm"
              variant={filter === 'quiz' ? 'default' : 'ghost'}
              onClick={() => setFilter('quiz')}
              className={filter === 'quiz' ? 'bg-[#428177] text-white font-bold' : 'text-[#002623] font-bold'}
            >
              الاختبارات
            </Button>
            <Button
              size="sm"
              variant={filter === 'lecture' ? 'default' : 'ghost'}
              onClick={() => setFilter('lecture')}
              className={filter === 'lecture' ? 'bg-[#428177] text-white font-bold' : 'text-[#002623] font-bold'}
            >
              المحاضرات
            </Button>
          </div>
        </div>

        {/* Timeline Items Feed */}
        {filteredItems.length > 0 ? (
          <div className="relative border-r-2 border-[#428177]/30 pr-6 mr-3 space-y-6">
            {filteredItems.map((item) => (
              <div key={item.id} className="relative group">
                {/* Timeline Dot Indicator */}
                <div className={`absolute -right-[31px] top-4 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center ${
                  item.status === 'completed' ? 'border-[#428177] text-[#428177]' : 'border-[#988561] text-[#988561]'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${item.status === 'completed' ? 'bg-[#428177]' : 'bg-[#988561]'}`} />
                </div>

                <Card className="border border-[#428177]/30 hover:border-[#428177] transition-all bg-white shadow-sm rounded-2xl overflow-hidden">
                  <CardContent className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-2 text-right">
                      <div className="flex items-center gap-2 justify-start">
                        {getTypeBadge(item.type)}
                        {item.status === 'completed' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-[#428177] font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            مكتمل
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-[#6B1F2A] font-bold">
                            <AlertCircle className="w-3.5 h-3.5" />
                            مستحق قريباً
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-[#002623]">{item.title}</h3>
                      <p className="text-xs text-[#3D3A3B] font-medium max-w-xl">{item.description}</p>
                    </div>

                    <div className="flex items-center gap-3 bg-[#EDEBE0]/40 px-4 py-2.5 rounded-xl border border-[#428177]/20 text-xs font-bold text-[#002623] self-stretch md:self-auto justify-center">
                      <CalendarIcon className="w-4 h-4 text-[#428177]" />
                      <span>{formatStandardDate(item.date)}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed rounded-2xl bg-white border-[#428177]/30 text-[#002623] space-y-2">
            <CalendarIcon className="h-10 w-10 mx-auto text-[#988561]" />
            <p className="font-bold">لا توجد محطات زمنية لهذه الفئة</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
