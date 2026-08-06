import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, BookOpen } from 'lucide-react';

export interface CourseCatalogItem {
  id: string;
  code?: string;
  title: string;
  teacher?: string;
  category?: string;
  students: number;
}

interface CourseCatalogTableProps {
  courses: CourseCatalogItem[];
  onAddCourse: (course: { name: string; code: string; category: string; teacher: string }) => void;
}

export const CourseCatalogTable: React.FC<CourseCatalogTableProps> = ({ courses, onAddCourse }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState('');
  const [teacher, setTeacher] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;
    onAddCourse({
      name: name.trim(),
      code: code.trim(),
      category: category.trim() || 'عام',
      teacher: teacher.trim() || 'د. خالد'
    });
    setName('');
    setCode('');
    setCategory('');
    setTeacher('');
    setOpen(false);
  };

  return (
    <div className="space-y-4 text-right" dir="rtl">
      <div className="flex justify-between items-center border-b border-[#428177]/20 pb-3">
        <h3 className="text-lg font-bold text-[#002623]">دليل المقررات الأكاديمية (إدارة المسؤول)</h3>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#428177] hover:bg-[#054239] text-white font-bold flex items-center gap-1">
              <Plus className="h-4 w-4 ml-1" />
              إنشاء مقرر جديد
            </Button>
          </DialogTrigger>
          <DialogContent dir="rtl" className="bg-white border border-[#428177]">
            <DialogHeader>
              <DialogTitle className="text-right text-[#002623]">إنشاء مقرر أكاديمي جديد</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4 text-right">
              <div className="space-y-1.5">
                <Label htmlFor="c-name" className="text-xs font-semibold text-[#002623]">اسم المقرر الدراسي</Label>
                <Input
                  id="c-name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-right border-[#428177]/40 focus-visible:ring-[#428177]"
                  placeholder="مثال: مبادئ الذكاء الاصطناعي"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="c-code" className="text-xs font-semibold text-[#002623]">رمز المقرر (الرمز الأكاديمي)</Label>
                <Input
                  id="c-code"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="text-right border-[#428177]/40 focus-visible:ring-[#428177]"
                  placeholder="مثال: AI101"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="c-category" className="text-xs font-semibold text-[#002623]">التصنيف الأكاديمي</Label>
                <Input
                  id="c-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="text-right border-[#428177]/40 focus-visible:ring-[#428177]"
                  placeholder="مثال: علوم الحاسب"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="c-teacher" className="text-xs font-semibold text-[#002623]">أستاذ المقرر المسؤول</Label>
                <Input
                  id="c-teacher"
                  value={teacher}
                  onChange={(e) => setTeacher(e.target.value)}
                  className="text-right border-[#428177]/40 focus-visible:ring-[#428177]"
                  placeholder="مثال: د. خالد العمري"
                />
              </div>
              <Button type="submit" className="w-full bg-[#428177] hover:bg-[#054239] text-white font-bold mt-2">
                تأكيد واعتماد المقرر
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border border-[#428177]/30 rounded-2xl overflow-hidden bg-white shadow-sm">
        <Table dir="rtl">
          <TableHeader className="bg-[#EDEBE0]/40">
            <TableRow>
              <TableHead className="text-right font-bold text-[#002623]">#</TableHead>
              <TableHead className="text-right font-bold text-[#002623]">الرمز</TableHead>
              <TableHead className="text-right font-bold text-[#002623]">عنوان المقرر</TableHead>
              <TableHead className="text-right font-bold text-[#002623]">المعلم المسؤول</TableHead>
              <TableHead className="text-center font-bold text-[#002623]">عدد الطلاب</TableHead>
              <TableHead className="text-center font-bold text-[#002623]">الحالة</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course, idx) => (
              <TableRow key={course.id} className="hover:bg-[#EDEBE0]/20 transition-colors">
                <TableCell className="font-semibold text-[#3D3A3B]">{idx + 1}</TableCell>
                <TableCell className="font-bold text-[#428177]">{course.code || 'CS100'}</TableCell>
                <TableCell className="font-bold text-[#002623]">{course.title}</TableCell>
                <TableCell className="font-semibold text-[#3D3A3B]">{course.teacher || 'د. خالد'}</TableCell>
                <TableCell className="text-center font-bold text-[#002623]">{course.students} طالب</TableCell>
                <TableCell className="text-center">
                  <Badge className="bg-[#428177]/15 text-[#054239] border border-[#428177]/30 font-bold">
                    معتمد
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
