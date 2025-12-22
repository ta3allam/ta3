import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Video, File, Download, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LectureMaterial {
    id: number;
    title: string;
    file_url: string;
    file_type: 'pdf' | 'video' | 'document' | 'other';
    file_size?: number;
}

interface Lecture {
    id: number;
    title: string;
    description?: string;
    materials: LectureMaterial[];
}

interface LectureDetailProps {
    lecture: Lecture | null;
    isTeacher?: boolean;
    onEdit?: (lecture: Lecture) => void;
    onDelete?: (lectureId: number) => void;
}

const fileTypeIcons = {
    pdf: FileText,
    video: Video,
    document: File,
    other: File
};

export function LectureDetail({ lecture, isTeacher = false, onEdit, onDelete }: LectureDetailProps) {
    if (!lecture) {
        return (
            <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>اختر محاضرة لعرض التفاصيل</p>
            </div>
        );
    }

    const formatFileSize = (bytes?: number) => {
        if (!bytes) return '';
        const mb = bytes / (1024 * 1024);
        return `${mb.toFixed(1)} MB`;
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                        {isTeacher && onEdit && (
                            <Button size="sm" variant="outline" onClick={() => onEdit(lecture)}>
                                <Edit className="h-4 w-4 ml-1" />
                                تعديل
                            </Button>
                        )}
                        {isTeacher && onDelete && (
                            <Button size="sm" variant="destructive" onClick={() => onDelete(lecture.id)}>
                                <Trash2 className="h-4 w-4 ml-1" />
                                حذف
                            </Button>
                        )}
                    </div>
                    <CardTitle className="text-right">{lecture.title}</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {lecture.description && (
                    <div className="text-right">
                        <h4 className="font-semibold mb-2">الوصف</h4>
                        <p className="text-muted-foreground whitespace-pre-wrap">{lecture.description}</p>
                    </div>
                )}

                <div>
                    <h4 className="font-semibold mb-4 text-right">المواد التعليمية</h4>
                    {lecture.materials.length > 0 ? (
                        <div className="space-y-3">
                            {lecture.materials.map((material) => {
                                const Icon = fileTypeIcons[material.file_type];
                                return (
                                    <div
                                        key={material.id}
                                        className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors"
                                    >
                                        <Button size="sm" variant="ghost" asChild>
                                            <a href={material.file_url} download>
                                                <Download className="h-4 w-4" />
                                            </a>
                                        </Button>

                                        <div className="flex-1 text-right mx-4">
                                            <p className="font-medium">{material.title}</p>
                                            {material.file_size && (
                                                <p className="text-sm text-muted-foreground">
                                                    {formatFileSize(material.file_size)}
                                                </p>
                                            )}
                                        </div>

                                        <Icon className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-center text-muted-foreground py-8">
                            لا توجد مواد تعليمية
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
