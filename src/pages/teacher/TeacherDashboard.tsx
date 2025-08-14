import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { Upload, Megaphone } from "lucide-react";
import { useMemo, useState } from "react";

type Course = {
  id: string;
  title: string;
  students: string[];
  materials: { pdfs: string[]; videos: string[] };
  announcements: string[];
};

const initialCourses: Course[] = [
  {
    id: "t1",
    title: "علوم الحاسوب 101",
    students: ["هدى", "رامي", "غادة"],
    materials: { pdfs: ["المحاضرة1.pdf"], videos: ["مقدمة.mp4"] },
    announcements: ["امتحان قصير الأسبوع القادم"],
  },
  {
    id: "t2",
    title: "مهارات البحث العلمي",
    students: ["منى", "سالم"],
    materials: { pdfs: [], videos: [] },
    announcements: [],
  },
];

export default function TeacherDashboard() {
  const [query, setQuery] = useState("");
  const [courses, setCourses] = useState<Course[]>(initialCourses);

  const filtered = useMemo(
    () => courses.filter((c) => c.title.includes(query)),
    [courses, query]
  );

  const addMaterial = (id: string, type: "pdfs" | "videos") => {
    const name = prompt(type === "pdfs" ? "اسم ملف PDF" : "اسم ملف الفيديو (mp4)");
    if (!name) return;
    setCourses((list) =>
      list.map((c) =>
        c.id === id
          ? { ...c, materials: { ...c.materials, [type]: [...c.materials[type], name] } }
          : c
      )
    );
    toast({ title: "تم الرفع (محاكاة)", description: `أُضيف ${name}` });
  };

  const addAnnouncement = (id: string) => {
    const text = prompt("نص الإعلان:");
    if (!text) return;
    setCourses((list) => list.map((c) => (c.id === id ? { ...c, announcements: [text, ...c.announcements] } : c)));
  };

  return (
    <DashboardLayout title="لوحة التحكم - المعلم">
      <h1 className="text-3xl font-extrabold mb-4">لوحة التحكم - المعلم</h1>
      <div className="flex items-center justify-between flex-row-reverse gap-3">
        <Input
          placeholder="ابحث عن مقرر..."
          className="max-w-sm text-right"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {filtered.map((course) => (
          <Card key={course.id} className="animate-fade-in">
            <CardHeader>
              <CardTitle>{course.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="materials">
                <TabsList className="grid grid-cols-3 w-full md:w-auto">
                  <TabsTrigger value="materials">المحتوى</TabsTrigger>
                  <TabsTrigger value="students">الطلاب</TabsTrigger>
                  <TabsTrigger value="ann">الإعلانات</TabsTrigger>
                </TabsList>

                <TabsContent value="materials" className="space-y-3">
                  <div className="flex gap-2 flex-row-reverse">
                    <Button variant="outline" onClick={() => addMaterial(course.id, "pdfs")}>
                      <Upload className="ml-1" /> رفع PDF
                    </Button>
                    <Button variant="outline" onClick={() => addMaterial(course.id, "videos")}>
                      <Upload className="ml-1" /> رفع فيديو
                    </Button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <div className="font-medium mb-2">ملفات PDF</div>
                      <ul className="list-disc pr-5 space-y-1">
                        {course.materials.pdfs.length ? (
                          course.materials.pdfs.map((p, i) => <li key={i}>{p}</li>)
                        ) : (
                          <div className="text-muted-foreground">لا توجد ملفات.</div>
                        )}
                      </ul>
                    </div>
                    <div>
                      <div className="font-medium mb-2">فيديوهات MP4</div>
                      <ul className="list-disc pr-5 space-y-1">
                        {course.materials.videos.length ? (
                          course.materials.videos.map((v, i) => <li key={i}>{v}</li>)
                        ) : (
                          <div className="text-muted-foreground">لا توجد فيديوهات.</div>
                        )}
                      </ul>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="students">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">الاسم</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {course.students.map((s, i) => (
                        <TableRow key={i}><TableCell className="text-right">{s}</TableCell></TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="ann" className="space-y-3">
                  <Button variant="hero" onClick={() => addAnnouncement(course.id)}>
                    <Megaphone className="ml-1" /> نشر إعلان
                  </Button>
                  <ul className="space-y-2">
                    {course.announcements.length ? (
                      course.announcements.map((a, i) => (
                        <li key={i} className="p-3 rounded-md bg-secondary">{a}</li>
                      ))
                    ) : (
                      <div className="text-muted-foreground">لا توجد إعلانات.</div>
                    )}
                  </ul>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
