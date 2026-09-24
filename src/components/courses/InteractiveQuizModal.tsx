import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Award,
  Sparkles,
  RotateCcw,
  Clock,
  ArrowLeft,
  ArrowRight
} from "lucide-react";

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface InteractiveQuizModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseTitle: string;
  lectureTitle: string;
  questions?: QuizQuestion[];
  onQuizCompleted?: (scorePercent: number) => void;
}

const defaultQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "ما هو المبدأ الأساسي في فصل المهام بين صانع المحتوى المستقل والمعلم الأكاديمي؟",
    options: [
      "المعلم يدير أرباح المحفظة وصانع المحتوى يدير الامتحانات فقط",
      "صانع المحتوى التجاري يمتلك المحفظة والتسعير، بينما المعلم يدير التقييمات والشعب الأكاديمية",
      "كلاهما يمتلكان نفس الصلاحيات بدون أي فرق",
      "الأدمن هو الوحيد الذي يمكنه مشاهدة المنهج"
    ],
    correctIndex: 1,
    explanation: "صانع المحتوى يركز على الجوانب التجارية وتسعير الدورات وسحب الأرباح، بينما يركز المعلم الأكاديمي على الواجبات ورصد الدرجات والتعليم الصفي."
  },
  {
    id: 2,
    question: "ما هي نسبة عمولة دعم المنصة المستقطعة تلقائياً من مبيعات الدورات التجارية؟",
    options: ["5%", "10%", "15%", "25%"],
    correctIndex: 2,
    explanation: "تعتمد المنصة نسبة ثابتة قدرها 15% كرسوم دعم وتشغيل وصيانة الخوادم والخدمات السحابية."
  },
  {
    id: 3,
    question: "كيف يتم التحقق من صحة الشهادات الصادرة عبر منصة تعلّم؟",
    options: [
      "عبر رقم مرجعي مشفر (UUID) ومعاينة تفاعلية في السجل الأكاديمي",
      "من خلال إرسال رسالة بريدية ورقية",
      "عبر طباعة الشهادة وتوقيعها يدوياً فقط",
      "لا يمكن التحقق من الشهادات رقمياً"
    ],
    correctIndex: 0,
    explanation: "توفر المنصة رمز تحقق مشفر ومعاينة رقمية للشهادات تدعم التحقق الفوري من صحة الاعتماد وتاريخ الإصدار."
  }
];

