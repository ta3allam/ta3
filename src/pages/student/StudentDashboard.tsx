import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";

const courses = [
  {
    id: "s1",
    title: "مبادئ البرمجة",
    progress: 65,
    materials: { pdfs: ["أساسيات.pdf"], videos: ["مقدمة.mp4", "الحلقة2.mp4"] },
    announcements: ["تسليم الواجب يوم الخميس"],
  },
  {
    id: "s2",
    title: "الرياضيات المتقدمة",
    progress: 30,
    materials: { pdfs: [], videos: [] },
    announcements: [],
  },
];

export default function StudentDashboard() {
  const open = (name: string) => toast({ title: "فتح (محاكاة)", description: name });

  return (
    <DashboardLayout title="لوحة التحكم - الطالب">
      <h1 className="text-3xl font-extrabold mb-4">لوحة التحكم - الطالب</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {courses.map((c) => (
          <Card key={c.id} className="animate-fade-in">
            <CardHeader>
              <CardTitle>{c.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="mb-2 text-sm text-muted-foreground">التقدم</div>
                <Progress value={c.progress} />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="font-medium mb-2">ملفات PDF</div>
                  <ul className="list-disc pr-5 space-y-1">
                    {c.materials.pdfs.length ? (
                      c.materials.pdfs.map((p, i) => (
                        <li key={i}><Button variant="link" onClick={() => open(p)}>{p}</Button></li>
                      ))
                    ) : (
                      <div className="text-muted-foreground">لا توجد ملفات.</div>
                    )}
                  </ul>
                </div>
                <div>
                  <div className="font-medium mb-2">فيديوهات MP4</div>
                  <ul className="list-disc pr-5 space-y-1">
                    {c.materials.videos.length ? (
                      c.materials.videos.map((v, i) => (
                        <li key={i}><Button variant="link" onClick={() => open(v)}>{v}</Button></li>
                      ))
                    ) : (
                      <div className="text-muted-foreground">لا توجد فيديوهات.</div>
                    )}
                  </ul>
                </div>
              </div>
              <div>
                <div className="font-medium mb-2">الإعلانات</div>
                {c.announcements.length ? (
                  <ul className="space-y-2">
                    {c.announcements.map((a, i) => (
                      <li key={i} className="p-3 rounded-md bg-secondary">{a}</li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-muted-foreground">لا توجد إعلانات.</div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
