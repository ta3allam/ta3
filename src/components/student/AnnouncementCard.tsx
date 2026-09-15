import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Megaphone, Calendar, User } from "lucide-react";

interface AnnouncementCardProps {
  title: string;
  content: string;
  authorName?: string;
  createdAt: string;
  isGlobal?: boolean;
}

export function AnnouncementCard({
  title,
  content,
  authorName,
  createdAt,
  isGlobal = false
}: AnnouncementCardProps) {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ar-SY', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Card className="mb-4 border border-[#428177]/25 hover:border-[#428177]/50 transition-all duration-200 bg-white shadow-xs hover:shadow-md rounded-2xl overflow-hidden text-right" dir="rtl">
      <CardHeader className="p-5 pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base font-extrabold text-[#002623] flex items-center gap-2">
            <Megaphone className="h-4 w-4 text-[#428177]" />
            <span>{title}</span>
          </CardTitle>
          {isGlobal && (
            <Badge variant="outline" className="bg-[#6B1F2A]/10 text-[#6B1F2A] border-[#6B1F2A]/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
              إعلان عام
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-5 pt-2 space-y-3">
        <p className="text-xs text-[#3D3A3B] leading-relaxed font-medium">{content}</p>
        <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-2 border-t border-[#EDEBE0]">
          {authorName ? (
            <span className="flex items-center gap-1 font-bold text-[#002623]">
              <User className="h-3 w-3 text-[#428177]" />
              {authorName}
            </span>
          ) : <span />}
          <span className="flex items-center gap-1 font-medium">
            <Calendar className="h-3 w-3 text-[#988561]" />
            {formatDate(createdAt)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
