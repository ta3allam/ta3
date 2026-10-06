import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CohortEvent, calculateEventCountdown, formatArabicEventTime } from "@/lib/cohorts/cohortTime";
import { EventStore, LiveQuestion } from "@/lib/cohorts/eventStore";
import { toast } from "sonner";
import {
  Video,
  Radio,
  Users,
  MessageSquare,
  ThumbsUp,
  Send,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Headphones
} from "lucide-react";

interface LiveSessionStageModalProps {
  event: CohortEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LiveSessionStageModal({
  event,
  open,
  onOpenChange
}: LiveSessionStageModalProps) {
  const [questions, setQuestions] = useState<LiveQuestion[]>([]);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [authorName, setAuthorName] = useState("طالب مشارك");
  const [isAudioOnly, setIsAudioOnly] = useState(false);
  const [activeTab, setActiveTab] = useState<"stage" | "qa">("stage");

  useEffect(() => {
    if (event) {
      setQuestions(EventStore.getQuestions(event.id));
    }
  }, [event, open]);

  if (!event) return null;

  const countdown = calculateEventCountdown(event.startTime, event.durationMinutes);

  const handleSendQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    const added = EventStore.addQuestion(event.id, authorName, newQuestionText);
    setQuestions([added, ...questions]);
    setNewQuestionText("");
    toast.success("تم إرسال سؤالك إلى المحاضر بنجاح!");
  };

  const handleUpvote = (qid: string) => {
    const updated = EventStore.upvoteQuestion(qid);
    setQuestions(questions.map(q => q.id === qid ? { ...q, upvotes: updated } : q));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto p-0 bg-[#002623] text-white border border-[#428177]/40 rounded-2xl" dir="rtl">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-[#428177]/25 flex flex-wrap items-center justify-between gap-3 bg-[#054239]/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            {countdown.isLiveNow ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-600 text-white animate-pulse">
                <span className="w-2 h-2 rounded-full bg-white"></span>
                بث مباشر الآن 🔴
              </span>
            ) : countdown.hasEnded ? (
              <Badge variant="outline" className="border-slate-500 text-slate-300 text-xs font-bold">
                تسجيل الجلسة
              </Badge>
            ) : (
              <Badge variant="outline" className="border-[#428177] text-[#EDEBE0] text-xs font-bold">
                جلسة قادمة
              </Badge>
            )}

