import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Star, User, Globe } from "lucide-react";

interface CourseCardProps {
    id: number;
    name: string;
    code: string;
    category?: string;
    rating?: number;
    difficulty?: string;
    teacher?: string;
    language?: string;
    backgroundColor?: string;
    basePath?: string;
}

export function CourseCard({
    id,
    name,
    code,
    category,
    rating,
    difficulty,
    teacher,
    language,
    backgroundColor = "bg-pine-blue-500",
    basePath = "/student/courses"
}: CourseCardProps) {
    const navigate = useNavigate();

    const getDifficultyColor = (diff?: string) => {
        if (!diff) return "bg-gray-500";
        switch (diff) {
            case "مبتدئ":
                return "bg-green-500";
            case "متوسط":
                return "bg-yellow-500";
            case "متقدم":
                return "bg-red-500";
            default:
                return "bg-gray-500";
        }
    };

    return (
        <Card
            className="cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden group"
            onClick={() => navigate(`${basePath}/${id}`)}
        >
            <div className={`h-32 ${backgroundColor} flex items-center justify-center relative`}>
                <div className="text-center text-white">
                    <h3 className="text-2xl font-bold">{code}</h3>
                </div>
                {category && (
                    <Badge className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm text-white border-white/30">
                        {category}
                    </Badge>
                )}
                {difficulty && (
                    <Badge className={`absolute top-2 left-2 ${getDifficultyColor(difficulty)} text-white border-none`}>
                        {difficulty}
                    </Badge>
                )}
            </div>
            <CardHeader>
                <CardTitle className="text-right group-hover:text-primary transition-colors">{name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {rating !== undefined && (
                    <div className="flex items-center justify-end gap-1 text-sm">
                        <span className="font-medium">{rating.toFixed(1)}</span>
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    </div>
                )}

                {teacher && (
                    <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground">
                        <span>{teacher}</span>
                        <User className="h-4 w-4" />
                    </div>
                )}

                {language && (
                    <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground">
                        <span>{language}</span>
                        <Globe className="h-4 w-4" />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
