import { useState, useMemo } from "react";
import { ChevronDown, ChevronRight, FileText, Video, File, Search, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import MaterialViewerModal, { MaterialItem } from "@/components/courses/MaterialViewerModal";

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
  other: File,
};

export function LecturesList({ lectures, selectedLectureId, onSelectLecture }: LecturesListProps) {
  const [expandedLectures, setExpandedLectures] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [viewingMaterial, setViewingMaterial] = useState<MaterialItem | null>(null);

  const filteredLectures = useMemo(() => {
    if (!searchQuery.trim()) return lectures;
    const query = searchQuery.toLowerCase().trim();
    return lectures.filter((l) => {
      const matchTitle = l.title.toLowerCase().includes(query);
      const matchDesc = l.description?.toLowerCase().includes(query);
      const matchMaterial = l.materials?.some((m) => m.title.toLowerCase().includes(query));
      return matchTitle || matchDesc || matchMaterial;
    });
  }, [lectures, searchQuery]);

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

  const openMaterialPreview = (material: LectureMaterial, e: React.MouseEvent) => {
    e.stopPropagation();
    setViewingMaterial({
      id: material.id,
      name: material.title,
      type: material.file_type,
      url: material.file_url,
      size: formatFileSize(material.file_size),
    });
  };

  return (
    <div className="space-y-3" dir="rtl">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute right-3 top-2.5 h-4 w-4 text-[#3D3A3B]" />
        <Input
          placeholder="بحث في المحاضرات..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-9 text-right bg-white border-[#428177]/30 text-[#002623] placeholder:text-[#3D3A3B]"
        />
      </div>

      <ScrollArea className="h-[520px] pr-2">
        <div className="space-y-2">
          {filteredLectures.length > 0 ? (
            filteredLectures.map((lecture) => {
              const isExpanded = expandedLectures.has(lecture.id);
              const isSelected = selectedLectureId === lecture.id;

              return (
                <div key={lecture.id} className="space-y-1">
                  <Button
                    variant="ghost"
                    className={`w-full justify-between text-right font-semibold border ${
                      isSelected
                        ? "bg-[#428177]/10 text-[#002623] border-[#428177]"
                        : "bg-white border-[#EDEBE0] text-[#002623] hover:bg-[#EDEBE0]/50"
                    }`}
                    onClick={() => toggleLecture(lecture.id)}
                  >
                    <span className="flex items-center gap-2">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-[#428177]" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-[#428177]" />
                      )}
                    </span>
                    <span className="flex-1 text-right truncate">{lecture.title}</span>
                  </Button>

                  {isExpanded && lecture.materials && lecture.materials.length > 0 && (
                    <div className="mr-4 space-y-1 border-r-2 border-[#428177]/30 pr-2">
                      {lecture.materials.map((material) => {
                        const Icon = fileTypeIcons[material.file_type];
                        return (
                          <div
                            key={material.id}
                            className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#EDEBE0] hover:border-[#428177]/40 transition-colors text-xs text-[#002623]"
                          >
                            <div className="flex items-center gap-2 flex-1 truncate">
                              <Icon className="h-4 w-4 text-[#428177] flex-shrink-0" />
                              <span className="truncate font-medium">{material.title}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-[#3D3A3B]">
                                {formatFileSize(material.file_size)}
                              </span>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 px-2 text-[#428177] hover:bg-[#428177]/10"
                                onClick={(e) => openMaterialPreview(material, e)}
                              >
                                <Eye className="h-3.5 w-3.5 ml-1" />
                                معاينة
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-xs text-[#3D3A3B]">
              لا توجد نتائج مطابقة للبحث
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Material Viewer Modal */}
      <MaterialViewerModal
        open={!!viewingMaterial}
        onOpenChange={(open) => !open && setViewingMaterial(null)}
        material={viewingMaterial}
      />
    </div>
  );
}
