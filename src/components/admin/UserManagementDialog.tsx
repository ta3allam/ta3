import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus } from "lucide-react";

interface UserManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (user: { name: string; role: string; username: string }) => void;
}

export default function UserManagementDialog({ open, onOpenChange, onSave }: UserManagementDialogProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("طالب");
  const [username, setUsername] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !username.trim()) return;

    onSave({
      name: name.trim(),
      role,
      username: username.trim().toLowerCase(),
    });

    setName("");
    setRole("طالب");
    setUsername("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="text-right max-w-md">
        <DialogHeader>
          <DialogTitle className="text-right flex items-center gap-2 justify-end">
            <span>إضافة مستخدم جديد</span>
            <UserPlus className="h-5 w-5 text-primary" />
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="user-name" className="text-xs font-semibold text-foreground/80 block">الاسم الكامل</Label>
            <Input
              id="user-name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-right focus-visible:ring-primary/50"
              placeholder="مثال: يوسف أحمد"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="username" className="text-xs font-semibold text-foreground/80 block">اسم المستخدم (لتسجيل الدخول)</Label>
            <Input
              id="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="text-right focus-visible:ring-primary/50"
              placeholder="مثال: youssef_ahmed"
            />
          </div>

          <div className="space-y-1.5 text-right" dir="rtl">
            <Label className="text-xs font-semibold text-foreground/80 block mb-1">دور المستخدم</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="text-right w-full">
                <SelectValue placeholder="اختر دور المستخدم" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="طالب">طالب (Student)</SelectItem>
                <SelectItem value="معلم">معلم (Teacher)</SelectItem>
                <SelectItem value="مشرف">مسؤول (Admin)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit" className="flex-1 font-bold">
              إضافة المستخدم
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-24 font-bold"
            >
              إلغاء
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
