import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";

interface CourseEvent {
  id: number;
  title: string;
  description?: string;
  event_type: 'assignment' | 'quiz' | 'exam' | 'other';
  due_date: string;
}

interface CourseEventsProps {
  events: CourseEvent[];
}

const eventTypeColors = {
  assignment: "bg-[#428177]",
  quiz: "bg-[#988561]",
  exam: "bg-[#6B1F2A]",
  other: "bg-[#3D3A3B]"
};

const eventTypeLabels = {
  assignment: "واجب",
  quiz: "اختبار قصير",
  exam: "امتحان",
  other: "أخرى"
};

/**
 * Format date using standard Western/Arabic digits (1, 2, 3, 4, 5, 6, 7, 8, 9, 0)
 */
function formatStandardDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
}

function formatStandardTime(dateString: string): string {
  const date = new Date(dateString);
  const hours = String(date.getHours()).padStart(2, '0');
  const mins = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${mins}`;
}

export function CourseEvents({ events }: CourseEventsProps) {
  const sortedEvents = [...events].sort((a, b) =>
    new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
  );

  return (
    <div className="space-y-4" dir="rtl">
      <h3 className="text-lg font-bold text-right text-[#002623]">الأحداث القادمة</h3>
      {sortedEvents.length > 0 ? (
        sortedEvents.map((event) => (
          <Card key={event.id} className="bg-white border border-[#428177]/30 rounded-2xl hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge className={`${eventTypeColors[event.event_type]} text-white border-none font-bold text-xs`}>
                  {eventTypeLabels[event.event_type]}
                </Badge>
                <CardTitle className="text-sm font-bold text-[#002623] text-right">{event.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {event.description && (
                <p className="text-xs text-[#3D3A3B] text-right font-medium">
                  {event.description}
                </p>
              )}
              <div className="flex items-center justify-start gap-4 text-[11px] text-[#3D3A3B] font-bold border-t border-[#EDEBE0] pt-2">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-[#428177]" />
                  <span>{formatStandardDate(event.due_date)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-[#988561]" />
                  <span>{formatStandardTime(event.due_date)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="text-center py-8 text-xs text-[#3D3A3B] bg-white border border-dashed border-[#428177]/30 rounded-2xl">
          لا توجد أحداث قادمة
        </div>
      )}
    </div>
  );
}
