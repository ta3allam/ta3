import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  FolderArchive,
  FileText,
  Code2,
  FileSpreadsheet,
  Download,
  Eye,
  Search,
  Filter,
  PackageCheck,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import MaterialViewerModal, { MaterialItem } from "@/components/courses/MaterialViewerModal";
import { toast } from "sonner";

export interface VaultResource {
  id: string;
  title: string;
  category: 'pdf' | 'code' | 'cheatsheet' | 'template';
  lectureNumber: number;
  lectureTitle: string;
  fileSize: string;
  fileUrl: string;
  downloadsCount: number;
  uploadedAt: string;
}

const DEFAULT_RESOURCES: VaultResource[] = [
  {
    id: "vr-1",
    title: "شرائح المحاضرة: أساسيات الأنظمة الموزعة وقواعد البيانات (PDF)",
    category: "pdf",
    lectureNumber: 1,
    lectureTitle: "مقدمة في البنى المعمارية الموزعة",
    fileSize: "4.8 MB",
    fileUrl: "https://example.com/slides-intro.pdf",
    downloadsCount: 142,
    uploadedAt: "منذ 3 أيام"
  },
  {
    id: "vr-2",
    title: "حزمة الكود المصدري الكامل لمشروع المتجر الإلكتروني (ZIP)",
    category: "code",
    lectureNumber: 2,
    lectureTitle: "بناء واجهات المتجر وإدارة الحالة",
    fileSize: "12.4 MB",
    fileUrl: "https://example.com/ecommerce-code.zip",
    downloadsCount: 288,
    uploadedAt: "منذ يومين"
  },
  {
    id: "vr-3",
    title: "ورقة الغش السريعة (Cheat Sheet): أهم أوامر وإعدادات Tailwind CSS & RTL",
    category: "cheatsheet",
    lectureNumber: 2,
    lectureTitle: "التصميم التفاعلي المتوافق مع العربية",
    fileSize: "1.2 MB",
    fileUrl: "https://example.com/tailwind-rtl-cheatsheet.pdf",
    downloadsCount: 310,
    uploadedAt: "منذ أسبوع"
  },
  {
    id: "vr-4",
    title: "قالب جاهز لتهيئة PostgreSQL و RLS Policies في الإنتاج (SQL)",
    category: "template",
    lectureNumber: 3,
    lectureTitle: "تأمين البيانات وعزل صلاحيات المستخدمين",
    fileSize: "850 KB",
    fileUrl: "https://example.com/postgres-rls-template.sql",
    downloadsCount: 95,
    uploadedAt: "منذ يوم"
  }
];

export function ResourceVault({
  courseTitle = "المقرر التعليمي",
  resources = DEFAULT_RESOURCES
}: {
  courseTitle?: string;
  resources?: VaultResource[];
}) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewingMaterial, setViewingMaterial] = useState<MaterialItem | null>(null);

  const filtered = resources.filter(res => {
    if (activeCategory !== "all" && res.category !== activeCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = res.title.toLowerCase().includes(q);
      const matchLecture = res.lectureTitle.toLowerCase().includes(q);
      if (!matchTitle && !matchLecture) return false;
    }
    return true;
  });

  const handleDownloadAll = () => {
    toast.success("جاري تجميع وضغط كافة ملفات المقرر في حزمة ZIP واحدة للتحميل...");
  };

  const handleDownloadSingle = (res: VaultResource) => {
    toast.success(`جاري تحميل الملف: ${res.title}`);
  };

  const handlePreview = (res: VaultResource) => {
    setViewingMaterial({
      id: res.id,
      name: res.title,
      type: res.category === 'pdf' || res.category === 'cheatsheet' ? 'pdf' : 'other',
      url: res.fileUrl,
      size: res.fileSize
    });
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white border border-[#428177]/30 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-[#428177]/15 text-[#054239] border-none font-bold text-xs">
              خزنة المواد والموارد المفتوحة 🗄️
            </Badge>
            <span className="text-xs text-muted-foreground">• {resources.length} ملف متوفر</span>
          </div>
          <h3 className="text-xl font-extrabold text-[#002623]">خزنة الملفات والشرائح المرفقة لـ {courseTitle}</h3>
          <p className="text-xs text-[#3D3A3B] mt-1">
            تصفح وحمّل ملفات الشرح، أوراق التلخيص السريع، وأكواد المشاريع البرمجية.
          </p>
        </div>

        <Button
          onClick={handleDownloadAll}
          className="bg-[#428177] hover:bg-[#054239] text-white font-bold text-xs h-9 rounded-xl gap-1.5 shadow-sm"
        >
          <FolderArchive className="h-4 w-4" />
          <span>تحميل كافة الموارد (ZIP)</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#428177]/20 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="ابحث في أسماء الملفات أو الدروس..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-9 text-xs border-none bg-[#EDEBE0]/30 focus-visible:ring-1 focus-visible:ring-[#428177]"
          />
        </div>

        <div className="flex items-center gap-1 bg-[#EDEBE0]/40 p-1 rounded-xl flex-wrap">
          {[
            { id: "all", label: "الكل" },
            { id: "pdf", label: "📄 شرائح PDF" },
            { id: "code", label: "💻 أكواد ZIP" },
            { id: "cheatsheet", label: "⚡ ملخصات" },
            { id: "template", label: "📐 قوالب SQL" }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeCategory === cat.id
                  ? "bg-[#428177] text-white shadow-xs"
                  : "text-[#3D3A3B] hover:text-[#002623]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Cards Grid */}
      {filtered.length === 0 ? (
        <Card className="p-8 text-center bg-white border border-[#428177]/20 rounded-2xl">
          <p className="text-sm font-bold text-muted-foreground">لا توجد ملفات مطابقة لبحثك في الخزنة.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(res => (
            <Card
              key={res.id}
              className="border border-[#428177]/25 bg-white shadow-xs rounded-2xl overflow-hidden hover:border-[#428177] hover:shadow-md transition-all text-right"
            >
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[#428177]/10 text-[#428177]">
                      {res.category === 'code' ? (
                        <Code2 className="h-5 w-5" />
                      ) : res.category === 'template' ? (
                        <FileSpreadsheet className="h-5 w-5" />
                      ) : (
                        <FileText className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-[#002623] leading-snug line-clamp-2">{res.title}</h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        المحاضرة {res.lectureNumber}: {res.lectureTitle}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#EDEBE0] text-[11px] text-[#3D3A3B] font-medium">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-[#988561]/40 text-[#002623] text-[10px] font-bold">
                      {res.fileSize}
                    </Badge>
                    <span>{res.downloadsCount} تنزيل</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePreview(res)}
                      className="h-7 text-xs font-bold border-[#428177]/30 text-[#002623] hover:bg-[#428177]/10 gap-1 rounded-xl"
                    >
                      <Eye className="h-3.5 w-3.5 text-[#428177]" />
                      معاينة
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => handleDownloadSingle(res)}
                      className="h-7 text-xs font-bold bg-[#428177] hover:bg-[#054239] text-white gap-1 rounded-xl"
                    >
                      <Download className="h-3.5 w-3.5" />
                      تحميل
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <MaterialViewerModal
        open={!!viewingMaterial}
        onOpenChange={(open) => !open && setViewingMaterial(null)}
        material={viewingMaterial}
      />
    </div>
  );
}
