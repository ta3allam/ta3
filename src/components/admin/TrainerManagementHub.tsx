import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import {
  UserPlus,
  CheckCircle2,
  XCircle,
  Sparkles,
  KeyRound,
  Mail,
  ShieldCheck,
  Video,
  Award,
  GraduationCap,
  Briefcase
} from "lucide-react";
import { toast } from "sonner";
import { UserItem } from "./UserManagementTable";

export interface TrainerApplication {
  id: string;
  teacherName: string;
  username: string;
  email: string;
  specialization: string;
  proposedWorkshop: string;
  experienceYears: number;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
}

const DEFAULT_APPLICATIONS: TrainerApplication[] = [
  {
    id: "app-101",
    teacherName: "د. خالد الأكاديمي",
    username: "khaled.teacher",
    email: "khaled@university.edu.sy",
    specialization: "الذكاء الاصطناعي ومعالجة اللغات الطبيعية",
    proposedWorkshop: "بناء تطبيقات LLM عملية باستخدام LangChain وPython",
    experienceYears: 8,
    submittedAt: "2026-10-24",
    status: "pending"
  },
  {
    id: "app-102",
    teacherName: "م. رامي الشريف",
    username: "rami.sh",
    email: "rami.sharif@engineering.org",
    specialization: "الحوسبة السحابية وDevOps",
    proposedWorkshop: "ورشة مكثفة في بنية Docker وKubernetes السحابية",
    experienceYears: 6,
    submittedAt: "2026-10-26",
    status: "pending"
  }
];

export interface CertifiedTrainer {
  id: string;
  name: string;
  username: string;
  email: string;
  specialization: string;
  workshopsCount: number;
  status: "active" | "suspended";
}

const DEFAULT_TRAINERS: CertifiedTrainer[] = [
  {
    id: "tr-01",
    name: "أ. محمود صانع المحتوى",
    username: "mahmoud.creator",
    email: "mahmoud@ta3allam.app",
    specialization: "تطوير تطبيقات الويب الحديثة",
    workshopsCount: 14,
    status: "active"
  },
  {
    id: "tr-02",
    name: "د. طارق المشرف",
    username: "tariq.admin",
    email: "tariq.admin@ta3allam.app",
    specialization: "أمن المعلومات والاختراق الأخلاقي",
    workshopsCount: 9,
    status: "active"
  }
];

interface TrainerManagementHubProps {
  onAddUser?: (user: { name: string; username: string; role: string }) => void;
}

