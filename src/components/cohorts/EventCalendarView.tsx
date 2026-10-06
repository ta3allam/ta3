import React, { useState } from "react";
import { CohortEvent } from "@/lib/cohorts/cohortTime";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Video,
  Users,
  Sparkles,
  CheckCircle2,
  Radio
} from "lucide-react";

interface EventCalendarViewProps {
  events: CohortEvent[];
  selectedDate: Date | null;
  onSelectDate: (date: Date | null) => void;
  onSelectEvent?: (event: CohortEvent) => void;
}

const ARABIC_DAYS = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
const ARABIC_MONTHS = [
  "يناير (كانون الثاني)",
  "فبراير (شباط)",
  "مارس (آذار)",
  "أبريل (نيسان)",
  "مايو (أيار)",
  "يونيو (حزيران)",
  "يوليو (تموز)",
  "أغسطس (آب)",
  "سبتمبر (أيلول)",
  "أكتوبر (تشرين الأول)",
  "نوفمبر (تشرين الثاني)",
  "ديسمبر (كانون الأول)"
];

export function EventCalendarView({
  events,
  selectedDate,
  onSelectDate,
  onSelectEvent
}: EventCalendarViewProps) {
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(selectedDate || new Date());
  const [viewMode, setViewMode] = useState<"month" | "week">("month");

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentMonthDate(today);
    onSelectDate(today);
  };

  // Month grid calculations
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  // Helper to test if two dates are same day
  const isSameDay = (d1: Date, d2: Date | null) => {
    if (!d2) return false;
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  // Get events on a specific date
  const getEventsForDate = (date: Date) => {
    return events.filter(ev => {
      const evDate = new Date(ev.startTime);
      return (
        evDate.getFullYear() === date.getFullYear() &&
        evDate.getMonth() === date.getMonth() &&
        evDate.getDate() === date.getDate()
      );
    });
  };

  const getCategoryColor = (cat: CohortEvent["category"]) => {
    switch (cat) {
      case "workshop":
        return "bg-[#428177] text-white";
      case "masterclass":
        return "bg-[#6B1F2A] text-white";
      case "office_hours":
        return "bg-[#988561] text-white";
      case "qa":
      default:
        return "bg-emerald-600 text-white";
    }
  };

  // Calendar cells construction
  const calendarCells = [];

  // Previous month trailing days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const date = new Date(year, month - 1, prevMonthDays - i);
    calendarCells.push({
      date,
      isCurrentMonth: false,
      events: getEventsForDate(date)
    });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    calendarCells.push({
      date,
      isCurrentMonth: true,
      events: getEventsForDate(date)
    });
  }

  // Next month leading days to complete full grid
  const totalCells = Math.ceil(calendarCells.length / 7) * 7;
  const remainingCells = totalCells - calendarCells.length;
  for (let day = 1; day <= remainingCells; day++) {
    const date = new Date(year, month + 1, day);
    calendarCells.push({
      date,
      isCurrentMonth: false,
      events: getEventsForDate(date)
    });
  }

  const today = new Date();

  return (
    <Card className="border border-[#428177]/25 shadow-sm rounded-2xl overflow-hidden bg-white text-right" dir="rtl">
      {/* Calendar Header */}
      <CardHeader className="p-4 sm:p-5 bg-[#EDEBE0]/40 border-b border-[#428177]/15">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#428177]/15 flex items-center justify-center text-[#428177]">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-lg sm:text-xl font-black text-[#002623]">
                {ARABIC_MONTHS[month]} {year}
              </CardTitle>
              <p className="text-xs text-[#002623]/70 font-medium">
                جدول الجلسات المباشرة والورش التفاعلية المتزامنة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleToday}
              className="text-xs font-bold border-[#428177]/30 text-[#002623] hover:bg-[#EDEBE0]"
            >
              اليوم
            </Button>
            <div className="flex items-center border border-[#428177]/20 rounded-lg overflow-hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevMonth}
                aria-label="الشهر السابق"
                className="h-8 w-8 hover:bg-[#428177]/10 text-[#002623]"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNextMonth}
                aria-label="الشهر القادم"
                className="h-8 w-8 hover:bg-[#428177]/10 text-[#002623]"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3 sm:p-5">
        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center">
          {ARABIC_DAYS.map((dayName, idx) => (
            <div
              key={idx}
              className="py-2 text-xs sm:text-sm font-bold text-[#002623]/80 bg-[#EDEBE0]/25 rounded-lg"
            >
              {dayName}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {calendarCells.map((cell, idx) => {
            const isToday = isSameDay(cell.date, today);
            const isSelected = isSameDay(cell.date, selectedDate);
            const hasEvents = cell.events.length > 0;

            return (
              <div
                key={idx}
                onClick={() => onSelectDate(isSelected ? null : cell.date)}
                className={`min-h-[75px] sm:min-h-[95px] p-1.5 sm:p-2 rounded-xl border transition-all duration-150 cursor-pointer flex flex-col justify-between ${
                  !cell.isCurrentMonth
                    ? "bg-slate-50/50 text-slate-400 border-transparent opacity-60"
                    : isSelected
                    ? "bg-[#428177]/10 border-[#428177] ring-2 ring-[#428177]/20 shadow-sm"
                    : isToday
                    ? "bg-[#EDEBE0]/50 border-[#428177]/40 font-bold"
                    : "bg-white border-slate-100 hover:border-[#428177]/30 hover:bg-[#EDEBE0]/15"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center justify-center text-xs sm:text-sm rounded-full w-6 h-6 ${
                      isToday
                        ? "bg-[#428177] text-white font-black shadow-xs"
                        : isSelected
                        ? "bg-[#002623] text-white font-bold"
                        : "text-[#002623]"
                    }`}
                  >
                    {cell.date.getDate()}
                  </span>

                  {hasEvents && (
                    <span className="inline-flex items-center justify-center px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-[#428177]/20 text-[#054239]">
                      {cell.events.length}
                    </span>
                  )}
                </div>

                {/* Event previews inside cell */}
                <div className="space-y-1 mt-1">
                  {cell.events.slice(0, 2).map((ev) => (
                    <div
                      key={ev.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelectEvent) onSelectEvent(ev);
                        onSelectDate(cell.date);
                      }}
                      className={`text-[10px] sm:text-xs truncate px-1.5 py-0.5 rounded font-medium shadow-2xs ${getCategoryColor(
                        ev.category
                      )}`}
                      title={ev.title}
                    >
                      {ev.title}
                    </div>
                  ))}
                  {cell.events.length > 2 && (
                    <div className="text-[9px] text-[#428177] font-bold px-1">
                      +{cell.events.length - 2} المزيد
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Date Indicator Banner */}
        {selectedDate && (
          <div className="mt-4 p-3 bg-[#428177]/10 border border-[#428177]/25 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#002623]">
              <CalendarIcon className="w-4 h-4 text-[#428177]" />
              <span>
                عرض جلسات يوم {selectedDate.toLocaleDateString("ar-SY", { weekday: "long", day: "numeric", month: "long" })}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSelectDate(null)}
              className="text-xs text-[#6B1F2A] hover:bg-[#6B1F2A]/10 font-bold h-7"
            >
              عرض كافة الجلسات
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
