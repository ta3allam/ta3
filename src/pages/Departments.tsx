import React from 'react';
import db from './DB.json';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Input } from "@/components/ui/input";
// import { useState } from 'react';
// const [query, setQuery] = useState("");


const departmentImages: Record<number, string> = {
  1: 'https://images.unsplash.com/photo-1464983953574-0892a716854b',
  2: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
  3: 'https://images.unsplash.com/photo-1513258496099-48168024aec0',
  4: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
  5: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99',
};

export default function DepartmentsPage() {
  const { universityId } = useParams<{ universityId: string }>();
  const navigate = useNavigate();
  const departments = db.departments.filter(
    (dep) => dep.university_id === Number(universityId)
  );

  return (
    <DashboardLayout title="الكليات">
      <h1 className="text-3xl font-extrabold mb-4 text-center">الكليات</h1>
      <div className="flex items-center justify-between flex-row-reverse gap-3">
        <Input
          placeholder="ابحث عن كلية..."
          className="max-w-sm text-right"
        //   value={query}
        //   onChange={(e) => setQuery(e.target.value)}
        />
      </div>
    <div className="p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {departments.map((dep) => (
          <Card key={dep.id} className="relative overflow-hidden group cursor-pointer bg-card text-card-foreground border shadow-md" onClick={() => navigate(`/departments/${dep.id}`)}>
            <img
              src={departmentImages[dep.id] || 'https://images.unsplash.com/photo-1464983953574-0892a716854b'}
              alt={dep.name}
              className="w-full h-40 object-cover opacity-80 group-hover:opacity-100 transition"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-end p-4">
              <h2 className="text-xl font-semibold text-white mb-2">{dep.name}</h2>
              <Button variant="secondary" className="w-full">عرض المقررات</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
    </DashboardLayout>
    );
  
}
