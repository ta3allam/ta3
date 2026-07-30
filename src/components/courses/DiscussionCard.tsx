import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Send, User } from "lucide-react";

export interface DiscussionComment {
  id: number;
  content: string;
  authorName: string;
  authorRole: 'student' | 'teacher' | 'admin';
  createdAt: string;
}

export interface DiscussionPost {
  id: number;
  title: string;
  content: string;
  authorName: string;
  authorRole: 'student' | 'teacher' | 'admin';
  createdAt: string;
  comments: DiscussionComment[];
}

interface DiscussionCardProps {
  post: DiscussionPost;
  onAddComment: (postId: number, commentText: string) => void;
  currentUser: { name: string; role: 'student' | 'teacher' | 'admin' } | null;
}

export default function DiscussionCard({ post, onAddComment, currentUser }: DiscussionCardProps) {
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(post.id, commentText.trim());
    setCommentText("");
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "teacher":
        return <span className="bg-amber-50 text-amber-700 border border-amber-200/50 text-[10px] px-1.5 py-0.5 rounded font-semibold">معلم</span>;
      case "admin":
        return <span className="bg-red-50 text-red-700 border border-red-200/50 text-[10px] px-1.5 py-0.5 rounded font-semibold font-semibold">مشرف</span>;
      default:
        return <span className="bg-blue-50 text-blue-700 border border-blue-200/50 text-[10px] px-1.5 py-0.5 rounded font-semibold">طالب</span>;
    }
  };

  return (
    <Card className="border border-border/70 hover:shadow-md transition-shadow duration-200 text-right" dir="rtl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-semibold">
            <span>{new Date(post.createdAt).toLocaleDateString("ar-EG")}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <span className="font-bold text-sm text-foreground block">{post.authorName}</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <User className="h-4.5 w-4.5" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2 justify-end">
          {getRoleBadge(post.authorRole)}
          <CardTitle className="text-lg font-bold text-foreground">{post.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
          {post.content}
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-border/30">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="text-xs text-primary font-bold hover:bg-primary/5 flex items-center gap-1.5"
          >
            <MessageSquare className="h-4 w-4" />
            <span>التعليقات ({post.comments.length})</span>
          </Button>
        </div>

        {showComments && (
          <div className="space-y-3 pt-2 bg-slate-50/30 p-3 rounded-lg border border-border/30">
            {post.comments.length > 0 ? (
              <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="bg-card p-3 rounded-lg border border-border/30 space-y-1 text-xs shadow-sm">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-muted-foreground">{new Date(comment.createdAt).toLocaleDateString("ar-EG")}</span>
                      <div className="flex items-center gap-1.5">
                        {getRoleBadge(comment.authorRole)}
                        <span className="font-bold text-foreground">{comment.authorName}</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground font-medium text-right leading-relaxed pt-1">
                      {comment.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center italic py-2">
                لا توجد تعليقات بعد. كن أول من يعلق!
              </p>
            )}

            {/* Comment Composer */}
            {currentUser && (
              <form onSubmit={handleSubmitComment} className="flex gap-2 items-end pt-2 border-t border-border/20">
                <Button type="submit" size="sm" className="h-8 px-3 font-bold flex items-center gap-1">
                  <Send className="h-3.5 w-3.5" />
                  تعليق
                </Button>
                <Textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="اكتب تعليقك هنا..."
                  className="text-right text-xs min-h-[32px] h-8 py-1.5 resize-none flex-1 focus-visible:ring-primary/50"
                  required
                />
              </form>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
