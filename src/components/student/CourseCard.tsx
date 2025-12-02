import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

interface CourseCardProps {
    id: number;
    name: string;
    code: string;
    progress: number;
    backgroundColor?: string;
    basePath?: string; // e.g., "/student/courses" or "/teacher/courses"
}

export function CourseCard({
    id,
    name,
    code,
    progress,
    backgroundColor = "bg-pine-blue-500",
    basePath = "/student/courses"
}: CourseCardProps) {
    const navigate = useNavigate();

    return (
        <Card
            className="cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden"
            onClick={() => navigate(`${basePath}/${id}`)}
        >
            <div className={`h-32 ${backgroundColor} flex items-center justify-center`}>
                <div className="text-center text-white">
                    <h3 className="text-2xl font-bold">{code}</h3>
                </div>
            </div>
            <CardHeader>
                <CardTitle className="text-right">{name}</CardTitle>
            </CardHeader>
            <CardContent>
                <div>
                    <div className="mb-2 text-sm text-muted-foreground text-right">التقدم</div>
                    <Progress value={progress} />
                    <div className="mt-1 text-xs text-muted-foreground text-right">{progress}%</div>
                </div>
            </CardContent>
        </Card>
    );
}
