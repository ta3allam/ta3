import { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Search,
  GraduationCap,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  ChevronRight,
  ChevronLeft,
  UserCheck,
  ShieldAlert,
  BookOpen,
  Mail,
  MoreVertical
} from "lucide-react";
import { toast } from "sonner";
import { useCourseData } from "@/contexts/CourseContext";

export interface EnrolledStudentItem {
  id: string;
  name: string;
  email: string;
  username: string;
  courseId: number;
  courseName: string;
  courseCode: string;
  enrollmentDate: string;
  progressPercent: number;
  status: "active" | "completed" | "suspended";
}

const DEFAULT_STUDENTS: EnrolledStudentItem[] = [
  { id: "std-001", name: "سامر الحلبي", username: "samer.h", email: "samer.h@gmail.com", courseId: 1, courseName: "مقدمة في الذكاء الاصطناعي", courseCode: "CS-101", enrollmentDate: "2026-09-12", progressPercent: 85, status: "active" },
  { id: "std-002", name: "نور الهدى الشامي", username: "nour.shami", email: "nour.shami@gmail.com", courseId: 2, courseName: "هندسة البرمجيات الموزعة", courseCode: "CS-202", enrollmentDate: "2026-09-15", progressPercent: 60, status: "active" },
  { id: "std-003", name: "كريم البغدادي", username: "kareem.b", email: "kareem.b@yahoo.com", courseId: 3, courseName: "تطوير تطبيقات الويب الكاملة", courseCode: "CS-303", enrollmentDate: "2026-09-18", progressPercent: 100, status: "completed" },
  { id: "std-004", name: "عمر الدمشقي", username: "omar.d", email: "omar.d@outlook.com", courseId: 4, courseName: "أمن المعلومات والاختراق الأخلاقي", courseCode: "SEC-401", enrollmentDate: "2026-09-20", progressPercent: 40, status: "active" },
  { id: "std-005", name: "سارة العلي", username: "sara.ali", email: "sara.ali@student.ta3allam.app", courseId: 1, courseName: "مقدمة في الذكاء الاصطناعي", courseCode: "CS-101", enrollmentDate: "2026-09-22", progressPercent: 92, status: "completed" },
  { id: "std-006", name: "أحمد النجار", username: "ahmed.n", email: "ahmed.n@student.ta3allam.app", courseId: 2, courseName: "هندسة البرمجيات الموزعة", courseCode: "CS-202", enrollmentDate: "2026-09-25", progressPercent: 15, status: "suspended" },
  { id: "std-007", name: "هدى المصري", username: "houda.m", email: "houda.m@gmail.com", courseId: 1, courseName: "مقدمة في الذكاء الاصطناعي", courseCode: "CS-101", enrollmentDate: "2026-10-01", progressPercent: 45, status: "active" },
  { id: "std-008", name: "محمد الحمصي", username: "mohammed.h", email: "m.homsi@gmail.com", courseId: 3, courseName: "تطوير تطبيقات الويب الكاملة", courseCode: "CS-303", enrollmentDate: "2026-10-03", progressPercent: 78, status: "active" },
  { id: "std-009", name: "ريم اللاذقاني", username: "reem.l", email: "reem.l@outlook.com", courseId: 4, courseName: "أمن المعلومات والاختراق الأخلاقي", courseCode: "SEC-401", enrollmentDate: "2026-10-05", progressPercent: 100, status: "completed" },
  { id: "std-010", name: "باسل الطرطوسي", username: "basel.t", email: "basel.t@gmail.com", courseId: 2, courseName: "هندسة البرمجيات الموزعة", courseCode: "CS-202", enrollmentDate: "2026-10-08", progressPercent: 30, status: "active" },
  { id: "std-011", name: "منى الجبلي", username: "mouna.j", email: "mouna.j@gmail.com", courseId: 1, courseName: "مقدمة في الذكاء الاصطناعي", courseCode: "CS-101", enrollmentDate: "2026-10-10", progressPercent: 55, status: "active" },
  { id: "std-012", name: "طارق الديري", username: "tariq.d", email: "tariq.d@yahoo.com", courseId: 3, courseName: "تطوير تطبيقات الويب الكاملة", courseCode: "CS-303", enrollmentDate: "2026-10-12", progressPercent: 88, status: "active" }
];

