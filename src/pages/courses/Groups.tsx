import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useParams, Link } from "react-router-dom";
import { useCourseData } from "@/contexts/CourseContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Plus, ArrowRight, List, LayoutGrid, CheckCircle2, XCircle, Trash2, Undo2, MessageSquare, Send, Wand2, X } from "lucide-react";
import { toast } from "sonner";

export interface GroupMember {
  name: string;
  role: 'leader' | 'member';
}

export interface GroupApplication {
  id: number;
  studentName: string;
  appliedAt: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface GroupMessage {
  id: number;
  senderName: string;
  text: string;
  timestamp: string;
}

export interface StudyGroup {
  id: number;
  name: string;
  description: string;
  leaderName: string;
  members: GroupMember[];
  applications: GroupApplication[];
  messages?: GroupMessage[];
  maxMembers: number;
}

export default function CourseGroups() {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const { courseData } = useCourseData();
  const course = courseData[Number(courseId)];

  const isTeacher = user?.role === 'teacher';

  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [viewLayout, setViewLayout] = useState<'list' | 'grid'>('list');

  const defaultCourseLimit = Number(courseId) === 2 ? 2 : 4;

  // Teacher Create Group Modal state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDesc, setNewGroupDesc] = useState("");
  const [newGroupMaxMembers, setNewGroupMaxMembers] = useState(defaultCourseLimit);

  // Bulk Generation Modal state
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [bulkCount, setBulkCount] = useState(3);
  const [bulkLimit, setBulkLimit] = useState(defaultCourseLimit);
  const [bulkPrefix, setBulkPrefix] = useState("فريق دراسي");

  // Group Chat Modal state
  const [activeChatGroup, setActiveChatGroup] = useState<StudyGroup | null>(null);
  const [chatMessageText, setChatMessageText] = useState("");

  useEffect(() => {
    if (!courseId) return;
    const key = `ta3_groups_${courseId}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as StudyGroup[];
        const sanitized = parsed.map((g) => ({
          ...g,
          members: g.members || [],
          applications: g.applications || [],
          messages: g.messages || [
            { id: 1, senderName: "أحمد علي", text: "أهلاً بالجميع، سنقوم بمراجعة تمارين الواجب اليوم الساعة 6 مساءً", timestamp: "قبل ساعة" }
          ]
        }));
        setGroups(sanitized);
      } catch (e) {
        console.error("Failed to parse groups from cache", e);
      }
    } else {
      const defaultGroups: StudyGroup[] = [
        {
          id: 1,
          name: "فريق البرمجة المتقدمة (Alpha)",
          description: "مجموعة دراسية لمراجعة تمارين الواجبات والمشروع النهائي",
          leaderName: "د. خالد",
          maxMembers: defaultCourseLimit,
          members: [
            { name: "أحمد علي", role: "leader" },
            { name: "محمد العتيبي", role: "member" },
            { name: "سارة محمود", role: "member" }
          ],
          applications: [
            { id: 101, studentName: "خالد سعيد", appliedAt: new Date().toISOString(), status: 'pending' }
          ],
          messages: [
            { id: 1, senderName: "أحمد علي", text: "أهلاً بالجميع، سنقوم بمراجعة تمارين الواجب اليوم الساعة 6 مساءً", timestamp: "قبل ساعة" }
          ]
        },
        {
          id: 2,
          name: "مجموعة مراجعة الخوارزميات (Beta)",
          description: "مناقشة المفاهيم النظرية والاستعداد للاختبارات القادمة",
          leaderName: "د. خالد",
          maxMembers: 4,
          members: [],
          applications: [],
          messages: []
        }
      ];
      setGroups(defaultGroups);
      localStorage.setItem(key, JSON.stringify(defaultGroups));
    }
  }, [courseId]);

  const saveGroups = (updated: StudyGroup[]) => {
    setGroups(updated);
    localStorage.setItem(`ta3_groups_${courseId}`, JSON.stringify(updated));
  };

  // Teacher ONLY Group Creation
  const handleCreateGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim() || !user || !isTeacher) return;

    const newGroup: StudyGroup = {
      id: Math.max(0, ...groups.map(g => g.id)) + 1,
      name: newGroupName.trim(),
      description: newGroupDesc.trim() || "مجموعة دراسية معتمدة من معلم المقرر",
      leaderName: user.name,
      maxMembers: Number(newGroupMaxMembers) || defaultCourseLimit,
      members: [],
      applications: [],
      messages: []
    };

    const updated = [newGroup, ...groups];
    saveGroups(updated);
    toast.success("تم إنشاء المجموعة الدراسية بنجاح عبر المعلم");
    setNewGroupName("");
    setNewGroupDesc("");
    setDialogOpen(false);
  };

  // Teacher Bulk Generate Groups
  const handleBulkGenerateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !isTeacher) return;
    const count = Math.min(20, Math.max(1, Number(bulkCount) || 1));
    const limit = Math.min(20, Math.max(1, Number(bulkLimit) || defaultCourseLimit));
    const prefix = bulkPrefix.trim() || "فريق دراسي";

    let currentMaxId = Math.max(0, ...groups.map(g => g.id));
    const generated: StudyGroup[] = [];

    for (let i = 1; i <= count; i++) {
      currentMaxId += 1;
      generated.push({
        id: currentMaxId,
        name: `${prefix} #${groups.length + i}`,
        description: `مجموعة فرعية مخصصة لمقرر ${course?.name || ""} (الحد الأقصى: ${limit} طلاب)`,
        leaderName: user.name,
        maxMembers: limit,
        members: [],
        applications: [],
        messages: []
      });
    }

