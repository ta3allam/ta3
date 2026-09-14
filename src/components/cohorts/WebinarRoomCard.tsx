import { useState } from "react";
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
  Sparkles
} from "lucide-react";
import {
  CohortEvent,
  calculateEventCountdown,
  checkSeatAvailability,
  formatArabicEventTime
} from "@/lib/cohorts/cohortTime";
import { toast } from "sonner";

interface WebinarRoomCardProps {
  event: CohortEvent;
  onRsvp?: (eventId: string | number) => void;
  isRegistered?: boolean;
}

export function WebinarRoomCard({ event, onRsvp, isRegistered = false }: WebinarRoomCardProps) {
  const [registered, setRegistered] = useState(isRegistered);
  const countdown = calculateEventCountdown(event.startTime, event.durationMinutes);
  const availability = checkSeatAvailability(event.capacity, event.enrolledCount + (registered && !isRegistered ? 1 : 0));

  const getCategoryBadge = (cat: CohortEvent['category']) => {
    switch (cat) {
      case 'workshop':
        return { label: 'ورشة عمل تطبيقية', color: 'bg-[#428177]/15 text-[#054239] border-[#428177]/30' };
      case 'masterclass':
        return { label: 'ماستر كلاس متقدم', color: 'bg-[#6B1F2A]/15 text-[#6B1F2A] border-[#6B1F2A]/30' };
      case 'office_hours':
        return { label: 'ساعات مكتبية مفتوحة', color: 'bg-[#988561]/20 text-[#002623] border-[#988561]/40' };
      case 'qa':
      default:
        return { label: 'جلسة أسئلة وأجوبة Q&A', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
    }
  };

  const badgeInfo = getCategoryBadge(event.category);

  const handleRegisterToggle = () => {
    if (registered) {
      setRegistered(false);
      toast.info("تم إلغاء تسجيلك في الجلسة");
    } else {
      setRegistered(true);
      toast.success("تم تأكيد حجز مقعدك بنجاح! سنرسل لك تذكيراً قبل الموعد.");
      if (onRsvp) onRsvp(event.id);
    }
  };

  const handleJoinStream = () => {
    if (event.streamUrl) {
      window.open(event.streamUrl, "_blank");
    } else {
      toast.info("جاري توجيهك إلى غرفة البث الافتراضية...");
    }
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

        <p className="text-xs text-[#3D3A3B] line-clamp-2 font-medium">
          {event.description}
        </p>
      </CardHeader>

      {/* Instructor & Metadata Details */}
      <CardContent className="p-5 pt-0 space-y-4">
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#EDEBE0]/40 border border-[#EDEBE0]">
          <Avatar className="h-9 w-9 border border-[#428177]/30">
            <AvatarImage src={event.instructorAvatar} alt={event.instructorName} />
            <AvatarFallback className="bg-[#428177] text-white text-xs font-bold">
              {event.instructorName.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="text-xs">
            <div className="font-extrabold text-[#002623]">{event.instructorName}</div>
            <div className="text-[11px] text-muted-foreground font-medium">مقدّم الورشة المعتمد</div>
          </div>
        </div>

        {/* Date, Time & Duration */}
        <div className="space-y-1.5 text-xs text-[#002623]">
          <div className="flex items-center gap-2 font-bold">
            <Calendar className="h-3.5 w-3.5 text-[#428177]" />
            <span>{formatArabicEventTime(event.startTime, event.timezone)}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground font-medium">
            <Clock className="h-3.5 w-3.5 text-[#988561]" />
            <span>المدة المقدرة: {event.durationMinutes} دقيقة تفاعلية</span>
          </div>
        </div>

        {/* Capacity & Seats */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="flex items-center gap-1.5 font-bold text-[#002623]">
              <Users className="h-3.5 w-3.5 text-[#428177]" />
              <span>المقاعد المحجوزة</span>
            </span>
            <span className="text-[11px] font-bold text-muted-foreground">
              {availability.isFull
                ? "اكتملت المقاعد بالكامل"
                : `متبقي ${availability.remainingSeats} مقعد من ${event.capacity}`}
            </span>
          </div>
          <Progress
            value={availability.percentageFilled}
            className={`h-1.5 bg-[#EDEBE0] ${
              availability.isFull ? "[&>div]:bg-[#6B1F2A]" : "[&>div]:bg-[#428177]"
            }`}
          />
        </div>
      </CardContent>

      {/* Action CTA Footer */}
      <CardFooter className="p-4 bg-[#EDEBE0]/20 border-t border-[#428177]/10 flex items-center gap-2">
        {countdown.isLiveNow ? (
          <Button
            onClick={handleJoinStream}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs h-9 rounded-xl shadow-md flex items-center justify-center gap-2"
          >
            <Video className="h-4 w-4 animate-pulse" />
            <span>دخول قاعة البث المباشر الآن</span>
          </Button>
        ) : countdown.hasEnded ? (
          event.recordingUrl ? (
            <Button
              variant="outline"
              onClick={() => window.open(event.recordingUrl, "_blank")}
              className="w-full border-[#428177] text-[#054239] hover:bg-[#428177]/10 font-bold text-xs h-9 rounded-xl flex items-center justify-center gap-2"
            >
              <PlayCircle className="h-4 w-4 text-[#428177]" />
              <span>مشاهدة التسجيل المسجل</span>
            </Button>
          ) : (
            <Button
              disabled
              variant="outline"
              className="w-full text-xs h-9 rounded-xl font-bold text-muted-foreground"
            >
              التسجيل غير متاح حالياً
            </Button>
          )
        ) : availability.isFull && !registered ? (
          <Button
            variant="outline"
            onClick={handleRegisterToggle}
            className="w-full border-rose-300 text-rose-800 hover:bg-rose-50 font-bold text-xs h-9 rounded-xl flex items-center justify-center gap-1.5"
          >
            <AlertCircle className="h-4 w-4 text-rose-600" />
            <span>الانضمام لقائمة الانتظار</span>
          </Button>
        ) : (
          <Button
            onClick={handleRegisterToggle}
            className={`w-full font-bold text-xs h-9 rounded-xl transition-colors flex items-center justify-center gap-2 ${
              registered
                ? "bg-[#EDEBE0] hover:bg-rose-50 text-[#002623] hover:text-rose-700 border border-[#428177]/30"
                : "bg-[#428177] hover:bg-[#054239] text-white shadow-sm"
            }`}
          >
            {registered ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>تم التسجيل (إلغاء الحجز)</span>
              </>
            ) : (
              <>
                <Calendar className="h-4 w-4" />
                <span>حجز مقعد مجاني في الورشة</span>
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
