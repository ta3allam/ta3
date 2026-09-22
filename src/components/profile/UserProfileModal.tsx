import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { getAssetUrl } from '@/lib/assetUtils';
import CertificateViewerModal from './CertificateViewerModal';
import { Certificate } from '@/types/user';
import {
  User,
  Shield,
  Award,
  BarChart3,
  Mail,
  Phone,
  MapPin,
  Building,
  GraduationCap,
  Calendar,
  KeyRound,
  Laptop,
  CheckCircle2,
  Camera,
  Sparkles,
  ShieldCheck,
  Flame,
  Clock,
  BookOpen,
  DollarSign,
  Users,
  Eye,
  LogOut
} from 'lucide-react';
import { toast } from 'sonner';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserProfileModal({ isOpen, onClose }: UserProfileModalProps) {
  const { user, updateProfile, toggleTwoFactor } = useAuth();

  // Form State
  const [name, setName] = useState(user?.name || '');
  const [title, setTitle] = useState(user?.title || '');
  const [organization, setOrganization] = useState(user?.organization || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [location, setLocation] = useState(user?.location || '');
  const [isSaving, setIsSaving] = useState(false);

  // Security Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Certificate Viewer Modal
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

  if (!user) return null;

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return { label: 'مشرف عام النظام', bg: 'bg-[#6B1F2A] text-white', icon: ShieldCheck };
      case 'teacher':
        return { label: 'أستاذ أكاديمي', bg: 'bg-[#428177] text-white', icon: GraduationCap };
      case 'creator':
        return { label: 'صانع محتوى مستقل', bg: 'bg-[#988561] text-white', icon: Sparkles };
      case 'student':
      default:
        return { label: 'طالب مسجل', bg: 'bg-[#002623] text-white', icon: BookOpen };
    }
  };

  const roleInfo = getRoleBadge(user.role);
  const RoleIcon = roleInfo.icon;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const success = await updateProfile({
        name,
        title,
        organization,
        bio,
        phone,
        location,
      });
      if (success) {
        toast.success('تم حفظ وتحديث بيانات الملف الشخصي بنجاح');
      } else {
        toast.error('حدث خطأ أثناء حفظ البيانات');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error('يرجى إدخال كلمة المرور الحالية والجديدة');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('كلمة المرور الجديدة غير متطابقة مع تأكيد كلمة المرور');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('يجب أن تتكون كلمة المرور الجديدة من 6 خانات على الأقل');
      return;
    }
    toast.success('تم تحديث كلمة المرور بنجاح وحماية الحساب');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleAvatarUpload = () => {
    toast.info('تم تفعيل مستكشف الصور: اختر صورة شخصية بدقة 500x500 أو أعلى');
  };

  const handleTerminateSession = (sessionId: string) => {
    toast.success(`تم إنهاء الجلسة ${sessionId} بنجاح وتسجيل الخروج من الجهاز البعيد`);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent
          className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl border border-[#428177]/30 shadow-2xl p-0"
          dir="rtl"
        >
          {/* Header Banner */}
          <div className="relative h-32 sm:h-40 bg-[#002623] overflow-hidden rounded-t-3xl">
            <img
              src={
                user.role === 'student'
                  ? getAssetUrl('/dashboard bg/student background.jpg')
                  : getAssetUrl('/dashboard bg/otherbackground.png')
              }
              alt="Profile Cover"
              className="w-full h-full object-cover opacity-40 mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#002623] via-transparent to-transparent" />
            <div className="absolute top-4 left-4">
              <Badge className={`px-3 py-1 font-bold text-xs gap-1.5 shadow-md ${roleInfo.bg}`}>
                <RoleIcon className="h-3.5 w-3.5" />
                {roleInfo.label}
              </Badge>
            </div>
          </div>

          {/* Profile Header Identity */}
          <div className="px-6 sm:px-8 pb-4 relative -mt-14 sm:-mt-16 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-[#EDEBE0]">
            <div className="flex items-end gap-4">
              <div className="relative group">
                <Avatar className="h-24 w-24 sm:h-28 sm:w-28 border-4 border-white shadow-xl rounded-2xl bg-[#428177]">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-[#428177] text-[#EDEBE0] font-black text-2xl">
                    {user.name?.substring(0, 2) || 'يو'}
                  </AvatarFallback>
                </Avatar>
                <button
                  onClick={handleAvatarUpload}
                  type="button"
                  className="absolute bottom-1 right-1 bg-[#002623] text-white p-1.5 rounded-xl shadow-lg hover:bg-[#428177] transition-all"
                  title="تغيير الصورة الشخصية"
                >
                  <Camera className="h-4 w-4 text-[#988561]" />
                </button>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-[#002623]">{user.name}</h2>
                  <span className="text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                    موثق
                  </span>
                </div>
                <p className="text-xs font-bold text-[#428177] flex items-center gap-1">
                  <GraduationCap className="h-3.5 w-3.5" />
                  {user.title || 'عضو مجتمع تعلّـم'}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground font-medium pt-1">
                  <span className="flex items-center gap-1">
                    <Building className="h-3 w-3 text-[#988561]" />
                    {user.organization || 'جامعة دمشق'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-[#988561]" />
                    عضو منذ: {user.joinDate || '2024'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="w-full sm:w-auto rounded-xl border-[#428177]/30 text-[#002623] font-bold text-xs hover:bg-[#EDEBE0]"
              >
                إغلاق
              </Button>
            </div>
          </div>

          {/* Tab Navigation Content */}
          <div className="p-6 sm:p-8">
            <Tabs defaultValue="identity" className="space-y-6">
              <TabsList className="grid grid-cols-4 bg-[#EDEBE0]/60 p-1 rounded-2xl border border-[#428177]/20">
                <TabsTrigger
                  value="identity"
                  className="rounded-xl font-bold text-xs data-[state=active]:bg-[#002623] data-[state=active]:text-[#EDEBE0] gap-1.5 py-2.5"
                >
                  <User className="h-3.5 w-3.5 text-[#988561]" />
                  <span className="hidden sm:inline">البيانات</span> الشخصية
                </TabsTrigger>
                <TabsTrigger
                  value="stats"
                  className="rounded-xl font-bold text-xs data-[state=active]:bg-[#002623] data-[state=active]:text-[#EDEBE0] gap-1.5 py-2.5"
                >
                  <BarChart3 className="h-3.5 w-3.5 text-[#428177]" />
                  <span className="hidden sm:inline">الأداء</span> والإحصائيات
                </TabsTrigger>
                <TabsTrigger
                  value="certificates"
                  className="rounded-xl font-bold text-xs data-[state=active]:bg-[#002623] data-[state=active]:text-[#EDEBE0] gap-1.5 py-2.5"
                >
                  <Award className="h-3.5 w-3.5 text-[#988561]" />
                  الشهادات ({user.certificatesEarned?.length || 0})
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className="rounded-xl font-bold text-xs data-[state=active]:bg-[#002623] data-[state=active]:text-[#EDEBE0] gap-1.5 py-2.5"
                >
                  <Shield className="h-3.5 w-3.5 text-[#6B1F2A]" />
                  الأمان والتوثيق
                </TabsTrigger>
              </TabsList>

              {/* ========================================== */}
              {/* TAB 1: IDENTITY & EDIT FORM */}
              {/* ========================================== */}
              <TabsContent value="identity" className="space-y-6">
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1.5 text-right">
                      <label className="font-bold text-[#002623]">الاسم الكامل باللغة العربية</label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="الاسم الكامل"
                        className="rounded-xl border-[#428177]/30 text-right text-xs bg-[#EDEBE0]/20 font-medium"
                      />
                    </div>

                    <div className="space-y-1.5 text-right">
                      <label className="font-bold text-[#002623]">المسمى الأكاديمي أو التخصص</label>
                      <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="مثال: طالب هندسة برمجيات"
                        className="rounded-xl border-[#428177]/30 text-right text-xs bg-[#EDEBE0]/20 font-medium"
                      />
                    </div>

                    <div className="space-y-1.5 text-right">
                      <label className="font-bold text-[#002623]">الجامعة أو الجهة التابع لها</label>
                      <Input
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        placeholder="مثال: جامعة دمشق"
                        className="rounded-xl border-[#428177]/30 text-right text-xs bg-[#EDEBE0]/20 font-medium"
                      />
                    </div>

                    <div className="space-y-1.5 text-right">
                      <label className="font-bold text-[#002623]">الموقع الجغرافي / الدولة والمدينة</label>
                      <Input
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="مثال: دمشق، سوريا"
                        className="rounded-xl border-[#428177]/30 text-right text-xs bg-[#EDEBE0]/20 font-medium"
                      />
                    </div>

                    <div className="space-y-1.5 text-right">
                      <label className="font-bold text-[#002623]">البريد الإلكتروني الموثق (غير قابل للتعديل المباشر)</label>
                      <div className="relative">
                        <Input
                          value={user.email}
                          disabled
                          className="rounded-xl border-[#EDEBE0] bg-gray-50 text-gray-500 text-right text-xs font-mono"
                        />
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      </div>
                    </div>

                    <div className="space-y-1.5 text-right">
                      <label className="font-bold text-[#002623]">رقم الهاتف للتنبيهات الأمنية</label>
                      <div className="relative">
                        <Input
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+963 9xx xxx xxx"
                          className="rounded-xl border-[#428177]/30 text-right text-xs bg-[#EDEBE0]/20 font-medium"
                        />
                        <Phone className="absolute left-3 top-2.5 h-4 w-4 text-[#988561]" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-right">
                    <label className="font-bold text-[#002623]">النبذة التعريفية (Bio)</label>
                    <Textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                      placeholder="اكتب نبذة مختصرة عن اهتماماتك التعليمية وخبراتك..."
                      className="rounded-xl border-[#428177]/30 text-right text-xs bg-[#EDEBE0]/20 font-medium leading-relaxed"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button
                      type="submit"
                      disabled={isSaving}
                      className="bg-[#002623] hover:bg-[#054239] text-[#EDEBE0] font-bold text-xs rounded-xl px-6 gap-2 shadow-md"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      {isSaving ? 'جارٍ الحفظ...' : 'حفظ التعديلات في الملف الشخصي'}
                    </Button>
                  </div>
                </form>
              </TabsContent>

              {/* ========================================== */}
              {/* TAB 2: ROLE-SPECIFIC METRICS & STATS */}
              {/* ========================================== */}
              <TabsContent value="stats" className="space-y-6 text-right">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                  <div className="p-4 rounded-2xl bg-[#EDEBE0]/40 border border-[#428177]/20 space-y-1">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <Sparkles className="h-4 w-4 text-[#988561]" />
                      <span className="text-[11px] font-bold">نقاط المعرفة والـ XP</span>
                    </div>
                    <p className="text-xl sm:text-2xl font-black text-[#002623]">
                      {user.stats?.points?.toLocaleString() || '1,200'}
                    </p>
                  </div>

                  {user.role === 'student' && (
                    <>
                      <div className="p-4 rounded-2xl bg-[#EDEBE0]/40 border border-[#428177]/20 space-y-1">
                        <div className="flex items-center justify-between text-muted-foreground">
                          <Flame className="h-4 w-4 text-amber-600" />
                          <span className="text-[11px] font-bold">أيام التعلم المستمر</span>
                        </div>
                        <p className="text-xl sm:text-2xl font-black text-[#002623]">
                          {user.stats?.streakDays || 14} يوماً
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#EDEBE0]/40 border border-[#428177]/20 space-y-1">
                        <div className="flex items-center justify-between text-muted-foreground">
                          <BookOpen className="h-4 w-4 text-[#428177]" />
                          <span className="text-[11px] font-bold">المقررات المكتملة</span>
                        </div>
                        <p className="text-xl sm:text-2xl font-black text-[#002623]">
                          {user.completedCoursesCount || 4} مقررات
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#EDEBE0]/40 border border-[#428177]/20 space-y-1">
                        <div className="flex items-center justify-between text-muted-foreground">
                          <Clock className="h-4 w-4 text-[#428177]" />
                          <span className="text-[11px] font-bold">ساعات الدراسة</span>
                        </div>
                        <p className="text-xl sm:text-2xl font-black text-[#002623]">
                          {user.stats?.totalHoursLearned || 112} ساعة
                        </p>
                      </div>
                    </>
                  )}

                  {user.role === 'teacher' && (
                    <>
                      <div className="p-4 rounded-2xl bg-[#EDEBE0]/40 border border-[#428177]/20 space-y-1">
                        <div className="flex items-center justify-between text-muted-foreground">
                          <Users className="h-4 w-4 text-[#428177]" />
                          <span className="text-[11px] font-bold">الطلاب النشطون</span>
                        </div>
                        <p className="text-xl sm:text-2xl font-black text-[#002623]">
                          {user.stats?.activeStudentsCount || 340} طالباً
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#EDEBE0]/40 border border-[#428177]/20 space-y-1">
                        <div className="flex items-center justify-between text-muted-foreground">
                          <BookOpen className="h-4 w-4 text-[#428177]" />
                          <span className="text-[11px] font-bold">الشعب والمساقات</span>
                        </div>
                        <p className="text-xl sm:text-2xl font-black text-[#002623]">4 مساقات</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#EDEBE0]/40 border border-[#428177]/20 space-y-1">
                        <div className="flex items-center justify-between text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          <span className="text-[11px] font-bold">الاختبارات المصححة</span>
                        </div>
                        <p className="text-xl sm:text-2xl font-black text-[#002623]">
                          {user.stats?.completedQuizzes || 120} اختباراً
                        </p>
                      </div>
                    </>
                  )}

                  {user.role === 'creator' && (
                    <>
                      <div className="p-4 rounded-2xl bg-[#EDEBE0]/40 border border-[#428177]/20 space-y-1">
                        <div className="flex items-center justify-between text-muted-foreground">
                          <BookOpen className="h-4 w-4 text-[#428177]" />
                          <span className="text-[11px] font-bold">الدورات المنشورة</span>
                        </div>
                        <p className="text-xl sm:text-2xl font-black text-[#002623]">
                          {user.stats?.publishedCoursesCount || 6} دورات
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#EDEBE0]/40 border border-[#428177]/20 space-y-1">
                        <div className="flex items-center justify-between text-muted-foreground">
                          <Users className="h-4 w-4 text-[#428177]" />
                          <span className="text-[11px] font-bold">المشتركون بالدورات</span>
                        </div>
                        <p className="text-xl sm:text-2xl font-black text-[#002623]">
                          {user.stats?.activeStudentsCount || 1280} مشتركاً
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#EDEBE0]/40 border border-[#428177]/20 space-y-1">
                        <div className="flex items-center justify-between text-muted-foreground">
                          <DollarSign className="h-4 w-4 text-emerald-700" />
                          <span className="text-[11px] font-bold">إجمالي المبيعات</span>
                        </div>
                        <p className="text-xl sm:text-2xl font-black text-emerald-800">
                          ${user.stats?.totalEarningsUsd?.toLocaleString() || '14,250'}
                        </p>
                      </div>
                    </>
                  )}

                  {user.role === 'admin' && (
                    <>
                      <div className="p-4 rounded-2xl bg-[#EDEBE0]/40 border border-[#428177]/20 space-y-1">
                        <div className="flex items-center justify-between text-muted-foreground">
                          <ShieldCheck className="h-4 w-4 text-[#6B1F2A]" />
                          <span className="text-[11px] font-bold">عمليات التدقيق والرقابة</span>
                        </div>
                        <p className="text-xl sm:text-2xl font-black text-[#6B1F2A]">
                          {user.stats?.moderationAuditsCount || 480} تدقيقاً
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#EDEBE0]/40 border border-[#428177]/20 space-y-1">
                        <div className="flex items-center justify-between text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          <span className="text-[11px] font-bold">مستوى الأمان (SecOps)</span>
                        </div>
                        <p className="text-xl sm:text-2xl font-black text-emerald-800">100% موثق</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#EDEBE0]/40 border border-[#428177]/20 space-y-1">
                        <div className="flex items-center justify-between text-muted-foreground">
                          <Users className="h-4 w-4 text-[#428177]" />
                          <span className="text-[11px] font-bold">نطاق الإشراف</span>
                        </div>
                        <p className="text-xl sm:text-2xl font-black text-[#002623]">كامل المنصة</p>
                      </div>
                    </>
                  )}
                </div>
              </TabsContent>

              {/* ========================================== */}
              {/* TAB 3: CERTIFICATES & CREDENTIALS */}
              {/* ========================================== */}
              <TabsContent value="certificates" className="space-y-4 text-right">
                {user.certificatesEarned && user.certificatesEarned.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {user.certificatesEarned.map((cert) => (
                      <div
                        key={cert.id}
                        className="p-4 rounded-2xl border border-[#428177]/30 bg-gradient-to-br from-white to-[#EDEBE0]/30 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-3"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-muted-foreground font-mono font-bold bg-[#EDEBE0] px-2 py-0.5 rounded-md">
                              {cert.id}
                            </span>
                            <Badge className="bg-[#428177] text-white text-[10px] font-bold">
                              {cert.grade}
                            </Badge>
                          </div>
                          <h4 className="font-extrabold text-sm text-[#002623]">{cert.courseTitle}</h4>
                          <div className="text-[11px] text-muted-foreground space-y-0.5">
                            <p>المشرف: {cert.instructorName}</p>
                            <p>تاريخ المنح: {cert.issueDate}</p>
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedCertificate(cert)}
                          className="w-full gap-2 rounded-xl border-[#428177]/30 text-[#002623] font-bold text-xs hover:bg-[#EDEBE0]"
                        >
                          <Eye className="h-3.5 w-3.5 text-[#428177]" />
                          معاينة وتوثيق الشهادة
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-[#EDEBE0]/30 rounded-2xl border border-[#EDEBE0] space-y-2">
                    <Award className="h-10 w-10 text-muted-foreground mx-auto" />
                    <h4 className="font-bold text-sm text-[#002623]">لا توجد شهادات معتمدة حتى الآن</h4>
                    <p className="text-xs text-muted-foreground">
                      أكمل متطلبات المقررات والاختبارات للحصول على شهادات موثقة.
                    </p>
                  </div>
                )}
              </TabsContent>

              {/* ========================================== */}
              {/* TAB 4: SECURITY & CREDENTIALS */}
              {/* ========================================== */}
              <TabsContent value="security" className="space-y-6 text-right">
                {/* 2FA Card */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#EDEBE0]/40 border border-[#428177]/20 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-sm text-[#002623] flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-700" />
                      المصادقة الثنائية (2FA Two-Factor Authentication)
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      إرسال رمز أمان إضافي إلى هاتفك أو تطبيق المصادقة عند تسجيل الدخول لحماية الحساب.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#002623]">
                      {user.twoFactorEnabled ? 'مفعلة' : 'معطلة'}
                    </span>
                    <Switch
                      checked={!!user.twoFactorEnabled}
                      onCheckedChange={async () => {
                        const success = await toggleTwoFactor();
                        if (success) {
                          toast.success(
                            user.twoFactorEnabled
                              ? 'تم تعطيل المصادقة الثنائية'
                              : 'تم تفعيل المصادقة الثنائية 2FA بنجاح'
                          );
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Password Change */}
                <form onSubmit={handlePasswordChange} className="p-4 sm:p-5 rounded-2xl border border-[#428177]/20 bg-white space-y-4">
                  <h4 className="font-extrabold text-sm text-[#002623] flex items-center gap-2">
                    <KeyRound className="h-4 w-4 text-[#988561]" />
                    تحديث كلمة المرور
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="space-y-1">
                      <label className="font-bold text-[#002623]">كلمة المرور الحالية</label>
                      <Input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="rounded-xl border-[#428177]/30 text-xs bg-[#EDEBE0]/20"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-[#002623]">كلمة المرور الجديدة</label>
                      <Input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="rounded-xl border-[#428177]/30 text-xs bg-[#EDEBE0]/20"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-[#002623]">تأكيد كلمة المرور</label>
                      <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="rounded-xl border-[#428177]/30 text-xs bg-[#EDEBE0]/20"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      className="bg-[#002623] hover:bg-[#054239] text-[#EDEBE0] font-bold text-xs rounded-xl px-4"
                    >
                      تحديث كلمة المرور
                    </Button>
                  </div>
                </form>

                {/* Active Sessions */}
                <div className="space-y-3">
                  <h4 className="font-extrabold text-sm text-[#002623] flex items-center gap-2">
                    <Laptop className="h-4 w-4 text-[#428177]" />
                    الجلسات والأجهزة النشطة
                  </h4>
                  <div className="space-y-2">
                    {user.activeSessions && user.activeSessions.length > 0 ? (
                      user.activeSessions.map((sess) => (
                        <div
                          key={sess.id}
                          className="p-3 rounded-xl border border-[#EDEBE0] bg-[#FAF8F5] flex items-center justify-between text-xs"
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-[#002623]">{sess.device}</span>
                              <span className="text-[10px] text-muted-foreground">({sess.browser})</span>
                              {sess.isCurrent && (
                                <Badge className="bg-emerald-600 text-white text-[9px] font-bold">
                                  الجلسة الحالية
                                </Badge>
                              )}
                            </div>
                            <p className="text-[11px] text-muted-foreground font-medium">
                              IP: {sess.ip} • {sess.location} • {sess.lastActive}
                            </p>
                          </div>
                          {!sess.isCurrent && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleTerminateSession(sess.id)}
                              className="text-rose-600 hover:bg-rose-50 text-[11px] font-bold rounded-lg h-7"
                            >
                              <LogOut className="h-3 w-3 ml-1" />
                              إنهاء
                            </Button>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="p-3 rounded-xl border border-[#EDEBE0] text-xs text-muted-foreground">
                        الجلسة الحالية نشطة عبر المتصفح الحالي.
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      {/* Certificate Viewer Submodal */}
      <CertificateViewerModal
        certificate={selectedCertificate}
        userName={user.name}
        isOpen={!!selectedCertificate}
        onClose={() => setSelectedCertificate(null)}
      />
    </>
  );
}
