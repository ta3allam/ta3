import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ThumbsUp,
  MessageSquare,
  Pin,
  Sparkles,
  Share2,
  Send,
  Code2,
  Check,
  Copy,
  Flame,
  Award
} from "lucide-react";
import { toast } from "sonner";

export interface CommentItem {
  id: string;
  authorName: string;
  authorRole: 'creator' | 'student' | 'admin' | 'teacher';
  authorLevel?: number;
  content: string;
  createdAt: string;
  upvotesCount: number;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorAvatar?: string;
  authorRole: 'creator' | 'student' | 'admin' | 'teacher';
  authorLevel?: number;
  authorXp?: number;
  channelName: string;
  title: string;
  content: string;
  codeSnippet?: string;
  codeLanguage?: string;
  tags: string[];
  upvotesCount: number;
  commentsCount: number;
  comments?: CommentItem[];
  createdAt: string;
  isPinned?: boolean;
}

interface CommunityPostCardProps {
  post: CommunityPost;
  onUpvote?: (postId: string, newUpvotes: number) => void;
  onAddComment?: (postId: string, commentText: string) => void;
}

export function CommunityPostCard({ post, onUpvote, onAddComment }: CommunityPostCardProps) {
  const [upvotes, setUpvotes] = useState(post.upvotesCount);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [commentsList, setCommentsList] = useState<CommentItem[]>(post.comments || [
    {
      id: `c-init-${post.id}`,
      authorName: "م. إياس الدمشقي",
      authorRole: "student",
      authorLevel: 3,
      content: "مشاركة ممتازة ومفيدة جداً! شكراً لك على الطرح.",
      createdAt: "منذ 30 دقيقة",
      upvotesCount: 4
    }
  ]);
  const [newComment, setNewComment] = useState("");
  const [copiedCode, setCopiedCode] = useState(false);

  const handleUpvoteToggle = () => {
    let nextCount = upvotes;
    if (hasUpvoted) {
      nextCount = Math.max(0, upvotes - 1);
      setUpvotes(nextCount);
      setHasUpvoted(false);
    } else {
      nextCount = upvotes + 1;
      setUpvotes(nextCount);
      setHasUpvoted(true);
      toast.success("تم تأييد المنشور! حصل الكاتب على +5 XP وحصلت أنت على +1 XP 🌟");
    }
    onUpvote?.(post.id, nextCount);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    toast.success("تم نسخ رابط المنشور التفاعلي إلى الحافظة!");
  };

  const handleCopyCode = () => {
    if (post.codeSnippet) {
      navigator.clipboard?.writeText(post.codeSnippet);
      setCopiedCode(true);
      toast.success("تم نسخ الكود المصدري!");
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const added: CommentItem = {
      id: `comm-${Date.now()}`,
      authorName: "أنت (عضو نشط)",
      authorRole: "student",
      authorLevel: 2,
      content: newComment.trim(),
      createdAt: "الآن",
      upvotesCount: 0
    };

    setCommentsList(prev => [...prev, added]);
    setNewComment("");
    onAddComment?.(post.id, newComment.trim());
    toast.success("تمت إضافة تعليقك وحصلت على +2 XP للمشاركة!");
  };

  const authorLevel = post.authorLevel || Math.min(9, Math.max(1, Math.floor((post.upvotesCount + 10) / 10)));

  return (
    <Card className={`border bg-white shadow-sm rounded-2xl overflow-hidden text-right transition-all hover:shadow-md ${
      post.isPinned ? "border-[#988561] bg-[#EDEBE0]/20" : "border-[#428177]/30"
    }`} dir="rtl">
      <CardContent className="p-5 space-y-4">
        {/* Top Header: Channel + Pinned badge + Date */}
        <div className="flex justify-between items-center text-xs">
          <div className="flex items-center gap-2">
            <Badge className="bg-[#428177]/15 text-[#054239] border-none font-bold text-[11px]">
              {post.channelName}
            </Badge>
            {post.isPinned && (
              <Badge className="bg-[#988561]/20 text-[#002623] border border-[#988561]/40 font-extrabold text-[11px] gap-1">
                <Pin className="h-3 w-3 text-[#988561] fill-[#988561]" />
                مثبت من صانع المحتوى
              </Badge>
            )}
          </div>
          <span className="text-muted-foreground text-[11px] font-medium">{post.createdAt}</span>
        </div>

        {/* Author Info & Gamification XP Level */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-[#428177]">
              <AvatarImage src={post.authorAvatar} alt={post.authorName} />
              <AvatarFallback className="bg-[#428177] text-white font-bold text-xs">
                {post.authorName.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="text-right">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-extrabold text-sm text-[#002623]">{post.authorName}</span>
                {post.authorRole === 'creator' ? (
                  <Badge className="bg-[#054239] text-white text-[10px] py-0 px-1.5 font-bold">
                    صانع المحتوى 👑
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-bold border-[#988561] text-[#6B1F2A] bg-[#EDEBE0]/40 flex items-center gap-0.5">
                    <Flame className="w-2.5 h-2.5 text-[#Damask Red] fill-[#6B1F2A]" />
                    المستوى {authorLevel}
                  </Badge>
                )}
              </div>
              <span className="text-[11px] text-muted-foreground font-medium">عضو نشط في مجتمع تعلّم</span>
            </div>
          </div>
        </div>

        {/* Post Title and Content */}
        <div className="space-y-2">
          <h3 className="font-extrabold text-base text-[#002623] leading-snug">{post.title}</h3>
          <p className="text-xs text-[#3D3A3B] leading-relaxed whitespace-pre-line">{post.content}</p>
        </div>

        {/* Code Snippet Box (if present) */}
        {post.codeSnippet && (
          <div className="rounded-xl bg-[#002623] text-[#EDEBE0] p-3 text-left font-mono text-xs overflow-x-auto relative border border-[#428177]/40" dir="ltr">
            <div className="flex justify-between items-center pb-2 mb-2 border-b border-[#428177]/30 text-[10px] text-[#988561]">
              <span>{post.codeLanguage || 'TypeScript'}</span>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 text-[#EDEBE0] hover:text-white transition-colors"
              >
                {copiedCode ? <Check className="w-3 h-3 text-[#428177]" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCode ? 'تم النسخ' : 'نسخ الكود'}</span>
              </button>
            </div>
            <pre className="text-xs leading-5">
              <code>{post.codeSnippet}</code>
            </pre>
          </div>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {post.tags.map((tag, idx) => (
              <span key={idx} className="text-[11px] font-semibold text-[#428177] bg-[#428177]/10 px-2 py-0.5 rounded-md">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Action Buttons: Upvote / Comments / Share */}
        <div className="flex items-center justify-between pt-3 border-t border-[#428177]/15 text-xs text-[#3D3A3B] font-bold">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={hasUpvoted ? "default" : "outline"}
              onClick={handleUpvoteToggle}
              className={`gap-1.5 text-xs h-8 ${
                hasUpvoted
                  ? "bg-[#428177] text-white hover:bg-[#054239]"
                  : "border-[#428177]/30 text-[#002623] hover:bg-[#EDEBE0]/40"
              }`}
            >
              <ThumbsUp className={`h-3.5 w-3.5 ${hasUpvoted ? "fill-white" : ""}`} />
              <span>{upvotes} تأييد (+5 XP)</span>
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsCommentsOpen(prev => !prev)}
              className="gap-1.5 text-xs h-8 border-[#428177]/30 text-[#002623] hover:bg-[#EDEBE0]/40"
            >
              <MessageSquare className="h-3.5 w-3.5 text-[#428177]" />
              <span>{commentsList.length} تعليق</span>
            </Button>
          </div>

          <Button
            size="sm"
            variant="ghost"
            onClick={handleShare}
            className="text-xs text-muted-foreground hover:text-[#002623] gap-1"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>مشاركة</span>
          </Button>
        </div>

        {/* Inline Comments Accordion & Reply Composer */}
        {isCommentsOpen && (
          <div className="pt-3 border-t border-[#428177]/20 space-y-3 bg-[#EDEBE0]/15 p-3 rounded-xl">
            <h4 className="text-xs font-bold text-[#002623]">الردود والنقاشات ({commentsList.length})</h4>

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {commentsList.map((comm) => (
                <div key={comm.id} className="bg-white border border-[#428177]/20 rounded-xl p-2.5 text-right space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[#002623]">{comm.authorName}</span>
                      {comm.authorLevel && (
                        <span className="text-[#988561] font-semibold bg-[#EDEBE0] px-1.5 py-0.2 rounded-full">
                          Lvl {comm.authorLevel}
                        </span>
                      )}
                    </div>
                    <span className="text-muted-foreground">{comm.createdAt}</span>
                  </div>
                  <p className="text-xs text-[#3D3A3B] leading-relaxed">{comm.content}</p>
                </div>
              ))}
            </div>

            {/* Comment Composer */}
            <form onSubmit={handleCommentSubmit} className="flex gap-2 items-center pt-1">
              <Input
                placeholder="اكتب ردك وملاحظتك الهادفة..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="text-xs text-right border-[#428177]/40 h-8 font-medium"
              />
              <Button type="submit" size="sm" className="bg-[#428177] hover:bg-[#054239] text-white text-xs h-8 px-3 gap-1">
                <Send className="w-3 h-3" />
                <span>إرسال</span>
              </Button>
            </form>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
