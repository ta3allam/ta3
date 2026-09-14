import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { WebinarRoomCard } from "@/components/cohorts/WebinarRoomCard";
import { CohortEvent } from "@/lib/cohorts/cohortTime";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Video,
  Calendar,
  Search,
  PlusCircle,
  Sparkles,
  Globe,
  Radio,
  Clock,
  Filter
} from "lucide-react";
import { getAssetUrl } from "@/lib/assetUtils";
import { toast } from "sonner";

export default function CohortEvents() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [selectedTimezone, setSelectedTimezone] = useState<string>("دمشق / الرياض (UTC+3)");

  const mockEvents: CohortEvent[] = [
    {
      id: "ev-1",
      title: "جلسة برمجية تفاعلية: بناء بروتوكول التجزئة 512KB TUS في بيئات الشبكات الضعيفة",
      description: "بث عملي مباشر لتطبيق بروتوكول التجزئة المقاوم لانقطاع الإنترنت مع أسئلة مفتوحة للمشاركين.",
      instructorName: "د. طارق الحمصي",
      instructorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      startTime: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // Live right now!
      durationMinutes: 90,
      capacity: 100,
      enrolledCount: 88,
      streamUrl: "https://meet.jit.si/ta3allam-cohort-live-session-tus",
      category: "workshop",
      timezone: selectedTimezone
    },
    {
      id: "ev-2",
      title: "ماستر كلاس: تصميم نماذج قواعد البيانات الموزعة وحل مشكلات التزامن OCC",
      description: "جلسة متقدمة تناقش فصل مسارات القراءة عن الكتابة واستراتيجيات الذاكرة المؤقتة Redis.",
      instructorName: "م. ليلى الشامي",
      instructorAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80",
      startTime: new Date(Date.now() + 1000 * 60 * 60 * 4).toISOString(), // in 4 hours
      durationMinutes: 75,
      capacity: 50,
      enrolledCount: 50, // Full
      category: "masterclass",
      timezone: selectedTimezone
    },
    {
      id: "ev-3",
      title: "ساعات مكتبية مفتوحة: مراجعة كود مشاريع تخرج الطلاب ونقاشات معمارية",
      description: "نقاش مباشر حر مع الطلاب لمراجعة الواجهات، استعلامات PostgreSQL ومناقشة التحديات.",
      instructorName: "أ. عمر الحلبي",
      instructorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
      startTime: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(), // in 2 days
      durationMinutes: 60,
      capacity: 40,
      enrolledCount: 22,
      category: "office_hours",
      timezone: selectedTimezone
    },
    {
      id: "ev-4",
      title: "ورشة عمل مسجلة: أسرار بناء مجتمعات المتعلمين وتفعيل تفاعل الأقران",
      description: "تسجيل كامل لورشة إطلاق مجتمعات Skool المصغرة وإدارة النقاشات التفاعلية بنجاح.",
      instructorName: "سارة الزعبي",
      instructorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
      startTime: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(), // Past
      durationMinutes: 120,
      capacity: 200,
      enrolledCount: 195,
      recordingUrl: "https://www.youtube.com",
      category: "qa",
      timezone: selectedTimezone
    }
  ];

  const filteredEvents = mockEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.instructorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedFilter === "all") return true;
    if (selectedFilter === "live") {
      const now = Date.now();
      const start = new Date(event.startTime).getTime();
      const end = start + event.durationMinutes * 60 * 1000;
      return now >= start && now < end;
    }
    return event.category === selectedFilter;
  });

  return (
    <DashboardLayout title="الورش التفاعلية والبث المباشر (Cohorts)">
      <div className="space-y-6" dir="rtl">
        {/* Header Banner */}
        <div
          className="relative overflow-hidden rounded-2xl bg-white border border-[#428177] p-6 md:p-8 shadow-sm"
          style={{
            backgroundImage: `linear-gradient(to left, rgba(255, 255, 255, 0.94), rgba(255, 255, 255, 0.85)), url('${getAssetUrl("/dashboard bg/teacherbackground.png")}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#428177]/10 text-[#428177] text-xs font-bold mb-3 border border-[#428177]/30">
                <Radio className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                <span>محرك الجلسات الحية والورش التفاعلية</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-[#002623]">
                غرفة الورش والجلسات المباشرة 🎙️
              </h1>
              <p className="text-[#3D3A3B] mt-2 text-sm max-w-2xl font-medium">
                انضم إلى الجلسات التفاعلية المباشرة مع نخبة المعلمين والخبراء، شارك في الورش البرمجية وحلقات النقاش الحية.
              </p>
            </div>

            {/* Timezone Selector & Host CTA */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
              <Select value={selectedTimezone} onValueChange={setSelectedTimezone}>
                <SelectTrigger className="text-xs h-9 bg-white border-[#428177]/40 font-bold w-48">
                  <Globe className="h-3.5 w-3.5 text-[#428177] ml-1.5" />
                  <SelectValue placeholder="اختر التوقيت" />
                </SelectTrigger>
                <SelectContent dir="rtl">
                  <SelectItem value="دمشق / الرياض (UTC+3)">دمشق / الرياض (UTC+3)</SelectItem>
                  <SelectItem value="بيروت / القدس (UTC+3)">بيروت / القدس (UTC+3)</SelectItem>
                  <SelectItem value="القاهرة (UTC+3)">القاهرة (UTC+3)</SelectItem>
                  <SelectItem value="دبي / مسقط (UTC+4)">دبي / مسقط (UTC+4)</SelectItem>
                  <SelectItem value="التوقيت العالمي (UTC)">التوقيت العالمي (UTC)</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={() => toast.info("سيتم فتح نافذة جدولة جلسة مباشرة جديدة لصنّاع المحتوى قريباً!")}
                className="bg-[#428177] hover:bg-[#054239] text-white text-xs h-9 px-3.5 rounded-xl font-extrabold flex items-center gap-1.5 shadow-sm"
              >
                <PlusCircle className="h-4 w-4" />
                <span>جدولة ورشة حية</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1">
            <Button
              variant={selectedFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter("all")}
              className={`text-xs font-bold rounded-xl h-8 ${
                selectedFilter === "all"
                  ? "bg-[#428177] text-white hover:bg-[#054239]"
                  : "border-[#428177]/30 text-[#002623] hover:bg-[#EDEBE0]"
              }`}
            >
              جميع الجلسات ({mockEvents.length})
            </Button>
            <Button
              variant={selectedFilter === "live" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter("live")}
              className={`text-xs font-bold rounded-xl h-8 flex items-center gap-1.5 ${
                selectedFilter === "live"
                  ? "bg-rose-600 text-white hover:bg-rose-700"
                  : "border-rose-200 text-rose-700 hover:bg-rose-50"
              }`}
            >
              <Radio className="h-3.5 w-3.5 animate-pulse" />
              <span>مباشر الآن (1)</span>
            </Button>
            <Button
              variant={selectedFilter === "workshop" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter("workshop")}
              className={`text-xs font-bold rounded-xl h-8 ${
                selectedFilter === "workshop"
                  ? "bg-[#428177] text-white hover:bg-[#054239]"
                  : "border-[#428177]/30 text-[#002623] hover:bg-[#EDEBE0]"
              }`}
            >
              ورش تطبيقية
            </Button>
            <Button
              variant={selectedFilter === "masterclass" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter("masterclass")}
              className={`text-xs font-bold rounded-xl h-8 ${
                selectedFilter === "masterclass"
                  ? "bg-[#6B1F2A] text-white hover:bg-[#521720]"
                  : "border-[#6B1F2A]/30 text-[#6B1F2A] hover:bg-[#6B1F2A]/10"
              }`}
            >
              ماستر كلاس
            </Button>
            <Button
              variant={selectedFilter === "office_hours" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter("office_hours")}
              className={`text-xs font-bold rounded-xl h-8 ${
                selectedFilter === "office_hours"
                  ? "bg-[#988561] text-white hover:bg-[#7d6c4d]"
                  : "border-[#988561]/30 text-[#002623] hover:bg-[#988561]/15"
              }`}
            >
              ساعات مكتبية
            </Button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="ابحث عن ورشة أو معلّم..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-9 text-xs h-9 bg-white border-[#428177]/30 font-medium rounded-xl"
            />
          </div>
        </div>

        {/* Event Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEvents.map((event) => (
            <WebinarRoomCard key={event.id} event={event} />
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-[#428177]/30 p-8 space-y-2">
            <Calendar className="h-10 w-10 text-[#428177]/50 mx-auto" />
            <h3 className="text-base font-extrabold text-[#002623]">لا توجد جلسات تطابق خيارات البحث</h3>
            <p className="text-xs text-muted-foreground">جرب تغيير الكلمات المفتاحية أو تصفح كافة الجلسات المتاحة.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
