import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

export interface RequestItem {
  id: number;
  student: string;
  course: string;
}

interface CourseRequestsTableProps {
  requests: RequestItem[];
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}

export const CourseRequestsTable: React.FC<CourseRequestsTableProps> = ({
  requests,
  onApprove,
  onReject,
}) => {
  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      <Table dir="rtl">
        <TableHeader>
          <TableRow>
            <TableHead className="text-right">#</TableHead>
            <TableHead className="text-right">اسم الطالب</TableHead>
            <TableHead className="text-right">المقرر المطلوب</TableHead>
            <TableHead className="text-center">الإجراء</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                لا توجد طلبات تسجيل معلقة حالياً.
              </TableCell>
            </TableRow>
          ) : (
            requests.map((req, idx) => (
              <TableRow key={req.id}>
                <TableCell className="font-semibold text-muted-foreground">{idx + 1}</TableCell>
                <TableCell className="font-medium">{req.student}</TableCell>
                <TableCell>{req.course}</TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onApprove(req.id)}
                      className="text-primary border-primary/30 hover:bg-primary/10"
                    >
                      <Check className="h-4 w-4 ml-1" />
                      قبول
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onReject(req.id)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <X className="h-4 w-4 ml-1" />
                      رفض
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
