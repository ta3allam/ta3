import { useState } from "react";
import { ChevronDown, ChevronRight, FileText, Video, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

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

interface LecturesListProps {
    lectures: Lecture[];
    selectedLectureId?: number;
    onSelectLecture: (lectureId: number) => void;
}

const fileTypeIcons = {
    pdf: FileText,
    video: Video,
    document: File,
    other: File
};

export function LecturesList({ lectures, selectedLectureId, onSelectLecture }: LecturesListProps) {
    const [expandedLectures, setExpandedLectures] = useState<Set<number>>(new Set());

    const toggleLecture = (lectureId: number) => {
        const newExpanded = new Set(expandedLectures);
        if (newExpanded.has(lectureId)) {
            newExpanded.delete(lectureId);
        } else {
            newExpanded.add(lectureId);
        }
        setExpandedLectures(newExpanded);
        onSelectLecture(lectureId);
    };

    const formatFileSize = (bytes?: number) => {
        if (!bytes) return '';
        const mb = bytes / (1024 * 1024);
        return `${mb.toFixed(1)} MB`;
    };

    return (
        <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-2">
                {lectures.map((lecture) => {
                    const isExpanded = expandedLectures.has(lecture.id);
                    const isSelected = selectedLectureId === lecture.id;

                    return (
                        <div key={lecture.id} className="space-y-1">
                            <Button
                                variant={isSelected ? "secondary" : "ghost"}
                                className="w-full justify-between text-right"
                                onClick={() => toggleLecture(lecture.id)}
                            >
                                <span className="flex items-center gap-2">
                                    {isExpanded ? (
                                        <ChevronDown className="h-4 w-4" />
                                    ) : (
                                        <ChevronRight className="h-4 w-4" />
                                    )}
                                </span>
                                <span className="flex-1 text-right">{lecture.title}</span>
                            </Button>

                            {isExpanded && lecture.materials.length > 0 && (
                                <div className="mr-6 space-y-1">
                                    {lecture.materials.map((material) => {
                                        const Icon = fileTypeIcons[material.file_type];
                                        return (
                                            <Button
                                                key={material.id}
                                                variant="ghost"
                                                size="sm"
                                                className="w-full justify-end text-sm"
                                                asChild
                                            >
                                                <a href={material.file_url} download className="flex items-center gap-2">
                                                    <span className="text-xs text-muted-foreground">
                                                        {formatFileSize(material.file_size)}
                                                    </span>
                                                    <span className="flex-1 text-right truncate">{material.title}</span>
                                                    <Icon className="h-3 w-3 flex-shrink-0" />
                                                </a>
                                            </Button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </ScrollArea>
    );
}