export function TrainerManagementHub({ onAddUser }: TrainerManagementHubProps) {
  const [applications, setApplications] = useState<TrainerApplication[]>(() => {
    const saved = localStorage.getItem("ta3_trainer_applications");
    return saved ? JSON.parse(saved) : DEFAULT_APPLICATIONS;
  });

  const [trainers, setTrainers] = useState<CertifiedTrainer[]>(() => {
    const saved = localStorage.getItem("ta3_certified_trainers");
    return saved ? JSON.parse(saved) : DEFAULT_TRAINERS;
  });

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [trainerName, setTrainerName] = useState("");
  const [trainerEmail, setTrainerEmail] = useState("");
  const [trainerUsername, setTrainerUsername] = useState("");
  const [trainerPassword, setTrainerPassword] = useState("");
  const [trainerSpecialization, setTrainerSpecialization] = useState("");

  const saveApplications = (updated: TrainerApplication[]) => {
    setApplications(updated);
    localStorage.setItem("ta3_trainer_applications", JSON.stringify(updated));
  };

  const saveTrainers = (updated: CertifiedTrainer[]) => {
    setTrainers(updated);
    localStorage.setItem("ta3_certified_trainers", JSON.stringify(updated));
  };

  const handleApproveApplication = (app: TrainerApplication) => {
    // 1. Mark application approved
    const updatedApps = applications.map((a) =>
      a.id === app.id ? { ...a, status: "approved" as const } : a
    );
    saveApplications(updatedApps);

    // 2. Add to certified trainers
    const newTrainer: CertifiedTrainer = {
      id: `tr-${Date.now()}`,
      name: app.teacherName,
      username: app.username,
      email: app.email,
      specialization: app.specialization,
      workshopsCount: 0,
      status: "active"
    };
    saveTrainers([...trainers, newTrainer]);

    // 3. Register role as creator in users list if hook present
    onAddUser?.({
      name: app.teacherName,
      username: app.username,
      role: "صانع محتوى"
    });

    toast.success(`تمت الموافقة على طلب المعلم (${app.teacherName}) وترقيته إلى مدرب ورش معتمد! 🎓`);
  };

  const handleRejectApplication = (appId: string) => {
    const updatedApps = applications.map((a) =>
      a.id === appId ? { ...a, status: "rejected" as const } : a
    );
    saveApplications(updatedApps);
    toast.error("تم رفض طلب الترقية إلى مدرب ورش عمل");
  };

  const handleCreateTrainerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trainerName.trim() || !trainerEmail.trim() || !trainerUsername.trim() || !trainerPassword.trim()) {
      toast.error("يرجى ملء كافة الحقول الإلزامية بما في ذلك كلمة المرور");
      return;
    }

    const newTrainer: CertifiedTrainer = {
      id: `tr-${Date.now()}`,
      name: trainerName.trim(),
      username: trainerUsername.trim(),
      email: trainerEmail.trim(),
      specialization: trainerSpecialization.trim() || "مدرب ورش تقنية معتمد",
      workshopsCount: 0,
      status: "active"
    };

    saveTrainers([...trainers, newTrainer]);

    // Add to system users as Creator (صانع محتوى / مدرب)
    onAddUser?.({
      name: trainerName.trim(),
      username: trainerUsername.trim(),
      role: "صانع محتوى"
    });

    toast.success(`تم إنشاء حساب المدرب (${trainerName}) وتعيين كلمة المرور بنجاح! يمكنه الآن جدولة ورش العمل.`);

    // Reset form
    setTrainerName("");
    setTrainerEmail("");
    setTrainerUsername("");
    setTrainerPassword("");
    setTrainerSpecialization("");
    setIsCreateOpen(false);
  };

  const pendingApps = applications.filter((a) => a.status === "pending");

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#EDEBE0]/40 p-4 rounded-3xl border border-[#428177]/25 shadow-xs">
        <div>
          <h3 className="text-base font-black text-[#002623] flex items-center gap-2">
            <Video className="h-5 w-5 text-[#428177]" />
            <span>إدارة مدربي ورش العمل والترقيات الأكاديمية (Trainers Hub)</span>
          </h3>
          <p className="text-xs text-[#3D3A3B] mt-1 font-medium">
            مراجعة طلبات المعلمين للترقية إلى مدربي ورش، وإنشاء حسابات صناع المحتوى وتعيين بيانات الدخول وصلاحيات البث.
          </p>
        </div>

        <Button
          onClick={() => setIsCreateOpen(true)}
          className="bg-[#002623] hover:bg-[#054239] text-[#EDEBE0] text-xs font-bold gap-2 rounded-xl shadow-xs shrink-0 py-5"
        >
          <UserPlus className="h-4 w-4 text-emerald-400" />
          <span>إنشاء حساب مدرب جديد 🚀</span>
        </Button>
      </div>

      {/* SECTION 1: Pending Applications */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black text-[#002623] flex items-center gap-1.5">
            <GraduationCap className="h-4 w-4 text-[#988561]" />
            <span>طلبات المعلمين للترقية لمدربي ورش عمل ({pendingApps.length})</span>
          </h4>
        </div>

        <div className="border border-[#428177]/30 rounded-2xl overflow-hidden bg-white shadow-xs">
          <Table>
            <TableHeader className="bg-[#EDEBE0]/40">
              <TableRow>
                <TableHead className="text-right text-xs font-black text-[#002623]">المعلم المتقدم</TableHead>
                <TableHead className="text-right text-xs font-black text-[#002623]">التخصص والخبرة</TableHead>
                <TableHead className="text-right text-xs font-black text-[#002623]">عنوان الورشة المقترحة</TableHead>
                <TableHead className="text-right text-xs font-black text-[#002623]">تاريخ التقديم</TableHead>
                <TableHead className="text-center text-xs font-black text-[#002623]">القرار الإداري</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingApps.length > 0 ? (
                pendingApps.map((app) => (
                  <TableRow key={app.id} className="hover:bg-[#EDEBE0]/20 text-xs">
                    <TableCell className="font-bold">
                      <div className="space-y-0.5">
                        <span className="text-[#002623] block font-black">{app.teacherName}</span>
                        <span className="text-muted-foreground text-[10px] block">@{app.username} • {app.email}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-[#054239]">{app.specialization}</span>
                        <span className="text-[10px] text-muted-foreground block">{app.experienceYears} سنوات خبرة تدريسية</span>
                      </div>
                    </TableCell>

                    <TableCell className="max-w-xs text-xs text-[#3D3A3B] font-medium">
                      {app.proposedWorkshop}
                    </TableCell>

                    <TableCell className="font-mono text-[11px] text-muted-foreground">
                      {app.submittedAt}
                    </TableCell>

                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <Button
                          size="sm"
                          onClick={() => handleApproveApplication(app)}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold h-8 rounded-lg gap-1"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>اعتماد كمدرب</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRejectApplication(app.id)}
                          className="border-rose-300 text-rose-700 hover:bg-rose-50 text-[11px] font-bold h-8 rounded-lg gap-1"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          <span>رفض</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground text-xs">
                    لا توجد طلبات ترقية معلقة حالياً من المعلمين.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* SECTION 2: Certified Trainers Directory */}
      <div className="space-y-3">
        <h4 className="text-xs font-black text-[#002623] flex items-center gap-1.5">
          <Award className="h-4 w-4 text-[#428177]" />
          <span>المدربون المعتمدون لجدولة ورش العمل ({trainers.length})</span>
        </h4>

        <div className="border border-[#428177]/30 rounded-2xl overflow-hidden bg-white shadow-xs">
          <Table>
            <TableHeader className="bg-[#EDEBE0]/40">
              <TableRow>
                <TableHead className="text-right text-xs font-black text-[#002623]">المدرب / صانع المحتوى</TableHead>
                <TableHead className="text-right text-xs font-black text-[#002623]">البريد الإلكتروني المعتمد</TableHead>
                <TableHead className="text-right text-xs font-black text-[#002623]">المجال التدريبي</TableHead>
                <TableHead className="text-right text-xs font-black text-[#002623]">ورش العمل المنفذة</TableHead>
                <TableHead className="text-center text-xs font-black text-[#002623]">صلاحية البث والورش</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trainers.map((trainer) => (
                <TableRow key={trainer.id} className="hover:bg-[#EDEBE0]/20 text-xs">
                  <TableCell className="font-bold">
                    <div className="space-y-0.5">
                      <span className="text-[#002623] block font-black">{trainer.name}</span>
                      <span className="text-muted-foreground text-[10px]">@{trainer.username}</span>
                    </div>
                  </TableCell>

                  <TableCell className="font-mono text-xs text-[#054239]">
                    {trainer.email}
                  </TableCell>

                  <TableCell className="text-xs text-[#3D3A3B] font-medium">
                    {trainer.specialization}
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline" className="border-[#428177]/40 text-[#002623] text-[10px] font-bold">
                      {trainer.workshopsCount} ورش مجدولة
                    </Badge>
                  </TableCell>

                  <TableCell className="text-center">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                      مصرح له بجدولة الورش
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modal: Create Trainer & Assign Credentials */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent dir="rtl" className="max-w-md bg-white border border-[#428177]/30 text-right rounded-3xl p-6 shadow-2xl">
          <DialogHeader className="border-b border-[#EDEBE0] pb-3">
            <DialogTitle className="text-right text-[#002623] font-black text-base flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-[#428177]" />
              <span>إنشاء ملف مدرب وتعيين بيانات الدخول</span>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateTrainerSubmit} className="space-y-3.5 pt-2">
            <div className="space-y-1">
              <Label className="text-xs font-bold text-[#002623]">اسم المدرب الكامل <span className="text-rose-600">*</span></Label>
              <Input
                placeholder="مثال: د. سمير القاسمي"
                value={trainerName}
                onChange={(e) => setTrainerName(e.target.value)}
                className="text-right text-xs border-[#428177]/40 rounded-xl"
                required
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold text-[#002623]">البريد الإلكتروني المعتمد <span className="text-rose-600">*</span></Label>
              <Input
                type="email"
                placeholder="trainer@ta3allam.app"
                value={trainerEmail}
                onChange={(e) => setTrainerEmail(e.target.value)}
                className="text-right text-xs border-[#428177]/40 rounded-xl font-mono"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs font-bold text-[#002623]">اسم المستخدم (Username) <span className="text-rose-600">*</span></Label>
                <Input
                  placeholder="samir.trainer"
                  value={trainerUsername}
                  onChange={(e) => setTrainerUsername(e.target.value)}
                  className="text-right text-xs border-[#428177]/40 rounded-xl font-mono"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold text-[#002623]">كلمة المرور المبدئية <span className="text-rose-600">*</span></Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={trainerPassword}
                  onChange={(e) => setTrainerPassword(e.target.value)}
                  className="text-right text-xs border-[#428177]/40 rounded-xl font-mono"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold text-[#002623]">المجال التدريبي والتخصص</Label>
              <Input
                placeholder="مثال: علم البيانات، الذكاء الاصطناعي، الأمن السيبراني"
                value={trainerSpecialization}
                onChange={(e) => setTrainerSpecialization(e.target.value)}
                className="text-right text-xs border-[#428177]/40 rounded-xl"
              />
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-800 font-medium space-y-0.5">
              <div className="font-bold flex items-center gap-1">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>صلاحيات تلقائية لجدولة الورش والفعاليات</span>
              </div>
              <p>سيتم تفعيل رتبة (صانع محتوى / مدرب ورش) وتمكينه من بث الجلسات في منصة الورش التفاعلية فور الدخول.</p>
            </div>

            <DialogFooter className="pt-2 flex gap-2">
              <Button
                type="submit"
                className="flex-1 bg-[#428177] hover:bg-[#054239] text-white font-bold text-xs rounded-xl shadow-xs py-5"
              >
                اعتماد وإنشاء حساب المدرب
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
                className="w-24 font-bold border-[#428177]/30 text-xs rounded-xl"
              >
                إلغاء
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
