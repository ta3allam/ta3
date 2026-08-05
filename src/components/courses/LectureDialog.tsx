import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Lecture } from "@/pages/courses/types";
import { Link2, FileText } from "lucide-react";

interface LectureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingLecture: Lecture | null;
  onSave: (data: { title: string; description: string; materialUrl?: string; materialTitle?: string }) => void;
}

export default function LectureDialog({
  open,
  onOpenChange,
  editingLecture,
  onSave,
}: LectureDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [materialTitle, setMaterialTitle] = useState("");
  const [materialUrl, setMaterialUrl] = useState("");

  useEffect(() => {
    if (editingLecture) {
      setTitle(editingLecture.title);
      setDescription(editingLecture.description || "");
      if (editingLecture.materials && editingLecture.materials.length > 0) {
        setMaterialTitle(editingLecture.materials[0].title);
        setMaterialUrl(editingLecture.materials[0].file_url);
      } else {
        setMaterialTitle("");
        setMaterialUrl("");
      }
    } else {
      setTitle("");
      setDescription("");
      setMaterialTitle("");
      setMaterialUrl("");
    }
  }, [editingLecture, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      description: description.trim(),
      materialTitle: materialTitle.trim() || undefined,
      materialUrl: materialUrl.trim() || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="text-right max-w-2xl bg-white border border-[#428177]/40 rounded-2xl">
        <DialogHeader className="border-b border-[#EDEBE0] pb-3">
          <DialogTitle className="text-right font-bold text-lg text-[#002623]">
            {editingLecture ? "تعديل المحاضرة والمواد التعليمية" : "إضافة محاضرة دراسية جديدة"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="lecture-title" className="block text-right font-bold text-xs text-[#002623]">عنوان المحاضرة</Label>
            <Input
              id="lecture-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="text-right bg-white border-[#428177]/30 text-[#002623]"
              placeholder="مثال: الأسبوع الأول - مقدمة في لغة C++"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lecture-desc" className="block text-right font-bold text-xs text-[#002623]">وصف الشرح والمحاور</Label>
            <Textarea
              id="lecture-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-right text-xs bg-white border-[#428177]/30 text-[#002623]"
              rows={3}
              placeholder="أدخل ملخص الشرح وتوجيهات المحاضرة..."
            />
          </div>

          <div className="p-4 bg-[#EDEBE0]/40 rounded-xl border border-[#428177]/20 space-y-3">
            <span className="text-xs font-bold text-[#002623] block">المرفقات والروابط التعليمية (اختياري)</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-[11px] font-bold text-[#3D3A3B] flex items-center justify-end gap-1">
                  <FileText className="w-3.5 h-3.5 text-[#428177]" />
                  اسم ملف PDF / الرابط
                </Label>
                <Input
                  value={materialTitle}
                  onChange={(e) => setMaterialTitle(e.target.value)}
                  className="text-right text-xs bg-white border-[#428177]/30 text-[#002623]"
                  placeholder="مثال: سلايدات_المحاضرة.pdf"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] font-bold text-[#3D3A3B] flex items-center justify-end gap-1">
                  <Link2 className="w-3.5 h-3.5 text-[#428177]" />
                  رابط المستند أو القراءة
                </Label>
                <Input
                  value={materialUrl}
                  onChange={(e) => setMaterialUrl(e.target.value)}
                  className="text-right text-xs bg-white border-[#428177]/30 text-[#002623]"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full font-bold bg-[#428177] hover:bg-[#054239] text-white">
            {editingLecture ? "حفظ التعديلات" : "إضافة المحاضرة والمرفقات"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
