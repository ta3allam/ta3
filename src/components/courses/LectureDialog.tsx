import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Lecture } from "@/pages/courses/types";

interface LectureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingLecture: Lecture | null;
  onSave: (data: { title: string; description: string }) => void;
}

export default function LectureDialog({
  open,
  onOpenChange,
  editingLecture,
  onSave,
}: LectureDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (editingLecture) {
      setTitle(editingLecture.title);
      setDescription(editingLecture.description || "");
    } else {
      setTitle("");
      setDescription("");
    }
  }, [editingLecture, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title, description });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="text-right max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-right">
            {editingLecture ? "تعديل المحاضرة" : "محاضرة جديدة"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="lecture-title" className="block text-right">العنوان</Label>
            <Input
              id="lecture-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="text-right"
              placeholder="عنوان المحاضرة"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lecture-desc" className="block text-right">الوصف</Label>
            <Textarea
              id="lecture-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-right"
              rows={4}
              placeholder="وصف المحاضرة (يمكنك إضافة روابط هنا)..."
            />
          </div>
          <Button type="submit" className="w-full">
            {editingLecture ? "حفظ التغييرات" : "إنشاء المحاضرة"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
