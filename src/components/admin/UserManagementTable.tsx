import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2 } from 'lucide-react';
import UserManagementDialog from './UserManagementDialog';

export interface UserItem {
  id: number;
  name: string;
  role: string;
  username: string;
}

interface UserManagementTableProps {
  users: UserItem[];
  onAddUser: (user: { name: string; username: string; role: string }) => void;
  onDeleteUser: (id: number) => void;
}

export const UserManagementTable: React.FC<UserManagementTableProps> = ({
  users,
  onAddUser,
  onDeleteUser,
}) => {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <Input
          placeholder="ابحث بالاسم أو اسم المستخدم..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs text-right"
        />
        <Button onClick={() => setIsAddUserOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          إضافة مستخدم جديد
        </Button>
      </div>

      <div className="border border-border rounded-lg overflow-hidden bg-card">
        <Table dir="rtl">
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">#</TableHead>
              <TableHead className="text-right">الاسم الكامل</TableHead>
              <TableHead className="text-right">اسم المستخدم</TableHead>
              <TableHead className="text-right">الدور</TableHead>
              <TableHead className="text-center">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  لا يوجد مستخدمون مطابقون للبحث.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user, idx) => (
                <TableRow key={user.id}>
                  <TableCell className="font-semibold text-muted-foreground">{idx + 1}</TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell dir="ltr" className="text-right font-mono text-xs">
                    {user.username}
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'طالب' ? 'secondary' : 'default'}>{user.role}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteUser(user.id)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <UserManagementDialog
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        onSave={(user) => {
          onAddUser(user);
          setIsAddUserOpen(false);
        }}
      />
    </div>
  );
};
