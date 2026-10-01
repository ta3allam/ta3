import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCourseData } from "@/contexts/CourseContext";
import { PricingType } from "@/types/pricing";
import {
  BookPlus,
  Layers,
  Sparkles,
  Plus,
  Trash2,
  DollarSign,
  GraduationCap
} from "lucide-react";
import { toast } from "sonner";

interface CreatorCourseBuilderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTeacherName?: string;
  onCourseCreated?: (courseCode: string) => void;
}

interface TempLecture {
  title: string;
  description: string;
}

export function CreatorCourseBuilderModal({
  open,
  onOpenChange,
  defaultTeacherName = "أ. محمد المحمد",
  onCourseCreated,
}: CreatorCourseBuilderModalProps) {
  const { addCourse } = useCourseData();

  const [courseName, setCourseName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [category, setCategory] = useState("علوم الحاسوب والبرمجة");
  const [difficulty, setDifficulty] = useState("متوسط");
  const [teacherName, setTeacherName] = useState(defaultTeacherName);
  const [pricingType, setPricingType] = useState<PricingType>("paid_one_time");
  const [priceAmount, setPriceAmount] = useState("29");
  const [currency, setCurrency] = useState("USD");
  const [lectures, setLectures] = useState<TempLecture[]>([
    {
      title: "المحاضرة 1: مقدمة عامة وخارطة الطريق",
      description: "مدخل للمفاهيم الأساسية، تثبيت بيئة العمل، والأهداف التدريبية.",
    },
    {
      title: "المحاضرة 2: التطبيق العملي وبناء المشروع الأول",
      description: "خطوة بخطوة لبناء أول نموذج تجريبي وحل المشكلات الشائعة.",
    },
  ]);

  const handleAddLecture = () => {
    setLectures((prev) => [
      ...prev,
      {
        title: `المحاضرة ${prev.length + 1}: موضوع جديد`,
        description: "شرح تفصيلي ومصادر برمجية مرفقة.",
      },
    ]);
  };

  const handleUpdateLecture = (index: number, field: keyof TempLecture, val: string) => {
    setLectures((prev) =>
      prev.map((lec, i) => (i === index ? { ...lec, [field]: val } : lec))
    );
  };

  const handleRemoveLecture = (index: number) => {
    if (lectures.length <= 1) {
      toast.warning("يجب أن تحتوي الدورة على محاضرة واحدة على الأقل.");
      return;
    }
    setLectures((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!courseName.trim()) {
      toast.error("يرجى إدخال اسم الدورة.");
      return;
    }

    const generatedCode =
      courseCode.trim() ||
      `CS-${Math.floor(100 + Math.random() * 900)}`;

    const priceCents =
      pricingType === "free" ? 0 : Math.round(parseFloat(priceAmount || "0") * 100);

    addCourse({
      name: courseName.trim(),
      code: generatedCode,
      category,
      difficulty,
      teacher: teacherName.trim(),
      pricingType,
      priceCents,
      currency,
      lectures: lectures.map((l) => ({
        title: l.title.trim(),
        description: l.description.trim(),
        materials: [],
      })),
    });

    toast.success("تم إنشاء ونشر الدورة بنجاح في سوق تعلّم! 🚀", {
      description: `كود الدورة: ${generatedCode} — متاحة الآن للطلاب.`,
    });

    onCourseCreated?.(generatedCode);
    onOpenChange(false);

    // Reset form
    setCourseName("");
    setCourseCode("");
    setPriceAmount("29");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 rounded-3xl border border-[#428177]/30 bg-white"
        dir="rtl"
      >
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="bg-[#002623] text-[#EDEBE0] p-6 rounded-t-3xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-[#428177] text-white text-xs font-black inline-flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                <span>استوديو صنّاع المحتوى والمعلمين</span>
              </span>
            </div>
            <DialogHeader className="text-right">
              <DialogTitle className="text-2xl font-black text-white">
                إنشاء ونشر دورة جديدة في سوق تعلّم 🎓
              </DialogTitle>
              <p className="text-xs text-[#EDEBE0]/70">
                حدد بيانات الدورة، نموذج التسعير والاشتراك، ومخطط المنهج والمحاضرات ليتم إتاحتها للطلاب فوراً.
              </p>
            </DialogHeader>
          </div>

          {/* Form Body */}
          <div className="p-6 space-y-6">
            {/* 1. Basic Info Section */}
            <div className="space-y-4">
              <h4 className="text-sm font-black text-[#002623] flex items-center gap-2 border-b border-[#EDEBE0] pb-2">
                <BookPlus className="h-4 w-4 text-[#428177]" />
                <span>1. البيانات الأساسية للدورة</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 md:col-span-2">
                  <Label className="text-xs font-bold text-[#002623]">
                    اسم الدورة / العنوان التدريبي <span className="text-rose-600">*</span>
                  </Label>
                  <Input
                    placeholder="مثال: هندسة الواجهات التفاعلية الحديثة بـ React & Next.js"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    className="text-right text-xs rounded-xl border-[#428177]/30"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#002623]">
                    رمز الدورة (الكود)
                  </Label>
                  <Input
                    placeholder="مثال: CS-402 (أو اتركه لإنشاء تلقائي)"
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    className="text-right text-xs rounded-xl border-[#428177]/30 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#002623]">
                    اسم المدرب / صانع المحتوى
                  </Label>
                  <Input
                    placeholder="اسمك كمعلم أو صانع محتوى"
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    className="text-right text-xs rounded-xl border-[#428177]/30"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#002623]">
                    التصنيف والمجال
                  </Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="text-right text-xs rounded-xl border-[#428177]/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent dir="rtl">
                      <SelectItem value="علوم الحاسوب والبرمجة">علوم الحاسوب والبرمجة</SelectItem>
                      <SelectItem value="الذكاء الاصطناعي وتعلم الآلة">الذكاء الاصطناعي وتعلم الآلة</SelectItem>
                      <SelectItem value="تطوير تطبيقات الهواتف">تطوير تطبيقات الهواتف</SelectItem>
                      <SelectItem value="إدارة الأعمال والتسويق">إدارة الأعمال والتسويق</SelectItem>
                      <SelectItem value="الرياضيات والهندسة">الرياضيات والهندسة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#002623]">
                    المستوى المستهدف
                  </Label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger className="text-right text-xs rounded-xl border-[#428177]/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent dir="rtl">
                      <SelectItem value="مبتدئ">مبتدئ</SelectItem>
                      <SelectItem value="متوسط">متوسط</SelectItem>
                      <SelectItem value="متقدم">متقدم</SelectItem>
                      <SelectItem value="كافة المستويات">كافة المستويات</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* 2. Pricing Configuration Section */}
            <div className="space-y-4">
              <h4 className="text-sm font-black text-[#002623] flex items-center gap-2 border-b border-[#EDEBE0] pb-2">
                <DollarSign className="h-4 w-4 text-[#428177]" />
                <span>2. خطة التسعير والاشتراك</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#002623]">
                    نوع التسعير
                  </Label>
                  <Select
                    value={pricingType}
                    onValueChange={(val) => setPricingType(val as PricingType)}
                  >
                    <SelectTrigger className="text-right text-xs rounded-xl border-[#428177]/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent dir="rtl">
                      <SelectItem value="paid_one_time">دفع لمرة واحدة (مدى الحياة)</SelectItem>
                      <SelectItem value="subscription">اشتراك شهري متجدد</SelectItem>
                      <SelectItem value="free">مجانية بالكامل</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {pricingType !== "free" && (
                  <>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-[#002623]">
                        السعر
                      </Label>
                      <Input
                        type="number"
                        min="1"
                        step="0.5"
                        placeholder="29"
                        value={priceAmount}
                        onChange={(e) => setPriceAmount(e.target.value)}
                        className="text-right text-xs rounded-xl border-[#428177]/30 font-bold"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-[#002623]">
                        العملة
                      </Label>
                      <Select value={currency} onValueChange={setCurrency}>
                        <SelectTrigger className="text-right text-xs rounded-xl border-[#428177]/30 font-bold">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent dir="rtl">
                          <SelectItem value="USD">USD ($ - دولار)</SelectItem>
                          <SelectItem value="SYP">SYP (ل.س - ليرة سورية)</SelectItem>
                          <SelectItem value="AED">AED (د.إ - درهم إماراتي)</SelectItem>
                          <SelectItem value="SAR">SAR (ر.س - ريال سعودي)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* 3. Syllabus & Lectures Outline */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#EDEBE0] pb-2">
                <h4 className="text-sm font-black text-[#002623] flex items-center gap-2">
                  <Layers className="h-4 w-4 text-[#428177]" />
                  <span>3. مخطط المنهج والمحاضرات ({lectures.length})</span>
                </h4>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddLecture}
                  className="border-[#428177]/30 text-[#002623] hover:bg-[#428177]/10 font-bold text-xs gap-1 rounded-xl h-8"
                >
                  <Plus className="h-3.5 w-3.5 text-[#428177]" />
                  <span>إضافة محاضرة</span>
                </Button>
              </div>

              <div className="space-y-3">
                {lectures.map((lec, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl border border-[#428177]/20 bg-[#EDEBE0]/20 space-y-2 relative"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="h-6 w-6 rounded-full bg-[#002623] text-[#EDEBE0] text-xs font-black flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <Input
                          value={lec.title}
                          onChange={(e) =>
                            handleUpdateLecture(idx, "title", e.target.value)
                          }
                          placeholder={`عنوان المحاضرة ${idx + 1}`}
                          className="text-right text-xs rounded-xl border-[#428177]/30 bg-white font-bold h-8"
                        />
                      </div>

                      {lectures.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveLecture(idx)}
                          className="text-rose-600 hover:text-rose-800 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                          title="حذف المحاضرة"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <Textarea
                      value={lec.description}
                      onChange={(e) =>
                        handleUpdateLecture(idx, "description", e.target.value)
                      }
                      placeholder="وصف مختصر لمحتوى المحاضرة والمهام..."
                      className="text-right text-xs rounded-xl border-[#428177]/30 bg-white min-h-[55px] resize-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <DialogFooter className="p-6 bg-[#EDEBE0]/30 border-t border-[#428177]/15 flex flex-col sm:flex-row items-center justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto border-[#428177]/30 text-[#002623] font-bold text-xs rounded-xl"
            >
              إلغاء
            </Button>

            <Button
              type="submit"
              className="w-full sm:w-auto bg-[#428177] hover:bg-[#054239] text-white font-black text-xs gap-2 rounded-xl shadow-md px-6"
            >
              <GraduationCap className="h-4 w-4" />
              <span>نشر الدورة فوراً في السوق 🚀</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
