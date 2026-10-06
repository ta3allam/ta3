import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Video,
  Calendar,
  Clock,
  Users,
  PlayCircle,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  Download,
  CalendarPlus,
  Radio,
  Headphones
} from "lucide-react";
import {
  CohortEvent,
  calculateEventCountdown,
  checkSeatAvailability,
  formatArabicEventTime
} from "@/lib/cohorts/cohortTime";
import { generateGoogleCalendarUrl, downloadIcsFile } from "@/lib/cohorts/calendarExport";
import { toast } from "sonner";

interface WebinarRoomCardProps {
  event: CohortEvent;
  onRsvp?: (eventId: string | number) => void;
  onJoinSession?: (event: CohortEvent) => void;
  isRegistered?: boolean;
}

export function WebinarRoomCard({
  event,
  onRsvp,
  onJoinSession,
  isRegistered = false
}: WebinarRoomCardProps) {
  const [registered, setRegistered] = useState(isRegistered);
  const [tick, setTick] = useState(0);

  // Live countdown ticker
  useEffect(() => {
    setRegistered(isRegistered);
  }, [isRegistered]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const countdown = calculateEventCountdown(event.startTime, event.durationMinutes);
  const availability = checkSeatAvailability(
    event.capacity,
    event.enrolledCount + (registered && !isRegistered ? 1 : 0)
  );

  const getCategoryBadge = (cat: CohortEvent["category"]) => {
    switch (cat) {
      case "workshop":
        return { label: "ورشة عمل تطبيقية", color: "bg-[#428177]/15 text-[#054239] border-[#428177]/30" };
      case "masterclass":
        return { label: "ماستر كلاس متقدم", color: "bg-[#6B1F2A]/15 text-[#6B1F2A] border-[#6B1F2A]/30" };
      case "office_hours":
        return { label: "ساعات مكتبية مفتوحة", color: "bg-[#988561]/20 text-[#002623] border-[#988561]/40" };
      case "qa":
      default:
        return { label: "جلسة أسئلة وأجوبة Q&A", color: "bg-emerald-100 text-emerald-800 border-emerald-300" };
    }
  };

  const badgeInfo = getCategoryBadge(event.category);

  const handleRegisterToggle = () => {
    if (registered) {
      setRegistered(false);
      toast.info("تم إلغاء تسجيلك في الجلسة");
      if (onRsvp) onRsvp(event.id);
    } else {
      setRegistered(true);
      toast.success("تم تأكيد حجز مقعدك بنجاح! سنرسل لك تذكيراً قبل الموعد.");
      if (onRsvp) onRsvp(event.id);
    }
  };

  const handleJoinClick = () => {
    if (onJoinSession) {
      onJoinSession(event);
    } else if (event.streamUrl) {
      window.open(event.streamUrl, "_blank");
    } else {
      toast.info("جاري توجيهك إلى غرفة البث الافتراضية...");
    }
  };

  const handleGoogleCalendar = () => {
    const url = generateGoogleCalendarUrl(event);
    window.open(url, "_blank");
    toast.success("تم فتح تقويم Google لإضافة التذكير");
  };

  const handleIcsDownload = () => {
    downloadIcsFile(event);
    toast.success("تم تحميل ملف التقويم iCal (.ics) لجهازك");
  };

  return (
    <Card className="border border-[#428177]/25 hover:border-[#428177]/50 transition-all duration-200 bg-white shadow-sm hover:shadow-md rounded-2xl flex flex-col justify-between overflow-hidden text-right" dir="rtl">
      {/* Header & Status Indicator */}
      <CardHeader className="p-5 pb-3 space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <Badge variant="outline" className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${badgeInfo.color}`}>
            {badgeInfo.label}
          </Badge>

          {countdown.isLiveNow ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-600 text-white animate-pulse shadow-sm">
              <span className="w-2 h-2 rounded-full bg-white"></span>
              بث مباشر الآن 🔴
            </span>
          ) : countdown.hasEnded ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-muted text-muted-foreground">
              <CheckCircle2 className="w-3.5 h-3.5" />
              انتهت الجلسة
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EDEBE0] text-[#002623]">
              <Clock className="w-3.5 h-3.5 text-[#428177]" />
              {countdown.formattedText}
            </span>
          )}
        </div>

        <h3 className="font-extrabold text-base text-[#002623] leading-snug line-clamp-2">
          {event.title}
        </h3>

        <p className="text-xs text-[#002623]/70 leading-relaxed line-clamp-2">
          {event.description}
        </p>
      </CardHeader>

      <CardContent className="p-5 pt-0 space-y-4">
        {/* Time & Date Info */}
        <div className="p-3 bg-[#EDEBE0]/40 rounded-xl space-y-1.5 border border-[#428177]/10">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#002623]">
            <Calendar className="w-4 h-4 text-[#428177] shrink-0" />
            <span>{formatArabicEventTime(event.startTime, event.timezone)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#002623]/70">
            <Clock className="w-3.5 h-3.5 text-[#988561] shrink-0" />
            <span>المدة المقررة: {event.durationMinutes} دقيقة</span>
          </div>
        </div>

        {/* Seat Availability Meter */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#002623] flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-[#428177]" />
              المقاعد المحجوزة
            </span>
            <span className="font-semibold text-xs text-[#002623]/80">
              {event.enrolledCount + (registered && !isRegistered ? 1 : 0)} / {event.capacity}
            </span>
          </div>

          <Progress
            value={availability.percentageFilled}
            className={`h-2 rounded-full ${
              availability.isFull ? "bg-rose-100 [&>div]:bg-rose-600" : "bg-slate-100 [&>div]:bg-[#428177]"
            }`}
          />

          {availability.isFull && !registered && (
            <p className="text-[11px] text-[#6B1F2A] font-bold flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              اكتملت المقاعد المخصصة لهذه الجلسة
            </p>
          )}
        </div>

        {/* Instructor Info */}
        <div className="flex items-center gap-3 pt-2 border-t border-[#428177]/15">
          <Avatar className="w-9 h-9 border border-[#428177]/30">
            <AvatarImage src={event.instructorAvatar} alt={event.instructorName} />
            <AvatarFallback className="bg-[#428177]/20 text-[#002623] text-xs font-bold">
              {event.instructorName.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="text-right">
            <p className="text-xs font-bold text-[#002623]">{event.instructorName}</p>
            <p className="text-[11px] text-[#002623]/60">مدرب الجلسة</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0 flex flex-col gap-2">
        {/* Main Action Button */}
        {countdown.isLiveNow ? (
          <Button
            onClick={handleJoinClick}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black text-xs py-5 rounded-xl shadow-md gap-2"
          >
            <Radio className="w-4 h-4 animate-pulse" />
            دخول غرفة البث المباشر الآن
          </Button>
        ) : countdown.hasEnded ? (
          event.recordingUrl ? (
            <Button
              onClick={handleJoinClick}
              variant="outline"
              className="w-full border-[#428177] text-[#054239] hover:bg-[#EDEBE0]/50 font-bold text-xs py-5 rounded-xl gap-2"
            >
              <PlayCircle className="w-4 h-4 text-[#428177]" />
              مشاهدة تسجيل الجلسة
            </Button>
          ) : (
            <Button
              disabled
              variant="ghost"
              className="w-full text-muted-foreground text-xs font-medium py-5 rounded-xl"
            >
              انتهت الجلسة (التسجيل قيد المعالجة)
            </Button>
          )
        ) : (
          <Button
            onClick={handleRegisterToggle}
            disabled={availability.isFull && !registered}
            variant={registered ? "secondary" : "default"}
            className={`w-full font-bold text-xs py-5 rounded-xl transition-all ${
              registered
                ? "bg-[#EDEBE0] text-[#002623] hover:bg-[#EDEBE0]/80 border border-[#428177]/30"
                : "bg-[#428177] hover:bg-[#054239] text-white shadow-sm"
            }`}
          >
            {registered ? (
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#428177]" />
                أنت مسجل في الجلسة (إلغاء الحجز)
              </span>
            ) : availability.isFull ? (
              "المقاعد ممتلئة"
            ) : (
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#988561]" />
                تأكيد حجز مقعد مجاناً
              </span>
            )}
          </Button>
        )}

        {/* Calendar Sync Buttons */}
        {!countdown.hasEnded && (
          <div className="grid grid-cols-2 gap-2 w-full pt-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGoogleCalendar}
              className="text-[11px] h-8 text-[#002623]/80 hover:text-[#002623] hover:bg-[#EDEBE0]/50 gap-1 rounded-lg border border-[#428177]/15"
            >
              <CalendarPlus className="w-3.5 h-3.5 text-[#428177]" />
              تقويم Google
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleIcsDownload}
              className="text-[11px] h-8 text-[#002623]/80 hover:text-[#002623] hover:bg-[#EDEBE0]/50 gap-1 rounded-lg border border-[#428177]/15"
            >
              <Download className="w-3.5 h-3.5 text-[#988561]" />
              ملف iCal
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
