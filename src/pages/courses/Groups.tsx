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
import { Users, Plus, UserCheck, ArrowRight, MessageSquare, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export interface GroupMember {
  name: string;
  role: 'leader' | 'member';
  avatar?: string;
}

export interface StudyGroup {
  id: number;
  name: string;
  description: string;
  leaderName: string;
  members: GroupMember[];
  maxMembers: number;
}

export default function CourseGroups() {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const { courseData } = useCourseData();
  const course = courseData[Number(courseId)];

  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDesc, setNewGroupDesc] = useState("");

  // Load study groups from LocalStorage or seed default mock groups
  useEffect(() => {
    if (!courseId) return;
    const key = `ta3_groups_${courseId}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      setGroups(JSON.parse(saved));
    } else {
      const defaultGroups: StudyGroup[] = [
        {
          id: 1,
          name: "فريق البرمجة المتقدمة (Alpha)",
          description: "مجموعة مخصصة للعمل الجماعي على حل تمارين الواجبات والمشروع النهائي لـ CS101",
          leaderName: "أحمد علي",
          maxMembers: 5,
          members: [
            { name: "أحمد علي", role: "leader" },
            { name: "محمد العتيبي", role: "member" },
            { name: "سارة محمود", role: "member" }
          ]
        },
        {
          id: 2,
          name: "مجموعة مراجعة المفاهيم النظرية",
          description: "مناقشة ومراجعة مخرجات المحاضرات الأسبوعية والاستعداد للاختبارات القادمة",
          leaderName: "خالد سعيد",
          maxMembers: 4,
          members: [
            { name: "خالد سعيد", role: "leader" },
            { name: "مريم حسن", role: "member" }
          ]
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

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim() || !user) return;

    const newGroup: StudyGroup = {
      id: Math.max(0, ...groups.map(g => g.id)) + 1,
      name: newGroupName.trim(),
      description: newGroupDesc.trim() || "مجموعة دراسية للعمل الجماعي للمقرر",
      leaderName: user.name,
      maxMembers: 5,
      members: [
        { name: user.name, role: "leader" }
      ]
    };

    const updated = [newGroup, ...groups];
    saveGroups(updated);
    toast.success("تم إنشاء المجموعة الدراسية بنجاح");
    setNewGroupName("");
    setNewGroupDesc("");
    setDialogOpen(false);
  };

  const handleJoinGroup = (groupId: number) => {
    if (!user) return;
    const updated = groups.map(g => {
      if (g.id === groupId) {
        if (g.members.some(m => m.name === user.name)) {
          toast.info("أنت عضو بالفعل في هذه المجموعة");
          return g;
        }
        if (g.members.length >= g.maxMembers) {
          toast.error("المجموعة مكتملة العدد");
          return g;
        }
        toast.success("تم الانضمام للمجموعة بنجاح");
        return {
          ...g,
          members: [...g.members, { name: user.name, role: 'member' as const }]
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
            <h1 className="text-3xl font-extrabold text-[#002623]">فرق العمل والمجموعات الطلابية</h1>
            <p className="text-xs text-[#3D3A3B] font-medium">تشكيل مجموعات العمل الجماعي، توزيع أدوار المشاريع، والتنسيق بين الطلاب</p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#428177] hover:bg-[#054239] text-white font-bold flex items-center gap-1.5 shadow-sm">
                <Plus className="h-4 w-4 ml-1" />
                إنشاء مجموعة جديدة
              </Button>
            </DialogTrigger>
            <DialogContent dir="rtl" className="bg-white border border-[#428177]">
              <DialogHeader>
                <DialogTitle className="text-right text-[#002623]">إنشاء مجموعة دراسية جديدة</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateGroup} className="space-y-4 text-right">
                <div className="space-y-1.5">
                  <Label htmlFor="group-name" className="text-xs font-semibold text-[#002623]">اسم المجموعة / الفريق</Label>
                  <Input
                    id="group-name"
                    required
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    className="text-right border-[#428177]/40 focus-visible:ring-[#428177]"
                    placeholder="مثال: فريق مشروع بايثون (Gamma)"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="group-desc" className="text-xs font-semibold text-[#002623]">وصف الهدف من المجموعة</Label>
                  <Textarea
                    id="group-desc"
                    value={newGroupDesc}
                    onChange={(e) => setNewGroupDesc(e.target.value)}
                    className="text-right border-[#428177]/40 focus-visible:ring-[#428177] text-xs"
                    placeholder="اكتب أهداف التنسيق والمهام المطلوبة من الفريق..."
                    rows={3}
                  />
                </div>
                <Button type="submit" className="w-full bg-[#428177] hover:bg-[#054239] text-white font-bold mt-2">
                  تأكيد وإنشاء المجموعة
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Groups Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {groups.map((group) => {
            const isMember = user && group.members.some(m => m.name === user.name);

            return (
              <Card key={group.id} className="border border-[#428177]/30 hover:border-[#428177] transition-all bg-white shadow-sm rounded-2xl overflow-hidden text-right">
                <CardHeader className="pb-3 bg-[#EDEBE0]/30 border-b border-[#428177]/10">
                  <div className="flex justify-between items-start">
                    <Badge className="bg-[#428177]/15 text-[#054239] border-[#428177]/30 font-bold">
                      {group.members.length} / {group.maxMembers} أعضاء
                    </Badge>
                    <CardTitle className="text-xl font-bold text-[#002623]">{group.name}</CardTitle>
                  </div>
                  <p className="text-xs text-[#3D3A3B] font-medium mt-1 leading-relaxed">{group.description}</p>
                </CardHeader>

                <CardContent className="space-y-4 pt-4">
                  <div>
                    <h4 className="text-xs font-bold text-[#002623] mb-2.5 flex items-center justify-start gap-1">
                      <Users className="w-3.5 h-3.5 text-[#428177]" />
                      أعضاء الفريق الحاليين:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {group.members.map((m, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 bg-[#EDEBE0]/60 px-3 py-1.5 rounded-xl border border-[#428177]/20 text-xs text-[#002623] font-semibold">
                          {m.role === 'leader' ? (
                            <ShieldCheck className="w-3.5 h-3.5 text-[#6B1F2A]" />
                          ) : (
                            <UserCheck className="w-3.5 h-3.5 text-[#428177]" />
                          )}
                          <span>{m.name}</span>
                          {m.role === 'leader' && <span className="text-[10px] text-[#6B1F2A] font-bold">(قائد)</span>}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#EDEBE0] flex justify-between items-center">
                    {isMember ? (
                      <Badge className="bg-[#428177] text-white border-none font-bold py-1 px-3">
                        أنت عضو في هذا الفريق ✅
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleJoinGroup(group.id)}
                        className="bg-[#428177] hover:bg-[#054239] text-white font-bold"
                      >
                        الانضمام للفريق
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
