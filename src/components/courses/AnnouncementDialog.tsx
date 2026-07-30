import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Announcement } from "@/pages/courses/types";

interface AnnouncementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingAnnouncement: Announcement | null;
  onSave: (data: { title: string; content: string }) => void;
}

export default function AnnouncementDialog({
  open,
  onOpenChange,
  editingAnnouncement,
  onSave,
}: AnnouncementDialogProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (editingAnnouncement) {
      setTitle(editingAnnouncement.title);
      setContent(editingAnnouncement.content);
    } else {
      setTitle("");
      setContent("");
    }
  }, [editingAnnouncement, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onSave({ title, content });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="text-right">
        <DialogHeader>
          <DialogTitle className="text-right">
            {editingAnnouncement ? "تعديل الإعلان" : "إعلان جديد"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="block text-right">العنوان</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="text-right"
              placeholder="عنوان الإعلان"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content" className="block text-right">المحتوى</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="text-right"
              rows={4}
              placeholder="نص الإعلان هنا..."
            />
          </div>
          <Button type="submit" className="w-full">
            {editingAnnouncement ? "حفظ التغييرات" : "نشر الإعلان"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