export function InteractiveQuizModal({
  open,
  onOpenChange,
  courseTitle,
  lectureTitle,
  questions = defaultQuestions,
  onQuizCompleted
}: InteractiveQuizModalProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentQ = questions[currentIdx];
  const progressPercent = Math.round(((currentIdx + 1) / questions.length) * 100);

  const handleSelectOption = (optIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [currentIdx]: optIndex }));
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correct++;
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  const handleSubmitQuiz = () => {
    if (Object.keys(selectedAnswers).length < questions.length) {
      toast.error("يرجى الإجابة على جميع الأسئلة قبل تسليم الاختبار");
      return;
    }

    setIsSubmitted(true);
    const score = calculateScore();
    if (score >= 70) {
      toast.success(`أحسنت! اجتزت الاختبار بنجاح بنسبة ${score}% 🌟`);
    } else {
      toast.info(`حصلت على ${score}%. يمكنك مراجعة الإجابات وإعادة المحاولة.`);
    }

    if (onQuizCompleted) {
      onQuizCompleted(score);
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setCurrentIdx(0);
  };

  const score = calculateScore();
  const isPassed = score >= 70;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="max-w-2xl bg-white border border-[#428177]/40 text-right rounded-3xl p-6 shadow-2xl">
        <DialogHeader className="border-b border-[#EDEBE0] pb-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[#428177]/10 text-[#428177]">
                <HelpCircle className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-right text-[#002623] font-black text-base">
                  اختبار قياس المعرفة والاستيعاب 📝
                </DialogTitle>
                <span className="text-[11px] text-muted-foreground font-semibold">{lectureTitle} • {courseTitle}</span>
              </div>
            </div>

            <Badge variant="outline" className="border-[#428177]/30 text-[#002623] font-bold text-xs">
              السؤال {currentIdx + 1} من {questions.length}
            </Badge>
          </div>

          <div className="pt-3">
            <Progress value={progressPercent} className="h-2 bg-[#EDEBE0]" />
          </div>
        </DialogHeader>

        {!isSubmitted ? (
          <div className="space-y-6 py-3">
            <div className="p-4 bg-[#EDEBE0]/30 rounded-2xl border border-[#428177]/15">
              <h3 className="font-extrabold text-sm text-[#002623] leading-relaxed">
                {currentQ.question}
              </h3>
            </div>

            <div className="space-y-2.5">
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = selectedAnswers[currentIdx] === optIdx;
                return (
                  <div
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between text-xs font-bold ${
                      isSelected
                        ? 'border-[#428177] bg-[#428177]/10 text-[#002623] shadow-xs'
                        : 'border-[#EDEBE0] hover:bg-[#EDEBE0]/40 text-[#3D3A3B]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-black ${
                        isSelected ? 'bg-[#428177] text-white' : 'bg-[#EDEBE0] text-[#3D3A3B]'
                      }`}>
                        {String.fromCharCode(65 + optIdx)}
                      </div>
                      <span>{opt}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between pt-2 border-t border-[#EDEBE0]">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                disabled={currentIdx === 0}
                className="text-xs font-bold border-[#428177]/30 gap-1 rounded-xl"
              >
                <ArrowRight className="h-4 w-4" />
                <span>السؤال السابق</span>
              </Button>

              {currentIdx < questions.length - 1 ? (
                <Button
                  size="sm"
                  onClick={() => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1))}
                  className="bg-[#428177] hover:bg-[#054239] text-white text-xs font-bold gap-1 rounded-xl"
                >
                  <span>السؤال التالي</span>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={handleSubmitQuiz}
                  className="bg-[#002623] hover:bg-[#054239] text-[#EDEBE0] text-xs font-bold gap-1.5 rounded-xl shadow-md"
                >
                  <CheckCircle2 className="h-4 w-4 text-[#988561]" />
                  <span>تسليم الاختبار واعتماد النتيجة</span>
                </Button>
              )}
            </div>
          </div>
        ) : (
          /* Results View with Explanations */
          <div className="space-y-5 py-3">
            <div className={`p-6 rounded-3xl border text-center space-y-2 ${
              isPassed
                ? 'bg-emerald-500/10 border-emerald-600/30 text-emerald-900'
                : 'bg-amber-500/10 border-amber-600/30 text-amber-900'
            }`}>
              <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mx-auto">
                {isPassed ? (
                  <Award className="h-7 w-7 text-emerald-700" />
                ) : (
                  <RotateCcw className="h-7 w-7 text-amber-700" />
                )}
              </div>
              <h3 className="text-2xl font-black">{score}%</h3>
              <p className="text-xs font-bold">
                {isPassed
                  ? 'تهانينا! لقد اجتزت اختبار استيعاب المحاضرة بنجاح واكتسبت نقاط التقدم الأكاديمي.'
                  : 'لم تصل لنسبة الاجتياز المطلوبة (70%). يمكنك مراجعة الشروحات أدناه وإعادة الاختبار.'}
              </p>
            </div>

            {/* Answer Explanations List */}
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {questions.map((q, qIdx) => {
                const isCorrect = selectedAnswers[qIdx] === q.correctIndex;
                return (
                  <div key={q.id} className="p-3.5 bg-white border border-[#428177]/20 rounded-2xl space-y-1.5 text-xs">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-[#002623]">{q.id}. {q.question}</span>
                      {isCorrect ? (
                        <Badge className="bg-emerald-600/15 text-emerald-800 border-none text-[10px] gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          صحيحة
                        </Badge>
                      ) : (
                        <Badge className="bg-rose-600/15 text-rose-800 border-none text-[10px] gap-1">
                          <XCircle className="h-3 w-3" />
                          خاطئة
                        </Badge>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed pt-1 border-t border-[#EDEBE0]">
                      <span className="font-bold text-[#428177]">توضيح الحل: </span>
                      {q.explanation}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-2 pt-2 border-t border-[#EDEBE0]">
              <Button
                onClick={handleResetQuiz}
                variant="outline"
                className="flex-1 border-[#428177]/30 text-xs font-bold rounded-xl gap-1.5"
              >
                <RotateCcw className="h-4 w-4 text-[#428177]" />
                <span>إعادة الاختبار</span>
              </Button>
              <Button
                onClick={() => onOpenChange(false)}
                className="flex-1 bg-[#002623] hover:bg-[#054239] text-[#EDEBE0] text-xs font-bold rounded-xl shadow-md"
              >
                إغلاق والعودة للمحاضرة
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
