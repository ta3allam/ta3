import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CohortEvent, MENA_TIMEZONES } from "@/lib/cohorts/cohortTime";
import { EventStore } from "@/lib/cohorts/eventStore";
import { toast } from "sonner";
import {
  Video,
  Calendar,
  Clock,
  Users,
  PlusCircle,
  Sparkles,
  Radio,
  Layers
} from "lucide-react";

interface CreateEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEventCreated: (event: CohortEvent) => void;
  defaultInstructorName?: string;
}

export function CreateEventModal({
  open,
  onOpenChange,
  onEventCreated,
  defaultInstructorName = "أستاذ معتمد"
}: CreateEventModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructorName, setInstructorName] = useState(defaultInstructorName);
  const [category, setCategory] = useState<CohortEvent["category"]>("workshop");
  const [startDate, setStartDate] = useState(
    new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString().slice(0, 10)
  );
  const [startTime, setStartTime] = useState("18:00");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [capacity, setCapacity] = useState(50);
  const [streamUrl, setStreamUrl] = useState("https://meet.jit.si/ta3allam-live-session");
  const [timezone, setTimezone] = useState("دمشق / مكة المكرمة / بغداد (UTC+3)");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("يرجى إدخال عنوان الجلسة");
      return;
    }

    if (!description.trim()) {
      toast.error("يرجى كتابة وصف موجز ومحاور الجلسة");
      return;
    }

    // Build ISO timestamp
    const fullDateTimeString = `${startDate}T${startTime}:00`;
    const startIso = new Date(fullDateTimeString).toISOString();

    const newEvent = EventStore.addEvent({
      title: title.trim(),
      description: description.trim(),
      instructorName: instructorName.trim() || "أستاذ معتمد",
      instructorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      startTime: startIso,
      durationMinutes: Number(durationMinutes) || 60,
      capacity: Number(capacity) || 50,
      streamUrl: streamUrl.trim() || undefined,
      category,
      timezone
    });

    toast.success("تمت جدولة الجلسة التفاعلية ونشرها بنجاح!");
    onEventCreated(newEvent);
    onOpenChange(false);

    // Reset form
    setTitle("");
    setDescription("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto text-right bg-white rounded-2xl p-6" dir="rtl">
        <DialogHeader className="space-y-2 pb-3 border-b border-[#428177]/15">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#428177]/15 flex items-center justify-center text-[#428177]">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <DialogTitle className="text-xl font-black text-[#002623]">
                جدولة جلسة أو ورشة عمل مباشرة جديدة
              </DialogTitle>
              <DialogDescription className="text-xs text-[#002623]/70 font-medium">
                قم بإعداد بث مباشر، ورشة عمل كود تفاعلية، أو ساعات مكتبية مفتوحة لطلابك
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-3">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="event-title" className="text-xs font-bold text-[#002623]">
              عنوان الجلسة المباشرة *
            </Label>
            <Input
              id="event-title"
              placeholder="مثال: ورشة عملية متقدمة في بناء واجهات المستخدم المتجاوبة"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-[#428177]/30 focus-visible:ring-[#428177] text-sm"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="event-desc" className="text-xs font-bold text-[#002623]">
              وصف ومحاور الجلسة *
            </Label>
            <Textarea
              id="event-desc"
              placeholder="اكتب نبذة عن أهداف الجلسة، التطبيقات العملية، والمشاريع التي سيتم تغطيتها..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="border-[#428177]/30 focus-visible:ring-[#428177] text-sm"
              required
            />
          </div>

          {/* Category & Instructor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#002623]">نوع الجلسة</Label>
              <Select value={category} onValueChange={(val) => setCategory(val as CohortEvent["category"])}>
                <SelectTrigger className="border-[#428177]/30 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent dir="rtl">
                  <SelectItem value="workshop">ورشة عمل تطبيقية (Workshop)</SelectItem>
                  <SelectItem value="masterclass">ماستر كلاس متقدم (Masterclass)</SelectItem>
                  <SelectItem value="office_hours">ساعات مكتبية مفتوحة (Office Hours)</SelectItem>
                  <SelectItem value="qa">جلسة أسئلة وأجوبة (Q&A)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="instructor" className="text-xs font-bold text-[#002623]">اسم المحاضر / المشرف</Label>
              <Input
                id="instructor"
                value={instructorName}
                onChange={(e) => setInstructorName(e.target.value)}
                className="border-[#428177]/30 focus-visible:ring-[#428177] text-sm"
              />
            </div>
          </div>

          {/* Date, Time, Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="start-date" className="text-xs font-bold text-[#002623]">تاريخ الجلسة</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border-[#428177]/30 focus-visible:ring-[#428177] text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="start-time" className="text-xs font-bold text-[#002623]">وقت البدء</Label>
              <Input
                id="start-time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="border-[#428177]/30 focus-visible:ring-[#428177] text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#002623]">المدة (بالدقائق)</Label>
              <Select value={String(durationMinutes)} onValueChange={(val) => setDurationMinutes(Number(val))}>
                <SelectTrigger className="border-[#428177]/30 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent dir="rtl">
                  <SelectItem value="30">30 دقيقة</SelectItem>
                  <SelectItem value="45">45 دقيقة</SelectItem>
                  <SelectItem value="60">60 دقيقة (ساعة)</SelectItem>
                  <SelectItem value="75">75 دقيقة</SelectItem>
                  <SelectItem value="90">90 دقيقة (ساعة ونصف)</SelectItem>
                  <SelectItem value="120">120 دقيقة (ساعتان)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Capacity, Stream URL, Timezone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="capacity" className="text-xs font-bold text-[#002623]">السعة القصوى للمقاعد</Label>
              <Input
                id="capacity"
                type="number"
                min="5"
                max="500"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="border-[#428177]/30 focus-visible:ring-[#428177] text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#002623]">المنطقة الزمنية</Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger className="border-[#428177]/30 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent dir="rtl">
                  {MENA_TIMEZONES.map((tz) => (
                    <SelectItem key={tz.id} value={tz.label}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="stream-url" className="text-xs font-bold text-[#002623]">رابط غرفة البث الافتراضية (Jitsi / Meet / Zoom / YouTube)</Label>
            <Input
              id="stream-url"
              placeholder="https://meet.jit.si/ta3allam-your-session"
              value={streamUrl}
              onChange={(e) => setStreamUrl(e.target.value)}
              className="border-[#428177]/30 focus-visible:ring-[#428177] text-sm font-mono text-left"
              dir="ltr"
            />
          </div>

          <DialogFooter className="pt-4 gap-2 border-t border-[#428177]/15 flex flex-row justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="text-xs font-bold border-slate-200"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              className="bg-[#428177] hover:bg-[#054239] text-white text-xs font-bold px-5"
            >
              تأكيد وجدولة الجلسة 🚀
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