    const updated = [...groups, ...generated];
    saveGroups(updated);
    toast.success(`تم توليد ${count} مجموعات دراسية بنجاح (سعة ${limit} طلاب/مجموعة)`);
    setBulkDialogOpen(false);
  };

  // Teacher Kick Member from Study Group
  const handleKickMember = (groupId: number, memberName: string) => {
    if (!isTeacher) return;
    const updated = groups.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          members: (g.members || []).filter(m => m.name !== memberName)
        };
      }
      return g;
    });
    saveGroups(updated);
    toast.success(`تم استبعاد الطالب ${memberName} من المجموعة`);
  };

  // Send Internal Group Chat Message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessageText.trim() || !activeChatGroup || !user) return;

    const newMessage: GroupMessage = {
      id: Date.now(),
      senderName: isTeacher ? `${user.name} (أستاذ المادة 👨‍🏫)` : user.name,
      text: chatMessageText.trim(),
      timestamp: "الآن"
    };

    const updatedGroups = groups.map(g => {
      if (g.id === activeChatGroup.id) {
        const msgs = [...(g.messages || []), newMessage];
        const updated = { ...g, messages: msgs };
        setActiveChatGroup(updated);
        return updated;
      }
      return g;
    });

    saveGroups(updatedGroups);
    setChatMessageText("");
  };

  // Teacher Delete Study Group
  const handleDeleteGroup = (groupId: number) => {
    if (!isTeacher) return;
    const updated = groups.filter(g => g.id !== groupId);
    saveGroups(updated);
    toast.success("تم حذف المجموعة الدراسية بنجاح");
  };

  // Direct Join Group (Students only, immediate join without pending request)
  const handleJoinGroup = (groupId: number) => {
    if (!user || isTeacher) return;
    const updated = groups.map(g => {
      if (g.id === groupId) {
        const members = g.members || [];
        if (members.some(m => m.name === user.name)) {
          toast.info("أنت عضو بالفعل في هذه المجموعة");
          return g;
        }
        if (members.length >= (g.maxMembers || 4)) {
          toast.error("عذراً، هذه المجموعة مكتملة العدد");
          return g;
        }
        const newMembers: GroupMember[] = [
          ...members,
          { name: user.name, role: members.length === 0 ? 'leader' : 'member' }
        ];
        toast.success(`تم انضمامك إلى ${g.name} بنجاح`);
        return {
          ...g,
          members: newMembers
        };
      }
      return g;
    });
    saveGroups(updated);
  };

  // Leave Group (Students only)
  const handleLeaveGroup = (groupId: number) => {
    if (!user || isTeacher) return;
    const updated = groups.map(g => {
      if (g.id === groupId) {
        const members = (g.members || []).filter(m => m.name !== user.name);
        toast.info("تمت مغادرة المجموعة بنجاح");
        return {
          ...g,
          members
        };
      }
      return g;
    });
    saveGroups(updated);
  };

  if (!course) {
    return (
      <DashboardLayout title="المقرر غير موجود">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-muted-foreground">المقرر غير موجود</h1>
        </div>
      </DashboardLayout>
    );
  }

  const backPath = user?.role === 'teacher' ? `/teacher/courses/${courseId}` : user?.role === 'admin' ? '/admin' : user?.role === 'creator' ? '/creator' : `/student/courses/${courseId}`;

  return (
    <DashboardLayout title={`المجموعات الدراسية - ${course.name}`}>
      <div className="space-y-6" dir="rtl">
        {/* Navigation Breadcrumb & Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#428177]/20 pb-4">
          <div className="text-right space-y-1">
            <div className="flex items-center gap-2 justify-start text-xs text-[#3D3A3B]">
              <Link to={backPath} className="hover:text-[#428177] transition-colors flex items-center gap-1 font-semibold">
                {course.name}
                <ArrowRight className="h-3 w-3" />
              </Link>
              <span>/</span>
              <span className="font-bold text-[#002623]">المجموعات الدراسية</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#002623]">دليل المجموعات والفرق الدراسية</h1>
            <p className="text-xs text-[#3D3A3B] font-medium">إنشاء المجموعات وتحديد السعة يتم حصرياً بواسطة المعلم • انضمام فوري ومباشر للطلاب حتى اكتمال العدد المحدد</p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Layout Switcher (Default: List) */}
            <div className="flex items-center gap-1 bg-[#EDEBE0] p-1 rounded-xl border border-[#428177]/20">
              <Button
                size="sm"
                variant={viewLayout === 'list' ? 'default' : 'ghost'}
                onClick={() => setViewLayout('list')}
                className={viewLayout === 'list' ? 'bg-[#428177] text-white font-bold text-xs flex items-center gap-1' : 'text-[#002623] font-bold text-xs flex items-center gap-1'}
              >
                <List className="w-3.5 h-3.5" />
                عرض القائمة (الافتراضي)
              </Button>
              <Button
                size="sm"
                variant={viewLayout === 'grid' ? 'default' : 'ghost'}
                onClick={() => setViewLayout('grid')}
                className={viewLayout === 'grid' ? 'bg-[#428177] text-white font-bold text-xs flex items-center gap-1' : 'text-[#002623] font-bold text-xs flex items-center gap-1'}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                عرض الشبكة
              </Button>
            </div>

            {/* Teacher-Only Actions: Bulk Generator & Single Creator */}
            {isTeacher && (
              <div className="flex items-center gap-2">
                {/* Bulk Generate Modal */}
                <Dialog open={bulkDialogOpen} onOpenChange={setBulkDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="border-[#428177] text-[#002623] hover:bg-[#EDEBE0] font-bold text-xs flex items-center gap-1.5 shadow-sm">
                      <Wand2 className="h-4 w-4 text-[#428177]" />
                      توليد مجموعات آلياً (Bulk)
                    </Button>
                  </DialogTrigger>
                  <DialogContent dir="rtl" className="bg-white border border-[#428177] text-right">
                    <DialogHeader>
                      <DialogTitle className="text-right text-[#002623]">توليد مجموعات دراسية تلقائياً للمقرر</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleBulkGenerateSubmit} className="space-y-4 text-right pt-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="bulk-count" className="text-xs font-semibold text-[#002623]">عدد المجموعات المراد إنشاؤها</Label>
                        <Input
                          id="bulk-count"
                          type="number"
                          min={1}
                          max={20}
                          value={bulkCount}
                          onChange={(e) => setBulkCount(Number(e.target.value) || 1)}
                          className="text-right border-[#428177]/40"
                          placeholder="مثال: 4"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="bulk-limit" className="text-xs font-semibold text-[#002623]">الحد الأقصى لعدد الطلاب في كل مجموعة</Label>
                        <Input
                          id="bulk-limit"
                          type="number"
                          min={1}
                          max={10}
                          value={bulkLimit}
                          onChange={(e) => setBulkLimit(Number(e.target.value) || defaultCourseLimit)}
                          className="text-right border-[#428177]/40"
                        />
                        <p className="text-[11px] text-[#3D3A3B]">مقرر 1 محدد افتراضياً بـ 4 طلاب، ومقرر 2 بـ طالبين</p>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="bulk-prefix" className="text-xs font-semibold text-[#002623]">بادئة اسم المجموعات</Label>
                        <Input
                          id="bulk-prefix"
                          value={bulkPrefix}
                          onChange={(e) => setBulkPrefix(e.target.value)}
                          className="text-right border-[#428177]/40"
                          placeholder="مثال: فريق عمل"
                        />
                      </div>
                      <Button type="submit" className="w-full bg-[#428177] hover:bg-[#054239] text-white font-bold mt-2">
                        بدء توليد المجموعات الآن
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>

                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-[#428177] hover:bg-[#054239] text-white font-bold text-xs flex items-center gap-1 shadow-sm">
                      <Plus className="h-4 w-4 ml-1" />
                      إنشاء مجموعة فردية
                    </Button>
                  </DialogTrigger>
                <DialogContent dir="rtl" className="bg-white border border-[#428177]">
                  <DialogHeader>
                    <DialogTitle className="text-right text-[#002623]">إنشاء مجموعة دراسية معتمدة (خاص بالمعلم)</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateGroupSubmit} className="space-y-4 text-right">
                    <div className="space-y-1.5">
                      <Label htmlFor="g-name" className="text-xs font-semibold text-[#002623]">اسم المجموعة</Label>
                      <Input
                        id="g-name"
                        required
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                        className="text-right border-[#428177]/40 focus-visible:ring-[#428177]"
                        placeholder="مثال: فريق مشروع البرمجة (Delta)"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="g-desc" className="text-xs font-semibold text-[#002623]">الوصف والتعليمات</Label>
                      <Textarea
                        id="g-desc"
                        value={newGroupDesc}
                        onChange={(e) => setNewGroupDesc(e.target.value)}
                        className="text-right border-[#428177]/40 focus-visible:ring-[#428177] text-xs"
                        placeholder="تعليمات التنسيق بين الطلاب المهتمين بالانضمام..."
                        rows={3}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="g-limit" className="text-xs font-semibold text-[#002623]">الحد الأقصى لعدد الطلاب في المجموعة</Label>
                      <Input
                        id="g-limit"
                        type="number"
                        min={1}
                        max={10}
                        value={newGroupMaxMembers}
                        onChange={(e) => setNewGroupMaxMembers(Number(e.target.value) || defaultCourseLimit)}
                        className="text-right border-[#428177]/40 focus-visible:ring-[#428177]"
                      />
                      <p className="text-[11px] text-[#3D3A3B]">الحد النموذجي الموصى به لهذا المقرر: {defaultCourseLimit} طلاب</p>
                    </div>
                    <Button type="submit" className="w-full bg-[#428177] hover:bg-[#054239] text-white font-bold mt-2">
                      اعتماد وإنشاء المجموعة
                    </Button>
                  </form>
                </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        </div>

        {/* DEFAULT VIEW: LIST VIEW */}
        {viewLayout === 'list' && (
          <div className="border border-[#428177]/30 rounded-2xl overflow-hidden bg-white shadow-sm">
            <Table dir="rtl">
              <TableHeader className="bg-[#EDEBE0]/50">
                <TableRow>
                  <TableHead className="text-right font-bold text-[#002623]">اسم المجموعة</TableHead>
                  <TableHead className="text-right font-bold text-[#002623]">الوصف</TableHead>
                  <TableHead className="text-center font-bold text-[#002623]">الأعضاء الحاليون</TableHead>
                  <TableHead className="text-center font-bold text-[#002623]">محادثة المجموعة</TableHead>
                  <TableHead className="text-center font-bold text-[#002623]">الإجراءات والعمليات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groups.map((group) => {
                  const members = group.members || [];
                  const applications = group.applications || [];
                  const isMember = user && members.some(m => m.name === user.name);
                  const hasPendingApp = user && applications.some(a => a.studentName === user.name && a.status === 'pending');

                  return (
                    <TableRow key={group.id} className="hover:bg-[#EDEBE0]/20 transition-colors">
                      <TableCell className="font-bold text-[#002623]">{group.name}</TableCell>
                      <TableCell className="text-xs text-[#3D3A3B] max-w-xs truncate font-medium">{group.description}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center gap-1.5">
                          <Badge className="bg-[#428177]/15 text-[#054239] border border-[#428177]/30 font-bold text-xs">
                            {members.length} / {group.maxMembers || defaultCourseLimit} أعضاء
                          </Badge>
                          {members.length > 0 && (
                            <div className="flex flex-wrap justify-center gap-1 max-w-[220px]">
                              {members.map((m, mIdx) => (
                                <Badge key={mIdx} variant="outline" className="text-[10px] py-0 px-1.5 border-[#428177]/30 text-[#002623] flex items-center gap-1">
                                  <span>{m.name}</span>
                                  {isTeacher && (
                                    <button
                                      type="button"
                                      onClick={() => handleKickMember(group.id, m.name)}
                                      className="text-rose-600 hover:text-rose-800 transition-colors ml-0.5"
                                      title="استبعاد الطالب من المجموعة"
                                    >
                                      <X className="w-2.5 h-2.5" />
                                    </button>
                                  )}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setActiveChatGroup(group)}
                          className="border-[#428177]/30 text-[#002623] hover:bg-[#428177]/10 text-xs font-bold gap-1"
                        >
                          <MessageSquare className="h-3.5 w-3.5 text-[#428177]" />
                          دردشة الفريق ({group.messages?.length || 0})
                        </Button>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          {isTeacher ? (
                            <Badge variant="outline" className="border-[#428177]/40 text-[#428177] font-bold py-1 px-2.5 text-xs">
                              إشراف وإدارة المعلم 👨‍🏫
                            </Badge>
                          ) : isMember ? (
                            <div className="flex items-center gap-1.5">
                              <Badge className="bg-[#428177] text-white border-none font-bold py-1 px-2.5 text-xs">
                                عضو بالفريق ✅
                              </Badge>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleLeaveGroup(group.id)}
                                className="text-xs text-[#6B1F2A] hover:bg-[#6B1F2A]/10 h-7 px-2 font-bold"
                              >
                                مغادرة
                              </Button>
                            </div>
                          ) : members.length >= (group.maxMembers || 4) ? (
                            <Badge variant="secondary" className="text-muted-foreground text-xs py-1 px-2.5 font-bold">
                              المجموعة مكتملة
                            </Badge>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleJoinGroup(group.id)}
                              className="bg-[#428177] hover:bg-[#054239] text-white font-bold text-xs"
                            >
                              انضمام للمجموعة
                            </Button>
                          )}

                          {isTeacher && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteGroup(group.id)}
                              className="text-[#6B1F2A] hover:bg-[#6B1F2A]/10 h-8 w-8 p-0"
                              title="حذف المجموعة (خاص بالمعلم)"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}

        {/* SECONDARY VIEW: GRID VIEW */}
        {viewLayout === 'grid' && (
          <div className="grid gap-6 md:grid-cols-2">
            {groups.map((group) => {
              const members = group.members || [];
              const applications = group.applications || [];
              const isMember = user && members.some(m => m.name === user.name);
              const hasPendingApp = user && applications.some(a => a.studentName === user.name && a.status === 'pending');

              return (
                <Card key={group.id} className="border border-[#428177]/30 bg-white shadow-sm rounded-2xl overflow-hidden text-right">
                  <CardHeader className="pb-3 bg-[#EDEBE0]/30 border-b border-[#428177]/10">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-[#428177]/15 text-[#054239] border-[#428177]/30 font-bold">
                          {members.length} / {group.maxMembers || 5} أعضاء
                        </Badge>
                        {isTeacher && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteGroup(group.id)}
                            className="text-[#6B1F2A] hover:bg-[#6B1F2A]/10 h-7 w-7 p-0"
                            title="حذف المجموعة"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </div>
                      <CardTitle className="text-lg font-bold text-[#002623]">{group.name}</CardTitle>
                    </div>
                    <p className="text-xs text-[#3D3A3B] font-medium mt-1">{group.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4">
                    <div>
                      <h4 className="text-xs font-bold text-[#002623] mb-2 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-[#428177]" />
                        الأعضاء الحاليون ({members.length}):
                      </h4>
                      {members.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {members.map((m, idx) => (
                            <Badge key={idx} variant="outline" className="border-[#428177]/30 text-[#002623] text-[11px] font-semibold flex items-center gap-1.5">
                              <span>{m.name} {m.role === 'leader' && "(قائد)"}</span>
                              {isTeacher && (
                                <button
                                  type="button"
                                  onClick={() => handleKickMember(group.id, m.name)}
                                  className="text-rose-600 hover:text-rose-800 transition-colors p-0.5 rounded"
                                  title="استبعاد الطالب من المجموعة"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              )}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-[#3D3A3B] italic">المجموعة فارغة حالياً</p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-[#EDEBE0] flex justify-between items-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setActiveChatGroup(group)}
                        className="border-[#428177]/30 text-[#002623] hover:bg-[#428177]/10 text-xs font-bold gap-1"
                      >
                        <MessageSquare className="h-3.5 w-3.5 text-[#428177]" />
                        محادثة المجموعة
                      </Button>

                      {isTeacher ? (
                        <Badge variant="outline" className="border-[#428177]/40 text-[#428177] font-bold py-1 px-2.5 text-xs">
                          إشراف وإدارة المعلم 👨‍🏫
                        </Badge>
                      ) : isMember ? (
                        <div className="flex items-center gap-1.5">
                          <Badge className="bg-[#428177] text-white border-none font-bold py-1 px-2.5 text-xs">
                            عضو بالفريق ✅
                          </Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleLeaveGroup(group.id)}
                            className="text-xs text-[#6B1F2A] hover:bg-[#6B1F2A]/10 h-7 px-2 font-bold"
                          >
                            مغادرة
                          </Button>
                        </div>
                      ) : members.length >= (group.maxMembers || 4) ? (
                        <Badge variant="secondary" className="text-muted-foreground text-xs py-1 px-2.5 font-bold">
                          المجموعة مكتملة
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleJoinGroup(group.id)}
                          className="bg-[#428177] hover:bg-[#054239] text-white font-bold text-xs"
                        >
                          انضمام للمجموعة
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Group Internal Chat Dialog */}
        {activeChatGroup && (
          <Dialog open={!!activeChatGroup} onOpenChange={() => setActiveChatGroup(null)}>
            <DialogContent dir="rtl" className="max-w-lg bg-white border border-[#428177] text-right">
              <DialogHeader className="border-b pb-3">
                <DialogTitle className="text-right text-[#002623] font-bold text-base flex items-center justify-between">
                  <span>غرفة محادثة المجموعة: {activeChatGroup.name}</span>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-3 py-2">
                <div className="h-64 overflow-y-auto space-y-2.5 p-3 border rounded-xl bg-muted/20 text-xs">
                  {activeChatGroup.messages && activeChatGroup.messages.length > 0 ? (
                    activeChatGroup.messages.map((m) => {
                      const isTeacherMsg = m.senderName.includes("أستاذ المادة");
                      return (
                        <div
                          key={m.id}
                          className={`p-2.5 rounded-xl max-w-[85%] ${
                            isTeacherMsg
                              ? 'bg-[#002623] text-white border border-[#428177] mr-auto shadow-sm'
                              : m.senderName === user?.name
                              ? 'mr-auto bg-[#428177] text-white'
                              : 'ml-auto bg-white border text-foreground'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1 gap-2">
                            <span className="font-bold text-[11px] flex items-center gap-1">
                              {m.senderName}
                              {isTeacherMsg && <span className="bg-[#428177]/40 text-[9px] px-1.5 rounded text-white font-bold">المشرف الأكاديمي</span>}
                            </span>
                            <span className="text-[10px] opacity-75">{m.timestamp}</span>
                          </div>
                          <p className="leading-relaxed">{m.text}</p>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-12 text-muted-foreground text-xs">
                      لا توجد رسائل في هذه المجموعة بعد. كن أول من يكتب!
                    </div>
                  )}
                </div>

                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    placeholder="اكتب رسالتك لأعضاء الفريق..."
                    value={chatMessageText}
                    onChange={(e) => setChatMessageText(e.target.value)}
                    className="text-right text-xs bg-white border-[#428177]/40"
                  />
                  <Button type="submit" className="bg-[#428177] hover:bg-[#054239] text-white font-bold text-xs gap-1">
                    <Send className="h-3.5 w-3.5" />
                    إرسال
                  </Button>
                </form>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </DashboardLayout>
  );
}
