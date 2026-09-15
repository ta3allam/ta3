import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Video, File, Download, Edit, Trash2, Eye, PlayCircle, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import MaterialViewerModal, { MaterialItem } from "@/components/courses/MaterialViewerModal";

interface LectureMaterial {
  id: number;
  title: string;
  file_url: string;
  file_type: 'pdf' | 'video' | 'document' | 'other';
  file_size?: number;
}

interface Lecture {
  id: number;
  title: string;
  description?: string;
  materials: LectureMaterial[];
}

interface LectureDetailProps {
  lecture: Lecture | null;
  isTeacher?: boolean;
  onEdit?: (lecture: Lecture) => void;
  onDelete?: (lectureId: number) => void;
}

const fileTypeIcons = {
  pdf: FileText,
  video: Video,
  document: File,
  other: File
};

export function LectureDetail({ lecture, isTeacher = false, onEdit, onDelete }: LectureDetailProps) {
  const [viewingMaterial, setViewingMaterial] = useState<MaterialItem | null>(null);

  if (!lecture) {
    return (
      <div className="flex flex-col items-center justify-center h-72 bg-white rounded-2xl border border-dashed border-[#428177]/30 text-muted-foreground p-8 space-y-2 text-right" dir="rtl">
        <BookOpen className="h-10 w-10 text-[#428177]/40 mb-2" />
        <p className="font-bold text-sm text-[#002623]">اختر محاضرة من القائمة الجانبية لعرض تفاصيلها وموادها</p>
        <span className="text-xs text-muted-foreground">يمكنك تصفح الشرائح، الفيديوهات المسجلة، والملفات المرفقة لكل درس.</span>
      </div>
    );
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const handleOpenPreview = (material: LectureMaterial) => {
    setViewingMaterial({
      id: material.id,
      name: material.title,
      type: material.file_type,
      url: material.file_url,
      size: formatFileSize(material.file_size)
    });
  };

  return (
    <Card className="border border-[#428177]/25 bg-white shadow-sm rounded-2xl overflow-hidden text-right" dir="rtl">
      <CardHeader className="p-5 pb-3 border-b border-[#EDEBE0]">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-xl font-extrabold text-[#002623]">{lecture.title}</CardTitle>
          <div className="flex gap-2">
            {isTeacher && onEdit && (
              <Button size="sm" variant="outline" onClick={() => onEdit(lecture)} className="border-[#428177]/40 text-[#002623] hover:bg-[#428177]/10 font-bold text-xs h-8">
                <Edit className="h-3.5 w-3.5 ml-1.5 text-[#428177]" />
                تعديل المحاضرة
              </Button>
            )}
            {isTeacher && onDelete && (
              <Button size="sm" variant="destructive" onClick={() => onDelete(lecture.id)} className="font-bold text-xs h-8 bg-rose-600 hover:bg-rose-700">
                <Trash2 className="h-3.5 w-3.5 ml-1.5" />
                حذف
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {lecture.description && (
          <div className="text-right space-y-2 bg-[#EDEBE0]/30 p-4 rounded-xl border border-[#428177]/15">
            <h4 className="font-extrabold text-xs text-[#002623] flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-[#428177]" />
              ملخص وأهداف المحاضرة
            </h4>
            <p className="text-xs text-[#3D3A3B] leading-relaxed whitespace-pre-wrap font-medium">{lecture.description}</p>
          </div>
        )}

        <div>
          <h4 className="font-extrabold text-sm text-[#002623] mb-3 flex items-center gap-1.5">
            <FileText className="h-4 w-4 text-[#428177]" />
            المواد التعليمية والملحقات ({lecture.materials.length})
          </h4>
          {lecture.materials.length > 0 ? (
            <div className="grid gap-3">
              {lecture.materials.map((material) => {
                const Icon = fileTypeIcons[material.file_type];
                return (
                  <div
                    key={material.id}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-[#428177]/20 bg-white hover:border-[#428177]/50 hover:shadow-xs transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-[#428177]/10 text-[#428177]">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="text-right">
                        <p className="font-extrabold text-xs text-[#002623]">{material.title}</p>
                        {material.file_size && (
                          <p className="text-[10px] text-muted-foreground font-medium">
                            {formatFileSize(material.file_size)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenPreview(material)}
                        className="h-8 text-xs font-bold border-[#428177]/30 text-[#002623] hover:bg-[#428177]/10 gap-1 rounded-lg"
                      >
                        <Eye className="h-3.5 w-3.5 text-[#428177]" />
                        معاينة
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        asChild
                        className="h-8 px-2 text-[#428177] hover:bg-[#428177]/10 rounded-lg"
                      >
                        <a href={material.file_url} download target="_blank" rel="noreferrer">
                          <Download className="h-3.5 w-3.5" />
                        </a>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-xs text-muted-foreground py-8 bg-[#EDEBE0]/20 rounded-xl border border-dashed border-[#EDEBE0]">
              لا توجد مواد تعليمية مرفقة بهذه المحاضرة
            </div>
          )}
        </div>
      </CardContent>

      <MaterialViewerModal
        open={!!viewingMaterial}
        onOpenChange={(open) => !open && setViewingMaterial(null)}
        material={viewingMaterial}
      />
    </Card>
  );
}
