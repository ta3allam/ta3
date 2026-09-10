import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldCheck, UserCheck, Lock, Unlock, Search, Sparkles, Trash2, UserPlus } from "lucide-react";
import { toast } from "sonner";

export interface UserItem {
  id: number | string;
  name: string;
  role: string;
  username: string;
  email?: string;
  status?: 'active' | 'suspended' | 'locked';
}

interface UserManagementTableProps {
  users?: UserItem[];
  onAddUser?: (user: { name: string; username: string; role: string }) => void;
  onDeleteUser?: (id: number) => void;
  onRoleChange?: (userId: string | number, newRole: string) => void;
  onStatusToggle?: (userId: string | number, newStatus: string) => void;
}

export function UserManagementTable({
  users: initialUsers,
  onAddUser,
  onDeleteUser,
  onRoleChange,
  onStatusToggle
}: UserManagementTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newRole, setNewRole] = useState("طالب");

  const defaultUsers: UserItem[] = [
    {
      id: 1,
      name: "د. طارق المشرف",
      username: "tariq.admin",
      email: "tariq.admin@ta3allam.app",
      role: "مدير",
      status: "active"
    },
    {
      id: 2,
      name: "د. خالد صانع المحتوى",
      username: "khaled.creator",
      email: "khaled.creator@ta3allam.app",
      role: "معلم",
      status: "active"
    },
    {
      id: 3,
      name: "سارة العلي",
      username: "sara.student",
      email: "sara.ali@student.ta3allam.app",
      role: "طالب",
      status: "active"
    },
    {
      id: 4,
      name: "أحمد النجار",
      username: "ahmed.student",
      email: "ahmed.najjar@student.ta3allam.app",
      role: "طالب",
      status: "suspended"
    }
  ];

  const [localUsers, setLocalUsers] = useState<UserItem[]>(initialUsers || defaultUsers);

  const displayUsers = initialUsers || localUsers;

  const handlePromoteRole = (userId: string | number, nextRole: string) => {
    setLocalUsers(prev => prev.map(u => u.id === userId ? { ...u, role: nextRole } : u));
    toast.success(`تم تحديث صلاحية المستخدم بنجاح إلى: ${nextRole}`);
    onRoleChange?.(userId, nextRole);
  };

  const handleToggleStatus = (userId: string | number, currentStatus?: string) => {
    const nextStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
    setLocalUsers(prev => prev.map(u => u.id === userId ? { ...u, status: nextStatus } : u));
    toast.info(`تم تغيير حالة الحساب إلى: ${nextStatus === 'active' ? 'نشط' : 'معلّق'}`);
    onStatusToggle?.(userId, nextStatus);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newUsername.trim()) return;

    if (onAddUser) {
      onAddUser({ name: newName, username: newUsername, role: newRole });
    } else {
      setLocalUsers(prev => [
        ...prev,
        { id: Date.now(), name: newName, username: newUsername, role: newRole, status: 'active' }
      ]);
      toast.success('تمت إضافة المستخدم بنجاح');
    }

    setNewName("");
    setNewUsername("");
    setIsAddOpen(false);
  };

  const filteredUsers = displayUsers.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          u.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-4 text-right" dir="rtl">
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="بحث بالاسم أو اسم المستخدم..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-9 text-xs border-[#428177]/40"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="text-xs h-9 border-[#428177]/40 font-bold">
              <SelectValue placeholder="تصفية حسب الدور" />
            </SelectTrigger>
            <SelectContent dir="rtl">
              <SelectItem value="all">جميع الأدوار</SelectItem>
              <SelectItem value="مدير">مشرف منصة (مدير)</SelectItem>
              <SelectItem value="معلم">صانع محتوى (معلم)</SelectItem>
              <SelectItem value="طالب">طالب</SelectItem>
            </SelectContent>
          </Select>

          <Button
            size="sm"
            onClick={() => setIsAddOpen(prev => !prev)}
            className="bg-[#428177] hover:bg-[#054239] text-white font-bold text-xs gap-1.5 h-9"
          >
            <UserPlus className="h-4 w-4" />
            إضافة مستخدم
          </Button>
        </div>
      </div>

      {/* Add User Form Drawer */}
      {isAddOpen && (
        <form onSubmit={handleAddSubmit} className="p-4 bg-[#EDEBE0]/30 border border-[#428177]/30 rounded-2xl space-y-3">
          <h4 className="font-bold text-xs text-[#002623]">إضافة مستخدم جديد للنظام</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              placeholder="الاسم الكامل"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="text-xs border-[#428177]/40 bg-white"
              required
            />
            <Input
              placeholder="اسم المستخدم (Username)"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="text-xs border-[#428177]/40 bg-white"
              required
            />
            <Select value={newRole} onValueChange={setNewRole}>
              <SelectTrigger className="text-xs h-9 border-[#428177]/40 bg-white font-bold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent dir="rtl">
                <SelectItem value="طالب">طالب</SelectItem>
                <SelectItem value="معلم">صانع محتوى / معلم</SelectItem>
                <SelectItem value="مدير">مشرف عام</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="submit" size="sm" className="bg-[#428177] text-white text-xs font-bold">
              حفظ واعتماد
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setIsAddOpen(false)} className="text-xs">
              إلغاء
            </Button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="border border-[#428177]/30 rounded-2xl overflow-hidden bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-[#EDEBE0]/40">
            <TableRow>
              <TableHead className="text-right text-xs font-extrabold text-[#002623]">المستخدم</TableHead>
              <TableHead className="text-right text-xs font-extrabold text-[#002623]">الدور الحالي</TableHead>
              <TableHead className="text-right text-xs font-extrabold text-[#002623]">حالة الحساب</TableHead>
              <TableHead className="text-center text-xs font-extrabold text-[#002623]">الإجراءات الإدارية</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map(user => (
              <TableRow key={user.id} className="hover:bg-[#EDEBE0]/20 text-xs">
                <TableCell className="font-bold">
                  <div className="space-y-0.5">
                    <span className="text-[#002623] block">{user.name}</span>
                    <span className="text-muted-foreground text-[11px] block">@{user.username}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {user.role === 'مدير' && (
                    <Badge className="bg-[#6B1F2A] text-white text-[10px] gap-1 font-bold">
                      <ShieldCheck className="h-3 w-3" />
                      مشرف عام
                    </Badge>
                  )}
                  {user.role === 'معلم' && (
                    <Badge className="bg-[#054239] text-white text-[10px] gap-1 font-bold">
                      <Sparkles className="h-3 w-3" />
                      صانع محتوى
                    </Badge>
                  )}
                  {user.role === 'طالب' && (
                    <Badge variant="outline" className="border-[#428177]/40 text-[#428177] text-[10px] font-bold">
                      طالب
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {user.status !== 'suspended' ? (
                    <span className="text-emerald-700 font-bold inline-flex items-center gap-1 text-[11px]">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
                      نشط
                    </span>
                  ) : (
                    <span className="text-rose-700 font-bold inline-flex items-center gap-1 text-[11px]">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-600"></span>
                      معلّق
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    {user.role === 'طالب' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePromoteRole(user.id, 'معلم')}
                        className="border-[#428177]/40 text-[#054239] hover:bg-[#428177]/10 h-7 text-[11px] font-bold gap-1"
                      >
                        <UserCheck className="h-3 w-3" />
                        ترقية لصانع محتوى
                      </Button>
                    )}
                    {user.role === 'معلم' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePromoteRole(user.id, 'طالب')}
                        className="border-muted text-muted-foreground hover:bg-muted/40 h-7 text-[11px] font-bold gap-1"
                      >
                        تنزيل لطالب
                      </Button>
                    )}
                    {user.role !== 'مدير' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleToggleStatus(user.id, user.status)}
                        className={`h-7 px-2 text-[11px] font-bold ${
                          user.status !== 'suspended' ? "text-rose-600 hover:text-rose-700 hover:bg-rose-50" : "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                        }`}
                      >
                        {user.status !== 'suspended' ? (
                          <Lock className="h-3.5 w-3.5" />
                        ) : (
                          <Unlock className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    )}
                    {onDeleteUser && typeof user.id === 'number' && user.role !== 'مدير' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDeleteUser(user.id as number)}
                        className="h-7 px-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
