import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CourseEvent, EventType } from "@/pages/courses/types";

interface EventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingEvent: CourseEvent | null;
  onSave: (data: { title: string; description: string; event_type: EventType; due_date: string }) => void;
}

export default function EventDialog({
  open,
  onOpenChange,
  editingEvent,
  onSave,
}: EventDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventType, setEventType] = useState<EventType>("assignment");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (editingEvent) {
      setTitle(editingEvent.title);
      setDescription(editingEvent.description || "");
      setEventType(editingEvent.event_type);
      try {
        setDueDate(new Date(editingEvent.due_date).toISOString().slice(0, 16));
      } catch (e) {
        setDueDate("");
      }
    } else {
      setTitle("");
      setDescription("");
      setEventType("assignment");
      setDueDate("");
    }
  }, [editingEvent, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;
    onSave({
      title,
      description,
      event_type: eventType,
      due_date: new Date(dueDate).toISOString(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="text-right">
        <DialogHeader>
          <DialogTitle className="text-right">
            {editingEvent ? "تعديل الحدث" : "حدث جديد"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="event-title" className="block text-right">العنوان</Label>
            <Input
              id="event-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="text-right"
              placeholder="عنوان الحدث"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="event-description" className="block text-right">الوصف</Label>
            <Textarea
              id="event-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-right"
              rows={3}
              placeholder="وصف الحدث هنا..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="event-type" className="block text-right">النوع</Label>
            <Select
              value={eventType}
              onValueChange={(val) => setEventType(val as EventType)}
            >
              <SelectTrigger className="text-right">
                <SelectValue placeholder="اختر النوع" />
              </SelectTrigger>
              <SelectContent dir="rtl">
                <SelectItem value="assignment">واجب</SelectItem>
                <SelectItem value="quiz">اختبار قصير</SelectItem>
                <SelectItem value="exam">امتحان</SelectItem>
                <SelectItem value="other">أخرى</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="due-date" className="block text-right">تاريخ الاستحقاق</Label>
            <Input
              id="due-date"
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
              className="text-right"
            />
          </div>
          <Button type="submit" className="w-full">
            {editingEvent ? "حفظ التغييرات" : "إنشاء الحدث"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
