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

function formatStandardDate(dateStr: string): string {
  const d = new Date(dateStr);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
}

export default function DiscussionCard({ post, onAddComment, currentUser }: DiscussionCardProps) {
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(true);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(post.id, commentText.trim());
    setCommentText("");
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "teacher":
        return <span className="bg-[#988561]/20 text-[#002623] border border-[#988561]/40 text-[10px] px-2 py-0.5 rounded-md font-bold">معلم</span>;
      case "admin":
        return <span className="bg-[#6B1F2A]/15 text-[#6B1F2A] border border-[#6B1F2A]/30 text-[10px] px-2 py-0.5 rounded-md font-bold">مشرف</span>;
      default:
        return <span className="bg-[#428177]/15 text-[#054239] border border-[#428177]/30 text-[10px] px-2 py-0.5 rounded-md font-bold">طالب</span>;
    }
  };

  return (
    <Card className="border border-[#428177]/30 hover:border-[#428177] transition-all bg-white shadow-sm text-right rounded-2xl overflow-hidden" dir="rtl">
      <CardHeader className="pb-3 bg-[#EDEBE0]/20 border-b border-[#428177]/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-[11px] text-[#3D3A3B] font-semibold">
            <span>{formatStandardDate(post.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <span className="font-bold text-sm text-[#002623] block">{post.authorName}</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-[#428177]/10 border border-[#428177]/30 flex items-center justify-center text-[#428177]">
              <User className="h-4.5 w-4.5" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2 justify-start">
          {getRoleBadge(post.authorRole)}
          <CardTitle className="text-lg font-bold text-[#002623]">{post.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <p className="text-sm text-[#3D3A3B] whitespace-pre-wrap leading-relaxed font-medium">
          {post.content}
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-[#EDEBE0]">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="text-xs text-[#428177] font-bold hover:bg-[#428177]/10 flex items-center gap-1.5"
          >
            <MessageSquare className="h-4 w-4" />
            <span>التعليقات ({post.comments.length})</span>
          </Button>
        </div>

        {showComments && (
          <div className="space-y-3 pt-2 bg-[#EDEBE0]/30 p-3.5 rounded-xl border border-[#428177]/20">
            {post.comments.length > 0 ? (
              <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="bg-white p-3 rounded-xl border border-[#428177]/20 space-y-1 text-xs shadow-sm">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-[#3D3A3B] font-semibold">{formatStandardDate(comment.createdAt)}</span>
                      <div className="flex items-center gap-1.5">
                        {getRoleBadge(comment.authorRole)}
                        <span className="font-bold text-[#002623]">{comment.authorName}</span>
                      </div>
                    </div>
                    <p className="text-[#3D3A3B] font-medium text-right leading-relaxed pt-1">
                      {comment.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#3D3A3B] text-center font-medium italic py-2">
                لا توجد تعليقات بعد. كن أول من يعلق!
              </p>
            )}

            {/* Comment Composer */}
            {currentUser && (
              <form onSubmit={handleSubmitComment} className="flex gap-2 items-end pt-2 border-t border-[#428177]/20">
                <Button type="submit" size="sm" className="h-9 px-4 bg-[#428177] hover:bg-[#054239] text-white font-bold flex items-center gap-1">
                  <Send className="h-3.5 w-3.5" />
                  تعليق
                </Button>
                <Textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="اكتب تعليقك هنا..."
                  className="text-right text-xs min-h-[36px] h-9 py-2 border-[#428177]/30 focus-visible:ring-[#428177] resize-none flex-1 font-medium bg-white"
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
