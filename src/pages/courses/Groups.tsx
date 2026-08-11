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
import { Users, Plus, UserCheck, ArrowRight, ShieldCheck, List, LayoutGrid, CheckCircle2, XCircle, Trash2, Undo2 } from "lucide-react";
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

export interface StudyGroup {
  id: number;
  name: string;
  description: string;
  leaderName: string;
  members: GroupMember[];
  applications: GroupApplication[];
  maxMembers: number;
}

export default function CourseGroups() {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const { courseData } = useCourseData();
  const course = courseData[Number(courseId)];

  const isTeacher = user?.role === 'teacher';

  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [viewLayout, setViewLayout] = useState<'list' | 'grid'>('list'); // Default is LIST view as requested

  // Teacher Create Group Modal state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDesc, setNewGroupDesc] = useState("");

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
          applications: g.applications || []
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
          maxMembers: 5,
          members: [
            { name: "أحمد علي", role: "leader" },
            { name: "محمد العتيبي", role: "member" },
            { name: "سارة محمود", role: "member" }
          ],
          applications: [
            { id: 101, studentName: "خالد سعيد", appliedAt: new Date().toISOString(), status: 'pending' }
          ]
        },
        {
          id: 2,
          name: "مجموعة مراجعة الخوارزميات (Beta)",
          description: "مناقشة المفاهيم النظرية والاستعداد للاختبارات القادمة",
          leaderName: "د. خالد",
          maxMembers: 4,
          members: [],
          applications: []
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
      maxMembers: 5,
      members: [],
      applications: []
    };

    const updated = [newGroup, ...groups];
    saveGroups(updated);
    toast.success("تم إنشاء المجموعة الدراسية بنجاح عبر المعلم");
    setNewGroupName("");
    setNewGroupDesc("");
    setDialogOpen(false);
  };

  // Teacher Delete Study Group
  const handleDeleteGroup = (groupId: number) => {
    if (!isTeacher) return;
    const updated = groups.filter(g => g.id !== groupId);
    saveGroups(updated);
    toast.success("تم حذف المجموعة الدراسية بنجاح");
  };

  // Student Group Application Workflow
  const handleApplyToGroup = (groupId: number) => {
    if (!user) return;
    const updated = groups.map(g => {
      if (g.id === groupId) {
        const members = g.members || [];
        const applications = g.applications || [];

        if (members.some(m => m.name === user.name)) {
          toast.info("أنت عضو بالفعل في هذه المجموعة");
          return g;
        }

        // Auto-accept if group is empty (0 members)
        if (members.length === 0) {
          toast.success("تم انضمامك للمجموعة تلقائياً (مجموعة جديدة)");
          return {
            ...g,
            members: [{ name: user.name, role: 'leader' as const }],
            applications
          };
        }

        if (applications.some(a => a.studentName === user.name && a.status === 'pending')) {
          toast.info("طلب انضمامك قيد المراجعة لدى الأعضاء والمعلم");
          return g;
        }

        toast.success("تم تقديم طلب الانضمام للمجموعة وفي انتظار موافقة أعضاء الفريق أو المعلم");
        return {
          ...g,
          members,
          applications: [
            ...applications,
            {
              id: Date.now(),
              studentName: user.name,
              appliedAt: new Date().toISOString(),
              status: 'pending' as const
            }
          ]
        };
      }
      return g;
    });
    saveGroups(updated);
  };

  // Student Withdraw/Cancel Group Application
  const handleCancelApplication = (groupId: number) => {
    if (!user) return;
    const updated = groups.map(g => {
      if (g.id === groupId) {
        const applications = (g.applications || []).filter(a => a.studentName !== user.name);
        toast.info("تم سحب وإلغاء طلب الانضمام بنجاح");
        return {
          ...g,
          applications
        };
      }
      return g;
    });
    saveGroups(updated);
  };

  // Approve / Reject Application (by Group Members or Teacher)
  const handleProcessApplication = (groupId: number, appId: number, action: 'accept' | 'reject') => {
    const updated = groups.map(g => {
      if (g.id === groupId) {
        const members = g.members || [];
        const applications = g.applications || [];

        const app = applications.find(a => a.id === appId);
        if (!app) return g;

        let updatedMembers = members;
        if (action === 'accept') {
          updatedMembers = [...members, { name: app.studentName, role: 'member' as const }];
          toast.success(`تمت الموافقة على انضمام ${app.studentName}`);
        } else {
          toast.error(`تم رفض طلب انضمام ${app.studentName}`);
        }

        return {
          ...g,
          members: updatedMembers,
          applications: applications.filter(a => a.id !== appId)
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

  const backPath = user?.role === 'teacher' ? `/teacher/courses/${courseId}` : `/student/courses/${courseId}`;

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
            <p className="text-xs text-[#3D3A3B] font-medium">إنشاء المجموعات يتم حصرياً بواسطة معلم المقرر • الانضمام يتطلب تقديم طلب موافقة (قبول تلقائي للمجموعات الفارغة)</p>
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

            {/* Teacher-Only Add Group Trigger */}
            {isTeacher && (
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#428177] hover:bg-[#054239] text-white font-bold text-xs flex items-center gap-1 shadow-sm">
                    <Plus className="h-4 w-4 ml-1" />
                    إنشاء مجموعة (خاص بالمعلم)
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
                    <Button type="submit" className="w-full bg-[#428177] hover:bg-[#054239] text-white font-bold mt-2">
                      اعتماد وإنشاء المجموعة
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
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
                  <TableHead className="text-center font-bold text-[#002623]">طلبات المعلقة</TableHead>
                  <TableHead className="text-center font-bold text-[#002623]">الإجراءات والعمليات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groups.map((group) => {
                  const members = group.members || [];
                  const applications = group.applications || [];
                  const isMember = user && members.some(m => m.name === user.name);
                  const hasPendingApp = user && applications.some(a => a.studentName === user.name && a.status === 'pending');
                  const pendingApps = applications.filter(a => a.status === 'pending');

                  return (
                    <TableRow key={group.id} className="hover:bg-[#EDEBE0]/20 transition-colors">
                      <TableCell className="font-bold text-[#002623]">{group.name}</TableCell>
                      <TableCell className="text-xs text-[#3D3A3B] max-w-xs truncate font-medium">{group.description}</TableCell>
                      <TableCell className="text-center">
                        <Badge className="bg-[#428177]/15 text-[#054239] border border-[#428177]/30 font-bold">
                          {members.length} / {group.maxMembers || 5} أعضاء
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center font-semibold text-xs">
                        {pendingApps.length > 0 ? (
                          <Badge className="bg-[#988561]/20 text-[#002623] font-bold">{pendingApps.length} طلبات</Badge>
                        ) : (
                          <span className="text-[#3D3A3B] text-[11px]">لا يوجد</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          {isMember ? (
                            <Badge className="bg-[#428177] text-white border-none font-bold py-1 px-3">
                              عضو بالفريق ✅
                            </Badge>
                          ) : hasPendingApp ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCancelApplication(group.id)}
                              className="border-[#6B1F2A]/40 text-[#6B1F2A] hover:bg-[#6B1F2A]/10 font-bold text-xs flex items-center gap-1"
                            >
                              <Undo2 className="w-3.5 h-3.5" />
                              إلغاء طلب الانضمام
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleApplyToGroup(group.id)}
                              className="bg-[#428177] hover:bg-[#054239] text-white font-bold text-xs"
                            >
                              {members.length === 0 ? "انضمام تلقائي" : "تقديم طلب انضمام"}
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
                            <Badge key={idx} variant="outline" className="border-[#428177]/30 text-[#002623] text-[11px] font-semibold">
                              {m.name} {m.role === 'leader' && "(قائد)"}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-[#3D3A3B] italic">المجموعة فارغة (الانضمام فوري بدون انتظار موافقة)</p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-[#EDEBE0] flex justify-between items-center">
                      {isMember ? (
                        <Badge className="bg-[#428177] text-white border-none font-bold py-1 px-3">
                          أنت عضو بالفريق ✅
                        </Badge>
                      ) : hasPendingApp ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCancelApplication(group.id)}
                          className="border-[#6B1F2A]/40 text-[#6B1F2A] hover:bg-[#6B1F2A]/10 font-bold text-xs flex items-center gap-1"
                        >
                          <Undo2 className="w-3.5 h-3.5" />
                          إلغاء طلب الانضمام
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleApplyToGroup(group.id)}
                          className="bg-[#428177] hover:bg-[#054239] text-white font-bold text-xs"
                        >
                          {members.length === 0 ? "انضمام تلقائي" : "تقديم طلب انضمام"}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Pending Group Applications Approval Section (Visible to Group Members & Teacher) */}
        {groups.some(g => (isTeacher || (g.members || []).some(m => user && m.name === user.name)) && (g.applications || []).some(a => a.status === 'pending')) && (
          <Card className="border border-[#988561]/40 bg-white shadow-sm rounded-2xl text-right">
            <CardHeader className="pb-2 bg-[#EDEBE0]/40 border-b border-[#428177]/10">
              <CardTitle className="text-base font-bold text-[#002623]">طلبات الانضمام المعلقة التي يمكنك اتخاذ قرار بشأنها</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {groups.flatMap(g => (g.applications || []).filter(a => a.status === 'pending').map(a => ({ group: g, app: a }))).map(({ group, app }) => (
                <div key={app.id} className="flex items-center justify-between bg-[#EDEBE0]/20 p-3 rounded-xl border border-[#428177]/20">
                  <div className="space-y-0.5 text-xs">
                    <span className="font-bold text-[#002623]">{app.studentName}</span>
                    <p className="text-[#3D3A3B]">يرغب بالانضمام إلى: <span className="font-bold">{group.name}</span></p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleProcessApplication(group.id, app.id, 'accept')}
                      className="bg-[#428177] hover:bg-[#054239] text-white font-bold text-xs flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      موافقة
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleProcessApplication(group.id, app.id, 'reject')}
                      className="border-[#6B1F2A]/40 text-[#6B1F2A] hover:bg-[#6B1F2A]/10 font-bold text-xs flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      رفض
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
