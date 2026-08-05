import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { User, Globe, CalendarDays } from "lucide-react";

interface CourseCardProps {
  id: number;
  name: string;
  code: string;
  category?: string;
  period?: string;
  difficulty?: string;
  teacher?: string;
  language?: string;
  backgroundColor?: string;
  bgImage?: string;
  basePath?: string;
}

export function CourseCard({
  id,
  name,
  code,
  category,
  period = "صيف 2026",
  difficulty,
  teacher,
  language,
  backgroundColor = "bg-[#428177]",
  bgImage,
  basePath = "/student/courses",
}: CourseCardProps) {
  const navigate = useNavigate();

  const getDifficultyColor = (diff?: string) => {
    if (!diff) return "bg-[#3D3A3B]";
    switch (diff) {
      case "مبتدئ":
        return "bg-[#428177]";
      case "متوسط":
        return "bg-[#988561]";
      case "متقدم":
        return "bg-[#6B1F2A]";
      default:
        return "bg-[#3D3A3B]";
    }
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden group bg-white border border-[#428177]/40 rounded-2xl"
      onClick={() => navigate(`${basePath}/${id}`)}
      dir="rtl"
    >
      <div
        className={`h-36 ${backgroundColor} relative flex items-center justify-center overflow-hidden`}
        style={
          bgImage
            ? {
                backgroundImage: `linear-gradient(to bottom, rgba(0, 38, 35, 0.45), rgba(0, 38, 35, 0.85)), url(${bgImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      >
        <div className="text-center text-white z-10 px-4">
          <h3 className="text-2xl font-black tracking-wide drop-shadow-md text-[#EDEBE0]">{code}</h3>
        </div>
        {category && (
          <Badge className="absolute top-3 right-3 bg-white/20 backdrop-blur-md text-white border border-white/30 text-xs font-bold">
            {category}
          </Badge>
        )}
        {difficulty && (
          <Badge className={`absolute top-3 left-3 ${getDifficultyColor(difficulty)} text-white border-none text-xs font-bold`}>
            {difficulty}
          </Badge>
        )}
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-right text-lg font-bold text-[#002623] group-hover:text-[#428177] transition-colors">
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        {/* Period badge (e.g. صيف 2026) replacing rating */}
        <div className="flex items-center justify-end gap-1.5 font-bold text-[#428177] bg-[#428177]/10 px-2.5 py-1 rounded-lg border border-[#428177]/20 w-fit mr-auto">
          <span>{period}</span>
          <CalendarDays className="h-3.5 w-3.5 text-[#428177]" />
        </div>

        {teacher && (
          <div className="flex items-center justify-end gap-2 text-[#3D3A3B] font-medium">
            <span>{teacher}</span>
            <User className="h-3.5 w-3.5 text-[#428177]" />
          </div>
        )}

        {language && (
          <div className="flex items-center justify-end gap-2 text-[#3D3A3B] font-medium">
            <span>{language}</span>
            <Globe className="h-3.5 w-3.5 text-[#428177]" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
