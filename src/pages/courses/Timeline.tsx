import { useState, useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useParams, Link } from "react-router-dom";
import { useCourseData } from "@/contexts/CourseContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, ChevronRight, ChevronLeft, Plus, Clock, ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { EventType } from "./types";

interface CalendarEvent {
  id: number;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  type: 'assignment' | 'quiz' | 'lecture' | 'exam';
}

const MONTH_NAMES_AR = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
];

const WEEKDAY_NAMES_AR = [
  "الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"
];

function formatStandardDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
}

export default function CourseTimeline() {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const { courseData, addEvent } = useCourseData();
  const course = courseData[Number(courseId)];

  const isTeacher = user?.role === 'teacher';

  const [viewMode, setViewMode] = useState<'monthly' | 'weekly'>('monthly');
  const [currentDate, setCurrentDate] = useState(new Date(2026, 8, 1)); // September 2026 (Semester Start)
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  // New Event Form state for Teachers
  const [dialogOpen, setDialogOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDesc, setEventDesc] = useState("");
  const [eventType, setEventType] = useState<EventType>("assignment");
  const [eventDate, setEventDate] = useState("");

  const events: CalendarEvent[] = useMemo(() => {
    if (!course) return [];
    const list: CalendarEvent[] = [];

    (course.lectures || []).forEach((l, idx) => {
      const d = new Date(2026, 8, 1 + idx * 7);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      list.push({
        id: 100 + l.id,
        title: l.title,
        description: l.description || "محاضرة في إطار المنهاج الدراسي للمقرر",
        date: dateStr,
        type: 'lecture'
      });
    });

    (course.events || []).forEach((ev) => {
      const d = new Date(ev.due_date);
      const dateStr = !isNaN(d.getTime())
        ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
        : "2026-09-15";
      list.push({
        id: 200 + ev.id,
        title: ev.title,
        description: ev.description || "فعالية واستحقاق للمقرر",
        date: dateStr,
        type: ev.event_type === 'quiz' ? 'quiz' : 'assignment'
      });
    });

    (course.assignments || []).forEach((assign) => {
      const d = new Date(assign.dueDate);
      const dateStr = !isNaN(d.getTime())
        ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
        : "2026-10-01";
      list.push({
        id: 300 + assign.id,
        title: assign.title,
        description: assign.description,
        date: dateStr,
        type: 'assignment'
      });
    });

    return list;
  }, [course]);

  // Monthly Calendar Matrix Generation
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startingDayOfWeek = firstDay.getDay(); // 0 is Sunday
    const daysInMonth = lastDay.getDate();

    const days: Array<{ dayNum: number; dateStr: string; isCurrentMonth: boolean; events: CalendarEvent[] }> = [];

    // Prev month padding
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const dayNum = prevMonthLastDay - i;
      const d = new Date(year, month - 1, dayNum);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      days.push({
        dayNum,
        dateStr,
        isCurrentMonth: false,
        events: events.filter(e => e.date === dateStr)
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({
        dayNum: i,
        dateStr,
        isCurrentMonth: true,
        events: events.filter(e => e.date === dateStr)
      });
    }

    // Next month padding to complete 35 or 42 cells
    const remaining = 35 - days.length > 0 ? 35 - days.length : 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({
        dayNum: i,
        dateStr,
        isCurrentMonth: false,
        events: events.filter(e => e.date === dateStr)
      });
    }

    return days;
  }, [currentDate, events]);

  // Weekly Calendar Generation
  const weeklyDays = useMemo(() => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay()); // Sunday

    const days: Array<{ dayName: string; dayNum: number; dateStr: string; events: CalendarEvent[] }> = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      days.push({
        dayName: WEEKDAY_NAMES_AR[i],
        dayNum: d.getDate(),
        dateStr,
        events: events.filter(e => e.date === dateStr)
      });
    }
    return days;
  }, [currentDate, events]);

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'monthly') {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else {
      newDate.setDate(currentDate.getDate() - 7);
    }
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'monthly') {
      newDate.setMonth(currentDate.getMonth() + 1);
    } else {
      newDate.setDate(currentDate.getDate() + 7);
    }
    setCurrentDate(newDate);
  };

  const handleAddEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim() || !eventDate || !courseId) return;

    addEvent(Number(courseId), {
      title: eventTitle.trim(),
      description: eventDesc.trim(),
      event_type: eventType,
      due_date: new Date(eventDate).toISOString()
    });

    toast.success("تمت إضافة الحدث للتقويم التقويمي بنجاح");
    setEventTitle("");
    setEventDesc("");
    setDialogOpen(false);
  };

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
        return <Badge className="bg-[#6B1F2A]/15 text-[#6B1F2A] border-[#6B1F2A]/30 text-[10px]">واجب</Badge>;
      case 'quiz':
        return <Badge className="bg-[#988561]/20 text-[#002623] border-[#988561]/40 text-[10px]">اختبار</Badge>;
      default:
        return <Badge className="bg-[#428177]/15 text-[#054239] border-[#428177]/30 text-[10px]">محاضرة</Badge>;
    }
  };

  return (
    <DashboardLayout title={`التقويم الزمني - ${course.name}`}>
      <div className="space-y-6" dir="rtl">
        {/* Header Navigation & Teacher Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#428177]/20 pb-4">
          <div className="text-right space-y-1">
            <div className="flex items-center gap-2 justify-start text-xs text-[#3D3A3B]">
              <Link to={backPath} className="hover:text-[#428177] transition-colors flex items-center gap-1 font-semibold">
                {course.name}
                <ArrowRight className="h-3 w-3" />
              </Link>
              <span>/</span>
              <span className="font-bold text-[#002623]">التقويم الأكاديمي</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#002623]">التقويم الزمني للمقرر (الفصل الدراسي)</h1>
            <p className="text-xs text-[#3D3A3B] font-medium">عرض الجدول الزمني والمحطات الأكاديمية للمقرر الممتدة عبر 4 أشهر دراسية</p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 bg-[#EDEBE0] p-1 rounded-xl border border-[#428177]/20">
              <Button
                size="sm"
                variant={viewMode === 'monthly' ? 'default' : 'ghost'}
                onClick={() => setViewMode('monthly')}
                className={viewMode === 'monthly' ? 'bg-[#428177] text-white font-bold text-xs' : 'text-[#002623] font-bold text-xs'}
              >
                عرض شهري
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'weekly' ? 'default' : 'ghost'}
                onClick={() => setViewMode('weekly')}
                className={viewMode === 'weekly' ? 'bg-[#428177] text-white font-bold text-xs' : 'text-[#002623] font-bold text-xs'}
              >
                عرض أسبوعي
              </Button>
            </div>

            {/* Teacher Add Event Dialog */}
            {isTeacher && (
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#428177] hover:bg-[#054239] text-white font-bold text-xs flex items-center gap-1">
                    <Plus className="h-4 w-4 ml-1" />
                    إضافة حدث للتقويم
                  </Button>
                </DialogTrigger>
                <DialogContent dir="rtl" className="bg-white border border-[#428177]">
                  <DialogHeader>
                    <DialogTitle className="text-right text-[#002623]">إضافة حدث أكاديمي للتقويم (تعديل المعلم)</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddEventSubmit} className="space-y-4 text-right">
                    <div className="space-y-1.5">
                      <Label htmlFor="ev-title" className="text-xs font-semibold text-[#002623]">عنوان الحدث / الاستحقاق</Label>
                      <Input
                        id="ev-title"
                        required
                        value={eventTitle}
                        onChange={(e) => setEventTitle(e.target.value)}
                        className="text-right border-[#428177]/40 focus-visible:ring-[#428177]"
                        placeholder="مثال: واجب الأسبوع الخامس"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="ev-type" className="text-xs font-semibold text-[#002623]">نوع الحدث</Label>
                      <Select value={eventType} onValueChange={(val: EventType) => setEventType(val)}>
                        <SelectTrigger className="border-[#428177]/40 text-right">
                          <SelectValue placeholder="اختر نوع الحدث" />
                        </SelectTrigger>
                        <SelectContent dir="rtl">
                          <SelectItem value="assignment">واجب دراسي</SelectItem>
                          <SelectItem value="quiz">اختبار قصير</SelectItem>
                          <SelectItem value="exam">اختبار نهائي</SelectItem>
                          <SelectItem value="other">محاضرة / أخرى</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="ev-date" className="text-xs font-semibold text-[#002623]">تاريخ الاستحقاق</Label>
                      <Input
                        id="ev-date"
                        type="date"
                        required
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="text-right border-[#428177]/40 focus-visible:ring-[#428177]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="ev-desc" className="text-xs font-semibold text-[#002623]">وصف الحدث (تعليمات للطلاب)</Label>
                      <Textarea
                        id="ev-desc"
                        value={eventDesc}
                        onChange={(e) => setEventDesc(e.target.value)}
                        className="text-right border-[#428177]/40 focus-visible:ring-[#428177] text-xs"
                        placeholder="تفاصيل التكليف أو رابط الاختبار..."
                        rows={3}
                      />
                    </div>
                    <Button type="submit" className="w-full bg-[#428177] hover:bg-[#054239] text-white font-bold mt-2">
                      تأكيد وحفظ الحدث
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {/* Month Navigator Header */}
        <div className="flex items-center justify-between bg-white border border-[#428177]/30 p-4 rounded-2xl shadow-sm">
          <Button variant="outline" size="sm" onClick={handlePrevMonth} className="font-bold border-[#428177]/40 text-[#002623]">
            <ChevronRight className="h-4 w-4 ml-1" />
            السابق
          </Button>

          <div className="text-center space-y-0.5">
            <h2 className="text-xl font-extrabold text-[#002623]">
              {MONTH_NAMES_AR[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <p className="text-[11px] text-[#3D3A3B] font-semibold">
              {viewMode === 'monthly' ? "عرض تقويمي شهري شامل" : "عرض التفاصيل الأسبوعية"}
            </p>
          </div>

          <Button variant="outline" size="sm" onClick={handleNextMonth} className="font-bold border-[#428177]/40 text-[#002623]">
            التالي
            <ChevronLeft className="h-4 w-4 mr-1" />
          </Button>
        </div>

        {/* MONTHLY VIEW */}
        {viewMode === 'monthly' && (
          <div className="border border-[#428177]/30 rounded-2xl overflow-hidden bg-white shadow-sm">
            {/* Weekdays Header */}
            <div className="grid grid-cols-7 bg-[#EDEBE0]/60 border-b border-[#428177]/20 text-center py-2.5 font-bold text-xs text-[#002623]">
              {WEEKDAY_NAMES_AR.map((day, idx) => (
                <div key={idx}>{day}</div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-px bg-[#428177]/10">
              {calendarDays.map((cell, idx) => {
                const hasEvents = cell.events.length > 0;
                const isSelected = selectedDay === cell.dateStr;

                return (
                  <div
                    key={idx}
                    onClick={() => hasEvents && setSelectedDay(cell.dateStr)}
                    className={`min-h-[100px] p-2 bg-white flex flex-col justify-between transition-all ${
                      !cell.isCurrentMonth ? 'opacity-40 bg-slate-50' : ''
                    } ${hasEvents ? 'cursor-pointer hover:bg-[#EDEBE0]/30' : ''} ${
                      isSelected ? 'ring-2 ring-[#428177] bg-[#428177]/5' : ''
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs">
                      <span className={`font-bold ${cell.isCurrentMonth ? 'text-[#002623]' : 'text-[#3D3A3B]'}`}>
                        {cell.dayNum}
                      </span>
                      {hasEvents && (
                        <span className="w-2 h-2 rounded-full bg-[#428177]" />
                      )}
                    </div>

                    <div className="space-y-1 my-1">
                      {cell.events.map((ev) => (
                        <div key={ev.id} className="text-[10px] p-1 rounded bg-[#EDEBE0]/70 border border-[#428177]/20 truncate font-semibold text-[#002623]">
                          {ev.title}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* WEEKLY VIEW */}
        {viewMode === 'weekly' && (
          <div className="space-y-4">
            {weeklyDays.map((wDay, idx) => (
              <Card key={idx} className="border border-[#428177]/30 bg-white shadow-sm rounded-2xl overflow-hidden text-right">
                <CardHeader className="py-3 bg-[#EDEBE0]/40 border-b border-[#428177]/10 flex flex-row items-center justify-between">
                  <Badge className="bg-[#428177] text-white font-bold">{wDay.events.length} أحداث</Badge>
                  <CardTitle className="text-base font-bold text-[#002623]">
                    {wDay.dayName} - {wDay.dayNum} {MONTH_NAMES_AR[currentDate.getMonth()]}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-2">
                  {wDay.events.length > 0 ? (
                    wDay.events.map((ev) => (
                      <div key={ev.id} className="flex items-center justify-between bg-[#EDEBE0]/20 p-3 rounded-xl border border-[#428177]/20">
                        <div className="space-y-0.5">
                          <h4 className="font-bold text-sm text-[#002623]">{ev.title}</h4>
                          <p className="text-xs text-[#3D3A3B]">{ev.description}</p>
                        </div>
                        {getTypeBadge(ev.type)}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-[#3D3A3B] italic text-center py-2">لا توجد استحقاقات أو محاضرات في هذا اليوم</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Selected Day Event Drawer Details */}
        {selectedDay && (
          <Card className="border border-[#428177] bg-white shadow-md rounded-2xl text-right">
            <CardHeader className="pb-2 bg-[#EDEBE0]/50 border-b border-[#428177]/20 flex flex-row justify-between items-center">
              <Button size="sm" variant="ghost" onClick={() => setSelectedDay(null)} className="text-xs font-bold text-[#6B1F2A]">إغلاق التفاصيل</Button>
              <CardTitle className="text-base font-bold text-[#002623]">تفاصيل الفعاليات لتاريخ: {selectedDay}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {events.filter(e => e.date === selectedDay).map((ev) => (
                <div key={ev.id} className="p-3 bg-[#EDEBE0]/30 rounded-xl border border-[#428177]/20 space-y-1">
                  <div className="flex justify-between items-center">
                    {getTypeBadge(ev.type)}
                    <h4 className="font-bold text-sm text-[#002623]">{ev.title}</h4>
                  </div>
                  <p className="text-xs text-[#3D3A3B] leading-relaxed font-medium">{ev.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
