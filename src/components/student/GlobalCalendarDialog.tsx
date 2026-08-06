import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar as CalendarIcon, ChevronRight, ChevronLeft, BookOpen, Clock, FileText, CheckCircle2 } from 'lucide-react';
import { useCourseData } from '@/contexts/CourseContext';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

interface GlobalCalendarDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CombinedEvent {
  id: string;
  courseId: number;
  courseName: string;
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

export const GlobalCalendarDialog: React.FC<GlobalCalendarDialogProps> = ({ open, onOpenChange }) => {
  const { user } = useAuth();
  const { courseData } = useCourseData();

  const [currentDate, setCurrentDate] = useState(new Date(2026, 8, 1)); // September 2026
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<number | 'all'>('all');
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  // Aggregate events from all enrolled courses
  const allEvents = useMemo(() => {
    if (!user || !user.enrolledCourses) return [];

    const list: CombinedEvent[] = [];

    user.enrolledCourses.forEach((cId) => {
      const course = courseData[cId];
      if (!course) return;

      (course.lectures || []).forEach((l, idx) => {
        const d = new Date(2026, 8, 1 + idx * 7);
        const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        list.push({
          id: `l-${cId}-${l.id}`,
          courseId: cId,
          courseName: course.name,
          title: l.title,
          description: l.description || "محاضرة أسبوعية ضمن المنهاج الدراسي",
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
          id: `e-${cId}-${ev.id}`,
          courseId: cId,
          courseName: course.name,
          title: ev.title,
          description: ev.description || "استحقاق واختبار قصير",
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
          id: `a-${cId}-${assign.id}`,
          courseId: cId,
          courseName: course.name,
          title: assign.title,
          description: assign.description,
          date: dateStr,
          type: 'assignment'
        });
      });
    });

    return list;
  }, [user, courseData]);

  const filteredEvents = useMemo(() => {
    if (selectedCourseFilter === 'all') return allEvents;
    return allEvents.filter(e => e.courseId === selectedCourseFilter);
  }, [allEvents, selectedCourseFilter]);

  // Calendar Grid Matrix
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startingDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days: Array<{ dayNum: number; dateStr: string; isCurrentMonth: boolean; events: CombinedEvent[] }> = [];

    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const dayNum = prevMonthLastDay - i;
      const d = new Date(year, month - 1, dayNum);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      days.push({
        dayNum,
        dateStr,
        isCurrentMonth: false,
        events: filteredEvents.filter(e => e.date === dateStr)
      });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({
        dayNum: i,
        dateStr,
        isCurrentMonth: true,
        events: filteredEvents.filter(e => e.date === dateStr)
      });
    }

    const remaining = 35 - days.length > 0 ? 35 - days.length : 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({
        dayNum: i,
        dateStr,
        isCurrentMonth: false,
        events: filteredEvents.filter(e => e.date === dateStr)
      });
    }

    return days;
  }, [currentDate, filteredEvents]);

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="max-w-4xl bg-white border border-[#428177] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b border-[#428177]/20 pb-3">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-extrabold text-[#002623] flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-[#428177]" />
              التقويم الأكاديمي الموحد لكافة المقررات المسجلة
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2 text-right">
          {/* Course Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-bold text-[#002623] shrink-0">تصفية حسب المقرر:</span>
            <Button
              size="sm"
              variant={selectedCourseFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCourseFilter('all')}
              className={selectedCourseFilter === 'all' ? 'bg-[#428177] text-white font-bold text-xs' : 'border-[#428177]/30 text-[#002623] text-xs font-semibold'}
            >
              جميع المقررات ({allEvents.length})
            </Button>
            {user?.enrolledCourses?.map((cId) => {
              const course = courseData[cId];
              if (!course) return null;
              return (
                <Button
                  key={cId}
                  size="sm"
                  variant={selectedCourseFilter === cId ? 'default' : 'outline'}
                  onClick={() => setSelectedCourseFilter(cId)}
                  className={selectedCourseFilter === cId ? 'bg-[#428177] text-white font-bold text-xs' : 'border-[#428177]/30 text-[#002623] text-xs font-semibold'}
                >
                  {course.name}
                </Button>
              );
            })}
          </div>

          {/* Month Navigation */}
          <div className="flex items-center justify-between bg-[#EDEBE0]/30 p-3 rounded-xl border border-[#428177]/20">
            <Button variant="outline" size="sm" onClick={handlePrevMonth} className="font-bold border-[#428177]/40 text-[#002623]">
              <ChevronRight className="h-4 w-4 ml-1" />
              الشهر السابق
            </Button>

            <h3 className="text-lg font-extrabold text-[#002623]">
              {MONTH_NAMES_AR[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>

            <Button variant="outline" size="sm" onClick={handleNextMonth} className="font-bold border-[#428177]/40 text-[#002623]">
              الشهر التالي
              <ChevronLeft className="h-4 w-4 mr-1" />
            </Button>
          </div>

          {/* Calendar Grid */}
          <div className="border border-[#428177]/30 rounded-2xl overflow-hidden bg-white shadow-sm">
            <div className="grid grid-cols-7 bg-[#EDEBE0]/60 border-b border-[#428177]/20 text-center py-2 font-bold text-xs text-[#002623]">
              {WEEKDAY_NAMES_AR.map((day, idx) => (
                <div key={idx}>{day}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-px bg-[#428177]/10">
              {calendarDays.map((cell, idx) => {
                const hasEvents = cell.events.length > 0;
                const isSelected = selectedDay === cell.dateStr;

                return (
                  <div
                    key={idx}
                    onClick={() => hasEvents && setSelectedDay(cell.dateStr)}
                    className={`min-h-[85px] p-1.5 bg-white flex flex-col justify-between transition-all ${
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

                    <div className="space-y-0.5 my-1">
                      {cell.events.slice(0, 2).map((ev) => (
                        <div key={ev.id} className="text-[9px] p-0.5 rounded bg-[#EDEBE0]/70 border border-[#428177]/20 truncate font-semibold text-[#002623]">
                          {ev.courseName.split(' ')[0]}: {ev.title}
                        </div>
                      ))}
                      {cell.events.length > 2 && (
                        <span className="text-[9px] text-[#428177] font-bold">+ {cell.events.length - 2} آخر</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Day Event Drawer */}
          {selectedDay && (
            <Card className="border border-[#428177] bg-white shadow-sm rounded-xl text-right">
              <div className="p-3 bg-[#EDEBE0]/50 border-b border-[#428177]/20 flex justify-between items-center">
                <Button size="sm" variant="ghost" onClick={() => setSelectedDay(null)} className="text-xs font-bold text-[#6B1F2A]">إغلاق</Button>
                <h4 className="text-sm font-bold text-[#002623]">استحقاقات تاريخ: {selectedDay}</h4>
              </div>
              <CardContent className="p-3 space-y-2">
                {filteredEvents.filter(e => e.date === selectedDay).map((ev) => (
                  <div key={ev.id} className="p-2.5 bg-[#EDEBE0]/30 rounded-lg border border-[#428177]/20 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] border-[#428177]/40 text-[#428177] font-bold">{ev.courseName}</Badge>
                        <h5 className="font-bold text-xs text-[#002623]">{ev.title}</h5>
                      </div>
                      <p className="text-[11px] text-[#3D3A3B] mt-0.5">{ev.description}</p>
                    </div>
                    {getTypeBadge(ev.type)}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
