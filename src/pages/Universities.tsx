import db from './DB.json';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import TopBar from '../components/topbar/TopBar';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider } from '../components/ui/sidebar';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Input } from "@/components/ui/input";
// import { useState } from 'react';

// const [query, setQuery] = useState("");

// Use external image URLs for university backgrounds
const universityImages: Record<number, string> = {
  1: 'https://images.unsplash.com/photo-1464983953574-0892a716854b',
  2: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
  3: 'https://images.unsplash.com/photo-1513258496099-48168024aec0',
  4: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
  5: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99',
};

export default function UniversitiesPage() {
  const universities = db.universities;
  const navigate = useNavigate();

  return (
    <DashboardLayout title="الجامعات السورية">
      <h1 className="text-3xl font-extrabold mb-4 text-center">الجامعات السورية</h1>
      <div className="flex items-center justify-between flex-row-reverse gap-3">
        <Input
          placeholder="ابحث عن جامعة..."
          className="max-w-sm text-right"
        //   value={query}
        //   onChange={(e) => setQuery(e.target.value)}
        />
      </div>
    <SidebarProvider>
      <div className="min-h-screen bg-background">
        <div className="p-8 max-w-7xl mx-auto">
        
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {universities.map((uni) => (
              <Card
                key={uni.id}
                className="relative overflow-hidden group cursor-pointer bg-card text-card-foreground border shadow-md hover:shadow-lg transition"
                onClick={() => navigate(`/universities/${uni.id}`)}
              >
                <img
                  src={universityImages[uni.id] || 'https://images.unsplash.com/photo-1464983953574-0892a716854b'}
                  alt={uni.name}
                  className="w-full h-40 object-cover opacity-80 group-hover:opacity-100 transition"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-end p-4">
                  <h2 className="text-xl font-semibold text-white mb-2">{uni.name}</h2>
                  <Button variant="secondary" className="w-full">عرض الكليات</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </SidebarProvider>
        </DashboardLayout>

  );
}
