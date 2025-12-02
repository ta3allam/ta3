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
    assignment: "bg-pine-blue-500",
    quiz: "bg-rich-mahogany-500",
    exam: "bg-wine-plum-500",
    other: "bg-secondary"
};

const eventTypeLabels = {
    assignment: "واجب",
    quiz: "اختبار قصير",
    exam: "امتحان",
    other: "أخرى"
};

export function CourseEvents({ events }: CourseEventsProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ar-EG', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('ar-EG', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const sortedEvents = [...events].sort((a, b) =>
        new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
    );

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-right">الأحداث القادمة</h3>
            {sortedEvents.length > 0 ? (
                sortedEvents.map((event) => (
                    <Card key={event.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <Badge className={eventTypeColors[event.event_type]}>
                                    {eventTypeLabels[event.event_type]}
                                </Badge>
                                <CardTitle className="text-base text-right">{event.title}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {event.description && (
                                <p className="text-sm text-muted-foreground text-right">
                                    {event.description}
                                </p>
                            )}
                            <div className="flex items-center justify-end gap-4 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <span>{formatTime(event.due_date)}</span>
                                    <Clock className="h-3 w-3" />
                                </div>
                                <div className="flex items-center gap-1">
                                    <span>{formatDate(event.due_date)}</span>
                                    <Calendar className="h-3 w-3" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))
            ) : (
                <div className="text-center py-8 text-muted-foreground">
                    لا توجد أحداث قادمة
                </div>
            )}
        </div>
    );
}
