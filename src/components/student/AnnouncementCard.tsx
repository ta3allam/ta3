import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
        const date = new Date(dateString);
        return date.toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <Card className="mb-4">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-right">{title}</CardTitle>
                    {isGlobal && (
                        <Badge variant="secondary">إعلان عام</Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-2">
                <p className="text-right text-muted-foreground">{content}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    {authorName && <span>{authorName}</span>}
                    <span>{formatDate(createdAt)}</span>
                </div>
            </CardContent>
        </Card>
    );
}
