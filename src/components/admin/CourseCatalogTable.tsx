import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';

export interface CourseCatalogItem {
  id: string;
  title: string;
  students: number;
}

interface CourseCatalogTableProps {
  courses: CourseCatalogItem[];
  onAddCourse: (title: string) => void;
}

export const CourseCatalogTable: React.FC<CourseCatalogTableProps> = ({ courses, onAddCourse }) => {
  const [newCourseTitle, setNewCourseTitle] = useState('');

  const handleAdd = () => {
    if (!newCourseTitle.trim()) return;
    onAddCourse(newCourseTitle.trim());
    setNewCourseTitle('');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Input
            placeholder="اسم المقرر الجديد..."
            value={newCourseTitle}
            onChange={(e) => setNewCourseTitle(e.target.value)}
            className="max-w-xs text-right"
          />
          <Button onClick={handleAdd} className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            إضافة مقرر
          </Button>
        </div>
      </div>

      <div className="border border-border rounded-lg overflow-hidden bg-card">
        <Table dir="rtl">
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">#</TableHead>
              <TableHead className="text-right">عنوان المقرر</TableHead>
              <TableHead className="text-center">عدد الطلاب المسجلين</TableHead>
              <TableHead className="text-center">الحالة</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course, idx) => (
              <TableRow key={course.id}>
                <TableCell className="font-semibold text-muted-foreground">{idx + 1}</TableCell>
                <TableCell className="font-medium">{course.title}</TableCell>
                <TableCell className="text-center font-semibold">{course.students} طالب</TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline" className="text-primary border-primary/30">
                    نشط
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
