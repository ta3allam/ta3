import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { WebinarRoomCard } from "@/components/cohorts/WebinarRoomCard";
import { EventCalendarView } from "@/components/cohorts/EventCalendarView";
import { CreateEventModal } from "@/components/cohorts/CreateEventModal";
import { LiveSessionStageModal } from "@/components/cohorts/LiveSessionStageModal";
import { CohortEvent, MENA_TIMEZONES } from "@/lib/cohorts/cohortTime";
import { EventStore } from "@/lib/cohorts/eventStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Video,
  Calendar as CalendarIcon,
  Search,
  PlusCircle,
  Sparkles,
  Globe,
  Radio,
  Clock,
  Filter,
  LayoutGrid,
  CalendarDays,
  Users
} from "lucide-react";
import { toast } from "sonner";

export default function CohortEvents() {
  const [events, setEvents] = useState<CohortEvent[]>([]);
  const [userRsvps, setUserRsvps] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [selectedTimezone, setSelectedTimezone] = useState<string>("دمشق / مكة المكرمة / بغداد (UTC+3)");
  const [viewMode, setViewMode] = useState<"grid" | "calendar">("grid");
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | null>(null);

  // Modals state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [stageModalOpen, setStageModalOpen] = useState(false);
  const [activeStageEvent, setActiveStageEvent] = useState<CohortEvent | null>(null);

  useEffect(() => {
    setEvents(EventStore.getEvents());
    setUserRsvps(EventStore.getUserRsvps());
  }, []);

  const handleRsvpToggle = (eventId: string | number) => {
    const res = EventStore.toggleRsvp(eventId);
    setUserRsvps(EventStore.getUserRsvps());
    setEvents(EventStore.getEvents());
  };

  const handleEventCreated = (newEvent: CohortEvent) => {
    setEvents(EventStore.getEvents());
  };

  const handleOpenStage = (event: CohortEvent) => {
    setActiveStageEvent(event);
    setStageModalOpen(true);
  };

  // Filter events
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.instructorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Filter by calendar selected date
    if (selectedCalendarDate) {
      const evDate = new Date(event.startTime);
      const isSameDate =
        evDate.getFullYear() === selectedCalendarDate.getFullYear() &&
        evDate.getMonth() === selectedCalendarDate.getMonth() &&
        evDate.getDate() === selectedCalendarDate.getDate();
      if (!isSameDate) return false;
    }

    if (selectedFilter === "all") return true;
    if (selectedFilter === "live") {
      const now = Date.now();
      const start = new Date(event.startTime).getTime();
      const end = start + event.durationMinutes * 60 * 1000;
      return now >= start && now < end;
    }
    if (selectedFilter === "my_rsvps") {
      return userRsvps.includes(String(event.id));
    }
    return event.category === selectedFilter;
  });

  const liveEventsCount = events.filter((event) => {
    const now = Date.now();
    const start = new Date(event.startTime).getTime();
    const end = start + event.durationMinutes * 60 * 1000;
    return now >= start && now < end;
  }).length;

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-12 text-right" dir="rtl">
        {/* Top Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-[#002623] via-[#054239] to-[#428177] p-6 sm:p-8 text-white shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-[#988561] text-[#002623] hover:bg-[#B9A779] font-black text-xs px-3 py-1">
                تعلّم لايف • Live Sessions
              </Badge>
              {liveEventsCount > 0 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-black bg-rose-600 text-white animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-white"></span>
                  {liveEventsCount} جلسة مباشرة نشطة الآن
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-black leading-tight">
              تقويم الجلسات الحية وورش العمل التفاعلية
            </h1>
            <p className="text-sm text-[#EDEBE0]/80 leading-relaxed">
              انضم إلى البثوث المباشرة، وحلقات النقاش الأكاديمية، وساعات المساعدة المكتبية المباشرة مع نخبة المدرسين والخبراء في الشرق الأوسط.
            </p>

            {/* Quick Actions */}
            <div className="pt-2 flex items-center gap-3 flex-wrap">
              <Button
                onClick={() => setCreateModalOpen(true)}
                className="bg-[#EDEBE0] text-[#002623] hover:bg-white font-bold text-xs gap-2 shadow-sm rounded-xl px-4 py-2.5"
              >
                <PlusCircle className="w-4 h-4 text-[#428177]" />
                جدولة جلسة جديدة للمدربين
              </Button>
            </div>
          </div>
        </div>

        {/* Controls Bar: Search, Category Filters, Timezone, View Switcher */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#428177]/20 shadow-sm space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="ابحث بالعنوان، اسم المحاضر، أو الكلمات المفتاحية..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 border-[#428177]/25 focus-visible:ring-[#428177] text-sm rounded-xl"
              />
            </div>

            {/* Timezone Selector */}
            <div className="flex items-center gap-2 shrink-0">
              <Globe className="w-4 h-4 text-[#428177] shrink-0" />
              <Select value={selectedTimezone} onValueChange={setSelectedTimezone}>
                <SelectTrigger className="w-[260px] border-[#428177]/25 text-xs font-semibold rounded-xl bg-slate-50/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent dir="rtl">
                  {MENA_TIMEZONES.map((tz) => (
                    <SelectItem key={tz.id} value={tz.label} className="text-xs">
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center border border-[#428177]/20 rounded-xl p-1 bg-slate-50/60 shrink-0">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={`text-xs font-bold gap-1.5 rounded-lg h-8 ${
                  viewMode === "grid" ? "bg-[#428177] text-white" : "text-[#002623]"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                بطاقات
              </Button>
              <Button
                variant={viewMode === "calendar" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("calendar")}
                className={`text-xs font-bold gap-1.5 rounded-lg h-8 ${
                  viewMode === "calendar" ? "bg-[#428177] text-white" : "text-[#002623]"
                }`}
              >
                <CalendarDays className="w-3.5 h-3.5" />
                تقويم شهري
              </Button>
            </div>
          </div>

          {/* Quick Category Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <Filter className="w-3.5 h-3.5 text-[#428177] shrink-0 ml-1" />
            {[
              { id: "all", label: "كافة الجلسات" },
              { id: "live", label: "🔴 مباشر الآن", highlight: true },
              { id: "my_rsvps", label: "جلساتي المسجلة" },
              { id: "workshop", label: "ورش عمل برمجية" },
              { id: "masterclass", label: "ماستر كلاس" },
              { id: "office_hours", label: "ساعات مكتبية" },
              { id: "qa", label: "أسئلة وأجوبة Q&A" },
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={selectedFilter === tab.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter(tab.id)}
                className={`rounded-xl text-xs font-bold whitespace-nowrap transition-all h-8 ${
                  selectedFilter === tab.id
                    ? tab.highlight
                      ? "bg-rose-600 text-white hover:bg-rose-700"
                      : "bg-[#002623] text-white hover:bg-[#054239]"
                    : tab.highlight
                    ? "border-rose-200 text-rose-700 hover:bg-rose-50"
                    : "border-slate-200 text-[#002623] hover:bg-[#EDEBE0]/40"
                }`}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {/* View Mode Content */}
        {viewMode === "calendar" ? (
          <div className="space-y-6">
            <EventCalendarView
              events={events}
              selectedDate={selectedCalendarDate}
              onSelectDate={setSelectedCalendarDate}
              onSelectEvent={handleOpenStage}
            />

            {/* Events for selected date or all events below calendar */}
            <div>
              <h3 className="text-lg font-bold text-[#002623] mb-4">
                {selectedCalendarDate
                  ? `الجلسات المقررة في ${selectedCalendarDate.toLocaleDateString("ar-SY", {
                      weekday: "long",
                      day: "numeric",
                      month: "long"
                    })}`
                  : "كافة الجلسات المتوفرة"}
              </h3>

              {filteredEvents.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-[#428177]/30">
                  <CalendarIcon className="w-12 h-12 text-[#988561] mx-auto mb-3" />
                  <p className="text-sm font-bold text-[#002623]">لا توجد جلسات مجدولة في هذا التاريخ</p>
                  <p className="text-xs text-[#002623]/60 mt-1">اختر يوماً آخر من التقويم أو استعرض كافة الفعاليات</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents.map((event) => (
                    <WebinarRoomCard
                      key={event.id}
                      event={event}
                      onRsvp={handleRsvpToggle}
                      onJoinSession={handleOpenStage}
                      isRegistered={userRsvps.includes(String(event.id))}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Grid View Mode */
          <div>
            {filteredEvents.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-[#428177]/30 p-8">
                <Video className="w-12 h-12 text-[#988561] mx-auto mb-3 opacity-60" />
                <h3 className="text-base font-bold text-[#002623] mb-1">لم يتم العثور على أي جلسات تطابق بحثك</h3>
                <p className="text-xs text-[#002623]/60 mb-4">جرب تعديل كلمات البحث أو اختيار تبويب تصفية مختلف</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedFilter("all");
                    setSelectedCalendarDate(null);
                  }}
                  className="text-xs font-bold border-[#428177]/30 text-[#002623]"
                >
                  إعادة تعيين الفلاتر
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <WebinarRoomCard
                    key={event.id}
                    event={event}
                    onRsvp={handleRsvpToggle}
                    onJoinSession={handleOpenStage}
                    isRegistered={userRsvps.includes(String(event.id))}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Create Event Modal */}
        <CreateEventModal
          open={createModalOpen}
          onOpenChange={setCreateModalOpen}
          onEventCreated={handleEventCreated}
        />

        {/* Live Session Stage Modal */}
        <LiveSessionStageModal
          open={stageModalOpen}
          onOpenChange={setStageModalOpen}
          event={activeStageEvent}
        />
      </div>
    </DashboardLayout>
  );
}