            <h2 className="text-sm sm:text-base font-bold text-white truncate max-w-md">
              {event.title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={isAudioOnly ? "secondary" : "outline"}
              size="sm"
              onClick={() => setIsAudioOnly(!isAudioOnly)}
              className="text-xs font-bold gap-1.5 border-[#428177]/40"
            >
              <Headphones className="w-3.5 h-3.5 text-[#EDEBE0]" />
              {isAudioOnly ? "نمط الصوت فقط (توفير 97%)" : "بث الفيديو كامل"}
            </Button>
          </div>
        </div>

        {/* Main Stage Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 min-h-[450px]">
          {/* Main Video / Audio Player Stage */}
          <div className="lg:col-span-2 p-4 sm:p-6 flex flex-col justify-between bg-black/40 border-b lg:border-b-0 lg:border-l border-[#428177]/20">
            {isAudioOnly ? (
              <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 text-center rounded-xl bg-[#054239]/40 border border-[#428177]/30">
                <div className="w-20 h-20 rounded-full bg-[#428177]/20 flex items-center justify-center text-[#428177] mb-4 animate-pulse">
                  <Headphones className="w-10 h-10 text-[#EDEBE0]" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">وضع البث الصوتي منخفض الباندويث</h4>
                <p className="text-xs text-[#EDEBE0]/70 max-w-sm mb-4">
                  تم إيقاف تدفق الفيديو لضمان استمرارية الصوت والنقاش في بيئات الإنترنت الضعيفة.
                </p>
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="text-xs font-mono text-emerald-300">الصوت متصل: 32 kbps Opus</span>
                </div>
              </div>
            ) : event.streamUrl ? (
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-[#428177]/30 shadow-lg flex items-center justify-center">
                <iframe
                  src={event.streamUrl}
                  title="Live Stream Room"
                  className="w-full h-full border-0"
                  allow="camera; microphone; fullscreen; display-capture"
                />
              </div>
            ) : event.recordingUrl ? (
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-[#428177]/30 shadow-lg flex items-center justify-center">
                <div className="text-center p-6">
                  <Video className="w-12 h-12 text-[#428177] mx-auto mb-3" />
                  <h4 className="font-bold text-white mb-1">تسجيل الورشة متاح للمشاهدة</h4>
                  <p className="text-xs text-[#EDEBE0]/70 mb-4">اضغط على الزر أدناه لمشاهدة التسجيل الكامل</p>
                  <Button
                    onClick={() => window.open(event.recordingUrl, "_blank")}
                    className="bg-[#428177] hover:bg-[#054239] text-white text-xs font-bold gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    فتح رابط التسجيل
                  </Button>
                </div>
              </div>
            ) : (
              <div className="aspect-video w-full rounded-xl bg-[#054239]/40 border border-[#428177]/30 flex flex-col items-center justify-center text-center p-6">
                <Video className="w-12 h-12 text-[#988561] mb-3" />
                <h4 className="text-base font-bold text-white mb-1">تبدأ الجلسة في الموعد المحدد</h4>
                <p className="text-xs text-[#EDEBE0]/70 mb-3">{formatArabicEventTime(event.startTime, event.timezone)}</p>
                <p className="text-xs font-bold text-[#988561]">{countdown.formattedText}</p>
              </div>
            )}

            {/* Instructor & Meta Details */}
            <div className="mt-4 pt-4 border-t border-[#428177]/20 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 border border-[#428177]">
                  <AvatarImage src={event.instructorAvatar} alt={event.instructorName} />
                  <AvatarFallback className="bg-[#428177] text-white font-bold">
                    {event.instructorName.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-sm font-bold text-white">{event.instructorName}</h4>
                  <p className="text-xs text-[#EDEBE0]/70">المحاضر والمشرف على الجلسة</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-[#EDEBE0]/80 bg-[#054239] px-3 py-1.5 rounded-lg border border-[#428177]/30">
                <Users className="w-3.5 h-3.5 text-[#428177]" />
                <span>{event.enrolledCount} مشارك مسجل</span>
              </div>
            </div>
          </div>

          {/* Interactive Q&A Panel */}
          <div className="p-4 sm:p-5 flex flex-col justify-between bg-[#002623]/90">
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#428177]/20">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#428177]" />
                  <h3 className="font-bold text-sm text-white">أسئلة الطلاب واستفساراتهم</h3>
                </div>
                <Badge variant="secondary" className="text-[10px] bg-[#428177]/20 text-[#EDEBE0]">
                  {questions.length} سؤال
                </Badge>
              </div>

              {/* Questions List */}
              <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
                {questions.length === 0 ? (
                  <div className="text-center py-10 text-xs text-[#EDEBE0]/60">
                    لا توجد أسئلة حتى الآن. كن أول من يطرح سؤالاً على المحاضر!
                  </div>
                ) : (
                  questions.map((q) => (
                    <div
                      key={q.id}
                      className="p-2.5 rounded-xl bg-[#054239]/60 border border-[#428177]/20 space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#EDEBE0]">{q.authorName}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUpvote(q.id)}
                          className="h-6 px-2 text-[10px] text-[#EDEBE0] hover:text-white hover:bg-[#428177]/40 gap-1 rounded-full"
                        >
                          <ThumbsUp className="w-3 h-3 text-[#428177]" />
                          <span>{q.upvotes}</span>
                        </Button>
                      </div>
                      <p className="text-xs text-white/90 leading-relaxed">{q.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Question Input Form */}
            <form onSubmit={handleSendQuestion} className="pt-3 mt-3 border-t border-[#428177]/20 space-y-2">
              <Input
                placeholder="اسمك أو صفتك..."
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="bg-[#054239]/50 border-[#428177]/30 text-white text-xs h-7"
              />
              <div className="flex gap-2">
                <Input
                  placeholder="اطرح سؤالك أو ملاحظتك هنا..."
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  className="bg-[#054239]/50 border-[#428177]/30 text-white text-xs h-8 focus-visible:ring-[#428177]"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="bg-[#428177] hover:bg-[#054239] text-white h-8 px-3"
                >
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
