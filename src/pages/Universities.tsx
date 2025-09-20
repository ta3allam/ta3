import db from './DB.json';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Input } from "@/components/ui/input";
// import { useState } from 'react';
import damascusImg from '../components/assets/damas.jpg';
import alpImg from '../components/assets/alp.jpg';
import tishImg from '../components/assets/tish.jpg';
import homsImg from '../components/assets/homs.jpg';
import feratImg from '../components/assets/ferat.jpg';

const universityImages: Record<number, string> = {
  1: damascusImg,
  2: alpImg,
  3: tishImg,
  4: homsImg,
  5: feratImg,
};
// const [query, setQuery] = useState("");


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
        </DashboardLayout>
  );
}
