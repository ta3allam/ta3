import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Radio,
  Video,
  Sparkles,
  Clock,
  CheckCircle2,
  Maximize2,
  Zap,
  Bookmark
} from "lucide-react";
import { toast } from "sonner";

interface ChapterMarker {
  time: string;
  seconds: number;
  title: string;
}

interface InteractiveLessonPlayerProps {
  lectureId: number;
  title: string;
  videoUrl?: string;
  audioUrl?: string;
  duration?: string;
  chapters?: ChapterMarker[];
  onComplete?: () => void;
}

const DEFAULT_CHAPTERS: ChapterMarker[] = [
  { time: "00:00", seconds: 0, title: "مقدمة الدرس والأهداف التعليمية" },
  { time: "03:45", seconds: 225, title: "المفاهيم الأساسية والبنية المعمارية" },
  { time: "09:30", seconds: 570, title: "التطبيق العملي وكتابة الكود" },
  { time: "16:15", seconds: 975, title: "الخلاصة وأفضل ممارسات الإنتاج" }
];

export function InteractiveLessonPlayer({
  lectureId,
  title,
  videoUrl,
  audioUrl,
  duration = "21:40",
  chapters = DEFAULT_CHAPTERS,
  onComplete
}: InteractiveLessonPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioOnly, setIsAudioOnly] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(35); // simulated percent
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  const speedOptions = [0.75, 1, 1.25, 1.5, 2];

  const handleTogglePlay = () => {
    const nextPlay = !isPlaying;
    setIsPlaying(nextPlay);
    if (nextPlay) {
      toast.info(isAudioOnly ? "جاري تشغيل التسجيل الصوتي المنخفض الحجم" : "جاري تشغيل محاضرة الفيديو التفاعلية");
    }
  };

  const handleToggleAudioMode = () => {
    const nextMode = !isAudioOnly;
    setIsAudioOnly(nextMode);
    if (nextMode) {
      toast.success("تم تفعيل وضع الصوت فقط 🎧 — تم تقليل استهلاك البيانات بنسبة 85% لتناسب شبكات 3G والكهرباء الضعيفة!");
    } else {
      toast.info("تم تفعيل وضع الفيديو عالي الدقة 🎬");
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    toast.success(`تم ضبط سرعة التشغيل على ${speed}x`);
  };

  const handleJumpToChapter = (chapter: ChapterMarker, index: number) => {
    setActiveChapterIndex(index);
    setCurrentProgress((chapter.seconds / 1300) * 100);
    toast.info(`تم الانتقال إلى: ${chapter.title} (${chapter.time})`);
  };

  const handleMarkComplete = () => {
    setCurrentProgress(100);
    onComplete?.();
    toast.success("تهانينا! تم إكمال الدرس وحساب نقاط الخبرة 🌟");
  };

  return (
    <Card className="border border-[#428177]/40 bg-[#002623] text-white shadow-lg rounded-3xl overflow-hidden text-right" dir="rtl">
      <CardContent className="p-0">
        {/* Top Control Bar: Audio Mode Banner & Speed Badges */}
        <div className="bg-[#054239] px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 border-b border-[#428177]/30 text-xs">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleToggleAudioMode}
              className={`h-7 px-2.5 rounded-xl font-bold text-xs gap-1 transition-all ${
                isAudioOnly
                  ? "bg-[#988561] text-white border-transparent hover:bg-[#B9A779]"
                  : "bg-[#002623]/60 text-[#EDEBE0] border-[#428177]/40 hover:bg-[#002623]"
              }`}
            >
              {isAudioOnly ? <Radio className="h-3.5 w-3.5 animate-pulse text-white" /> : <Video className="h-3.5 w-3.5 text-[#428177]" />}
              <span>{isAudioOnly ? "وضع الصوت فقط (نشط)" : "تفعيل وضع الصوت (توفير 3G)"}</span>
            </Button>

            {isAudioOnly && (
              <Badge className="bg-[#988561]/20 text-[#EDEBE0] border border-[#988561]/40 text-[10px] font-bold">
                توفير 85% إنترنت ⚡
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-[#EDEBE0]/70 font-medium">السرعة:</span>
            <div className="flex items-center gap-1 bg-[#002623] p-0.5 rounded-lg border border-[#428177]/30">
              {speedOptions.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSpeedChange(s)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold transition-colors ${
                    playbackSpeed === s
                      ? "bg-[#428177] text-white"
                      : "text-[#EDEBE0]/70 hover:text-white"
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Video / Audio Canvas Display */}
        <div className="relative aspect-video w-full bg-[#161616] flex flex-col items-center justify-center p-6 text-center overflow-hidden">
          {isAudioOnly ? (
            /* Low-Bandwidth Audio Mode Screen */
            <div className="space-y-4 max-w-md animate-fadeIn">
              <div className="w-20 h-20 rounded-full bg-[#428177]/20 border-2 border-[#428177] flex items-center justify-center mx-auto shadow-inner">
                <Radio className={`w-10 h-10 text-[#EDEBE0] ${isPlaying ? 'animate-bounce' : ''}`} />
              </div>
              <div className="space-y-1">
                <Badge className="bg-[#988561] text-[#002623] font-black text-xs">
                  بث صوتي مخفف (Low-Bandwidth AAC)
                </Badge>
                <h3 className="text-base font-extrabold text-white">{title}</h3>
                <p className="text-xs text-[#EDEBE0]/70 font-medium">
                  تم إيقاف تدفق الفيديو لتوفير باقة الإنترنت والعمل بكفاءة على شبكات بلاد الشام.
                </p>
              </div>
            </div>
          ) : (
            /* High-Res Video Canvas */
            <div className="space-y-3 max-w-md">
              <div className="w-16 h-16 rounded-2xl bg-[#428177]/30 border border-[#428177] flex items-center justify-center mx-auto">
                <Video className="w-8 h-8 text-[#EDEBE0]" />
              </div>
              <h3 className="text-base font-extrabold text-white">{title}</h3>
              <p className="text-xs text-slate-400">جودة البث: 720p HD • مدة الدرس: {duration} دقيقة</p>
            </div>
          )}

          {/* Center Big Play Trigger */}
          <button
            onClick={handleTogglePlay}
            className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-[#428177]/90 hover:bg-[#428177] text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110 active:scale-95 border-2 border-white/20"
          >
            {isPlaying ? <Pause className="w-7 h-7 fill-white" /> : <Play className="w-7 h-7 fill-white ml-0.5" />}
          </button>
        </div>

        {/* Player Bottom Scrubber & Timers */}
        <div className="p-4 bg-[#054239]/80 space-y-3 border-t border-[#428177]/30">
          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="w-full bg-[#002623] h-2 rounded-full overflow-hidden cursor-pointer">
              <div
                className="bg-gradient-to-r from-[#428177] to-[#988561] h-full transition-all duration-300"
                style={{ width: `${currentProgress}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[11px] text-[#EDEBE0]/70 font-mono" dir="ltr">
              <span>07:35</span>
              <span>{duration}</span>
            </div>
          </div>

          {/* Playback Actions Row */}
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleTogglePlay}
                className="text-[#EDEBE0] hover:bg-[#428177]/30 h-8 px-2 font-bold"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                <span className="mr-1.5">{isPlaying ? "إيقاف مؤقت" : "تشغيل"}</span>
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => setCurrentProgress(prev => Math.max(0, prev - 5))}
                className="text-[#EDEBE0] hover:bg-[#428177]/30 h-8 px-2"
                title="تراجع 10 ثوانٍ"
              >
                <RotateCcw className="h-4 w-4 ml-1" />
                <span className="text-[10px]">10 ثوانٍ</span>
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsMuted(prev => !prev)}
                className="text-[#EDEBE0] hover:bg-[#428177]/30 h-8 px-2"
              >
                {isMuted ? <VolumeX className="h-4 w-4 text-rose-400" /> : <Volume2 className="h-4 w-4 text-[#428177]" />}
              </Button>
            </div>

            <Button
              size="sm"
              onClick={handleMarkComplete}
              className="bg-[#428177] hover:bg-[#054239] text-white font-bold text-xs h-8 rounded-xl gap-1.5 shadow-sm"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>إكمال الدرس فوراً</span>
            </Button>
          </div>
        </div>

        {/* Chapter Timeline Bookmarks (Skool Style) */}
        <div className="p-4 bg-[#002623] border-t border-[#428177]/20 space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-xs text-[#EDEBE0] flex items-center gap-1.5">
              <Bookmark className="h-3.5 w-3.5 text-[#988561]" />
              فهرس محاور ومحطات الدرس (Chapters)
            </h4>
            <span className="text-[10px] text-[#EDEBE0]/60">اضغط للانتقال مباشرة</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {chapters.map((ch, idx) => (
              <button
                key={idx}
                onClick={() => handleJumpToChapter(ch, idx)}
                className={`flex items-center justify-between p-2.5 rounded-xl text-right transition-all border ${
                  activeChapterIndex === idx
                    ? "bg-[#428177]/30 border-[#428177] text-white shadow-xs"
                    : "bg-[#054239]/40 border-transparent text-[#EDEBE0]/80 hover:bg-[#054239] hover:text-white"
                }`}
              >
                <span className="text-xs font-bold truncate max-w-[200px]">{ch.title}</span>
                <span className="text-[10px] font-mono text-[#988561] bg-[#002623] px-1.5 py-0.5 rounded-md">
                  {ch.time}
                </span>
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
