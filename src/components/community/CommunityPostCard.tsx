import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThumbsUp, MessageSquare, Pin, Sparkles, Share2 } from "lucide-react";
import { toast } from "sonner";

export interface CommunityPost {
  id: string;
  authorName: string;
  authorAvatar?: string;
  authorRole: 'creator' | 'student' | 'admin';
  channelName: string;
  title: string;
  content: string;
  tags: string[];
  upvotesCount: number;
  commentsCount: number;
  createdAt: string;
  isPinned?: boolean;
}

interface CommunityPostCardProps {
  post: CommunityPost;
  onUpvote?: (postId: string) => void;
}

export function CommunityPostCard({ post, onUpvote }: CommunityPostCardProps) {
  const [upvotes, setUpvotes] = useState(post.upvotesCount);
  const [hasUpvoted, setHasUpvoted] = useState(false);

  const handleUpvoteToggle = () => {
    if (hasUpvoted) {
      setUpvotes(prev => prev - 1);
      setHasUpvoted(false);
    } else {
      setUpvotes(prev => prev + 1);
      setHasUpvoted(true);
      toast.success("تم تسجيل إعجابك وتأييدك للمنشور!");
    }
    onUpvote?.(post.id);
  };

  const handleShare = () => {
    toast.success("تم نسخ رابط المنشور التفاعلي إلى الحافظة!");
  };

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
          <span className="text-muted-foreground text-[11px]">{post.createdAt}</span>
        </div>

        {/* Author Info */}
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-[#428177]">
            <AvatarImage src={post.authorAvatar} alt={post.authorName} />
            <AvatarFallback className="bg-[#428177] text-white font-bold text-xs">
              {post.authorName.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="text-right">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm text-[#002623]">{post.authorName}</span>
              {post.authorRole === 'creator' && (
                <Badge className="bg-[#054239] text-white text-[10px] py-0 px-1.5 font-bold">
                  صانع المحتوى
                </Badge>
              )}
            </div>
            <span className="text-[11px] text-muted-foreground">عضو نشط في المجتمع</span>
          </div>
        </div>

        {/* Post Content */}
        <div className="space-y-2">
          <h3 className="font-extrabold text-base text-[#002623] leading-snug">{post.title}</h3>
          <p className="text-xs text-[#3D3A3B] leading-relaxed whitespace-pre-line">{post.content}</p>
        </div>

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
              <span>{upvotes} تأييد</span>
            </Button>

            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 text-xs h-8 border-[#428177]/30 text-[#002623] hover:bg-[#EDEBE0]/40"
            >
              <MessageSquare className="h-3.5 w-3.5 text-[#428177]" />
              <span>{post.commentsCount} تعليق</span>
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
      </CardContent>
    </Card>
  );
}