export function RegisteredStudentsDirectory() {
  const { courseData } = useCourseData();
  const [students, setStudents] = useState<EnrolledStudentItem[]>(() => {
    const saved = localStorage.getItem("ta3_registered_students");
    return saved ? JSON.parse(saved) : DEFAULT_STUDENTS;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const saveStudents = (newStudents: EnrolledStudentItem[]) => {
    setStudents(newStudents);
    localStorage.setItem("ta3_registered_students", JSON.stringify(newStudents));
  };

  const handleStatusToggle = (studentId: string) => {
    const updated = students.map((s) => {
      if (s.id === studentId) {
        const nextStatus = s.status === "suspended" ? "active" : "suspended";
        toast.info(`تم تحديث قيد الطالب (${s.name}) إلى: ${nextStatus === "active" ? "نشط" : "معلّق"}`);
        return { ...s, status: nextStatus as "active" | "suspended" };
      }
      return s;
    });
    saveStudents(updated);
  };

  const handleExportCsv = () => {
    const headers = "ID,Name,Username,Email,CourseCode,CourseName,EnrollmentDate,Progress,Status\n";
    const rows = filteredStudents
      .map((s) => `"${s.id}","${s.name}","${s.username}","${s.email}","${s.courseCode}","${s.courseName}","${s.enrollmentDate}",${s.progressPercent}%,"${s.status}"`)
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `registered_students_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    toast.success("تم تصدير سجل الطلاب بنجاح بتنسيق CSV");
  };

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchQuery =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.courseCode.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCourse = courseFilter === "all" || String(s.courseId) === courseFilter;
      const matchStatus = statusFilter === "all" || s.status === statusFilter;

      return matchQuery && matchCourse && matchStatus;
    });
  }, [students, searchQuery, courseFilter, statusFilter]);

  const totalPages = Math.ceil(filteredStudents.length / pageSize) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredStudents.slice(start, start + pageSize);
  }, [filteredStudents, currentPage, pageSize]);

  // Aggregate stats
  const activeCount = students.filter((s) => s.status === "active").length;
  const completedCount = students.filter((s) => s.status === "completed").length;
  const avgProgress = Math.round(
    students.reduce((acc, s) => acc + s.progressPercent, 0) / (students.length || 1)
  );

  return (
    <div className="space-y-4 text-right" dir="rtl">
      {/* Top Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="bg-[#EDEBE0]/50 p-3.5 rounded-2xl border border-[#428177]/20 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-muted-foreground font-bold">إجمالي الطلاب المسجلين</div>
            <div className="text-xl font-black text-[#002623]">{students.length} طالب</div>
          </div>
          <GraduationCap className="h-6 w-6 text-[#428177]" />
        </div>

        <div className="bg-emerald-50/50 p-3.5 rounded-2xl border border-emerald-200/50 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-emerald-800 font-bold">الدارسون النشطون حالياً</div>
            <div className="text-xl font-black text-emerald-900">{activeCount}</div>
          </div>
          <CheckCircle2 className="h-6 w-6 text-emerald-600" />
        </div>

        <div className="bg-amber-50/50 p-3.5 rounded-2xl border border-amber-200/50 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-amber-800 font-bold">أتموا المقررات بنجاح</div>
            <div className="text-xl font-black text-amber-900">{completedCount}</div>
          </div>
          <BookOpen className="h-6 w-6 text-amber-600" />
        </div>

        <div className="bg-[#428177]/10 p-3.5 rounded-2xl border border-[#428177]/20 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-[#002623] font-bold">متوسط الإنجاز الأكاديمي</div>
            <div className="text-xl font-black text-[#002623]">{avgProgress}%</div>
          </div>
          <Clock className="h-6 w-6 text-[#428177]" />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-white p-3 rounded-2xl border border-[#428177]/20 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute right-3.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="بحث بالاسم، البريد، أو رمز الدورة..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pr-10 text-xs border-[#428177]/40 rounded-xl"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Course Selector Filter */}
          <Select
            value={courseFilter}
            onValueChange={(val) => {
              setCourseFilter(val);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="text-xs h-9 border-[#428177]/40 font-bold rounded-xl w-40">
              <SelectValue placeholder="تصفية بالمقرر" />
            </SelectTrigger>
            <SelectContent dir="rtl">
              <SelectItem value="all">كافة المقررات</SelectItem>
              {Object.entries(courseData).map(([id, c]) => (
                <SelectItem key={id} value={id}>
                  {c.code} — {c.name.slice(0, 20)}...
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select
            value={statusFilter}
            onValueChange={(val) => {
              setStatusFilter(val);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="text-xs h-9 border-[#428177]/40 font-bold rounded-xl w-32">
              <SelectValue placeholder="الحالة" />
            </SelectTrigger>
            <SelectContent dir="rtl">
              <SelectItem value="all">كافة الحالات</SelectItem>
              <SelectItem value="active">نشط بالدراسة</SelectItem>
              <SelectItem value="completed">مكتمل</SelectItem>
              <SelectItem value="suspended">معلّق / مجمد</SelectItem>
            </SelectContent>
          </Select>

          {/* Export CSV Button */}
          <Button
            size="sm"
            variant="outline"
            onClick={handleExportCsv}
            className="border-[#428177]/40 text-[#002623] hover:bg-[#EDEBE0] text-xs font-bold gap-1.5 h-9 rounded-xl shrink-0"
          >
            <Download className="h-3.5 w-3.5 text-[#428177]" />
            <span>تصدير CSV</span>
          </Button>
        </div>
      </div>

      {/* High-Capacity Students Data Table */}
      <div className="border border-[#428177]/30 rounded-2xl overflow-hidden bg-white shadow-xs">
        <Table>
          <TableHeader className="bg-[#EDEBE0]/40">
            <TableRow>
              <TableHead className="text-right text-xs font-black text-[#002623]">الطالب والبيانات</TableHead>
              <TableHead className="text-right text-xs font-black text-[#002623]">المقرر الملتحق به</TableHead>
              <TableHead className="text-right text-xs font-black text-[#002623]">تاريخ القيد</TableHead>
              <TableHead className="text-right text-xs font-black text-[#002623]">نسبة الإنجاز</TableHead>
              <TableHead className="text-right text-xs font-black text-[#002623]">الحالة</TableHead>
              <TableHead className="text-center text-xs font-black text-[#002623]">إجراءات القيد</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedStudents.length > 0 ? (
              paginatedStudents.map((student) => (
                <TableRow key={student.id} className="hover:bg-[#EDEBE0]/20 text-xs transition-colors">
                  <TableCell className="font-bold">
                    <div className="space-y-0.5">
                      <span className="text-[#002623] block font-black">{student.name}</span>
                      <div className="flex items-center gap-1.5 text-muted-foreground text-[10px]">
                        <span>@{student.username}</span>
                        <span>•</span>
                        <span className="font-mono">{student.email}</span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-0.5">
                      <Badge className="bg-[#002623] text-[#EDEBE0] text-[10px] font-mono">
                        {student.courseCode}
                      </Badge>
                      <span className="text-xs text-[#3D3A3B] block font-medium">
                        {student.courseName}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="font-mono text-[11px] text-[#3D3A3B]">
                    {student.enrollmentDate}
                  </TableCell>

                  <TableCell className="w-36">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold">
                        <span>{student.progressPercent}%</span>
                        <span className="text-muted-foreground">{student.progressPercent === 100 ? "مكتمل 🎓" : "قيد المتابعة"}</span>
                      </div>
                      <Progress value={student.progressPercent} className="h-1.5" />
                    </div>
                  </TableCell>

                  <TableCell>
                    {student.status === "completed" ? (
                      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-[10px] font-bold">
                        مكتمل 🏆
                      </Badge>
                    ) : student.status === "suspended" ? (
                      <Badge className="bg-rose-100 text-rose-800 border-rose-300 text-[10px] font-bold">
                        معلّق ⛔
                      </Badge>
                    ) : (
                      <Badge className="bg-teal-50 text-teal-800 border-teal-200 text-[10px] font-bold">
                        نشط بالدراسة ⚡
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="text-center">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleStatusToggle(student.id)}
                      className={`h-7 px-2.5 text-[11px] font-bold rounded-lg ${
                        student.status === "suspended"
                          ? "text-emerald-700 hover:bg-emerald-50"
                          : "text-rose-600 hover:bg-rose-50"
                      }`}
                    >
                      {student.status === "suspended" ? "تفعيل القيد" : "تجميد القيد"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  لا يوجد طلاب مطابقون لمعايير البحث والتصفية المحددة.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination Controls */}
        <div className="bg-[#EDEBE0]/30 px-4 py-2.5 border-t border-[#428177]/20 flex items-center justify-between text-xs text-[#002623] font-bold">
          <div>
            صفحة {currentPage} من {totalPages} (إجمالي النتائج: {filteredStudents.length})
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="h-7 w-7 p-0 rounded-lg border-[#428177]/30"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="h-7 w-7 p-0 rounded-lg border-[#428177]/30"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
