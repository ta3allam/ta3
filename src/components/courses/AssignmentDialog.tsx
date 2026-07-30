import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Assignment } from "@/pages/courses/types";

interface AssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingAssignment: Assignment | null;
  onSave: (data: { title: string; description: string; dueDate: string; file: File | null }) => void;
}

export default function AssignmentDialog({
  open,
  onOpenChange,
  editingAssignment,
  onSave,
}: AssignmentDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingAssignment) {
      setTitle(editingAssignment.title);
      setDescription(editingAssignment.description);
      try {
        setDueDate(new Date(editingAssignment.dueDate).toISOString().slice(0, 16));
      } catch (e) {
        setDueDate("");
      }
    } else {
      setTitle("");
      setDescription("");
      setDueDate("");
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [editingAssignment, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !dueDate) return;
    
    const file = fileInputRef.current?.files?.[0] || null;
    
    onSave({
      title,
      description,
      dueDate: new Date(dueDate).toISOString(),
      file,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="text-right max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-right">
            {editingAssignment ? "تعديل الواجب" : "إنشاء واجب جديد"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="assignment-title" className="block text-right">عنوان الواجب</Label>
            <Input
              id="assignment-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="text-right"
              placeholder="مثال: واجب البرمجة الأول"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="assignment-desc" className="block text-right">وصف الواجب</Label>
            <Textarea
              id="assignment-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="text-right"
              rows={4}
              placeholder="تعليمات وتفاصيل الواجب..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="assignment-due" className="block text-right">تاريخ الاستحقاق (تاريخ التسليم)</Label>
            <Input
              id="assignment-due"
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
              className="text-right"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="assignment-file" className="block text-right">
              ملف الواجب (PDF) - اختياري
            </Label>
            <Input
              id="assignment-file"
              type="file"
              accept=".pdf"
              ref={fileInputRef}
              className="text-right cursor-pointer"
            />
            {editingAssignment?.hasFile && (
              <p className="text-xs text-muted-foreground mt-1">
                الملف المرفق الحالي: {editingAssignment.fileName}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full">
            {editingAssignment ? "حفظ التغييرات" : "إنشاء الواجب"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
