import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { MessageSquare, Send, User, Clock, MessageCircle } from "lucide-react";

interface DiscussionPost {
  id: number;
  authorName: string;
  authorRole: "student" | "teacher" | "admin";
  title: string;
  content: string;
  createdAt: string;
  replies: {
    id: number;
    authorName: string;
    authorRole: "student" | "teacher" | "admin";
    content: string;
    createdAt: string;
  }[];
}

function formatStandardDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const mins = String(date.getMinutes()).padStart(2, '0');
  return `${year}/${month}/${day} - ${hours}:${mins}`;
}

export default function CourseDiscussions() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<DiscussionPost[]>([
    {
      id: 1,
      authorName: "أحمد علي",
      authorRole: "student",
      title: "استفسار حول الواجب الثاني في تراكيب البيانات",
      content: "هل يشترط استخدام المكدس Dynamic Stack أم يمكن استخدام الأرقام القياسية في المصفوفة؟",
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      replies: [
        {
          id: 101,
          authorName: "د. أحمد محمد",
          authorRole: "teacher",
          content: "يمكنك استخدام كلا الخيارين، ولكن يفضل Dynamic Stack للحصول على الدرجة الكاملة.",
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        },
      ],
    },
  ]);

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [replyText, setReplyText] = useState<{ [postId: number]: string }>({});

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      toast.error("يرجى ملء عنوان وتفاصيل الموضوع");
      return;
    }

    const newPost: DiscussionPost = {
      id: Date.now(),
      authorName: user?.name || "مستخدم",
      authorRole: (user?.role as "student" | "teacher" | "admin") || "student",
      title: newTitle.trim(),
      content: newContent.trim(),
      createdAt: new Date().toISOString(),
      replies: [],
    };

    setPosts([newPost, ...posts]);
    setNewTitle("");
    setNewContent("");
    toast.success("تم نشر موضوع النقاش بنجاح");
  };

  const handleAddReply = (postId: number) => {
    const text = replyText[postId];
    if (!text || !text.trim()) {
      toast.error("اكتب الرد أولاً قبل الإرسال");
      return;
    }

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            replies: [
              ...p.replies,
              {
                id: Date.now(),
                authorName: user?.name || "مستخدم",
                authorRole: (user?.role as "student" | "teacher" | "admin") || "student",
                content: text.trim(),
                createdAt: new Date().toISOString(),
              },
            ],
          };
        }
        return p;
      })
    );

    setReplyText((prev) => ({ ...prev, [postId]: "" }));
    toast.success("تم إرسال الرد بنجاح");
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Create Post Form */}
      <Card className="bg-white border border-[#428177]/40 rounded-2xl shadow-sm">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#EDEBE0]">
            <MessageSquare className="w-5 h-5 text-[#428177]" />
            <h3 className="font-bold text-lg text-[#002623]">إضافة موضوع مناقشة جديد</h3>
          </div>
          <form onSubmit={handleCreatePost} className="space-y-3">
            <Input
              placeholder="عنوان الاستفسار أو المناقشة..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="bg-white border-[#428177]/30 text-[#002623] font-semibold"
            />
            <Textarea
              placeholder="اكتب التفاصيل والأسئلة هنا..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              rows={3}
              className="bg-white border-[#428177]/30 text-[#002623] text-xs"
            />
            <div className="flex justify-end">
              <Button type="submit" className="bg-[#428177] hover:bg-[#054239] text-white font-bold px-6">
                <Send className="w-4 h-4 ml-1.5" />
                نشر الموضوع
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Discussion Posts Feed */}
      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="bg-white border border-[#428177]/30 rounded-2xl shadow-sm overflow-hidden">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-lg text-[#002623]">{post.title}</h4>
                  <div className="flex items-center gap-3 text-xs text-[#3D3A3B] mt-1">
                    <span className="flex items-center gap-1 font-semibold">
                      <User className="w-3.5 h-3.5 text-[#428177]" />
                      {post.authorName} ({post.authorRole === "teacher" ? "أستاذ المادة" : "طالب"})
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#988561]" />
                      {formatStandardDate(post.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#002623] leading-relaxed bg-[#EDEBE0]/30 p-4 rounded-xl border border-[#428177]/10">
                {post.content}
              </p>

              {/* Replies Feed */}
              {post.replies.length > 0 && (
                <div className="space-y-2 mr-4 border-r-2 border-[#428177]/30 pr-3">
                  {post.replies.map((reply) => (
                    <div key={reply.id} className="bg-white border border-[#EDEBE0] p-3 rounded-xl space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#002623] flex items-center gap-1">
                          <User className="w-3 h-3 text-[#428177]" />
                          {reply.authorName}{" "}
                          {reply.authorRole === "teacher" && (
                            <span className="text-[10px] bg-[#428177]/10 text-[#428177] px-2 py-0.5 rounded-full font-bold">
                              معلم
                            </span>
                          )}
                        </span>
                        <span className="text-[10px] text-[#3D3A3B]">{formatStandardDate(reply.createdAt)}</span>
                      </div>
                      <p className="text-[#3D3A3B] font-medium leading-relaxed">{reply.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Box */}
              <div className="flex items-center gap-2 pt-2">
                <Input
                  placeholder="أضف رداً على هذا الموضوع..."
                  value={replyText[post.id] || ""}
                  onChange={(e) => setReplyText({ ...replyText, [post.id]: e.target.value })}
                  className="text-xs bg-white border-[#428177]/30 text-[#002623]"
                />
                <Button
                  size="sm"
                  onClick={() => handleAddReply(post.id)}
                  className="bg-[#428177] hover:bg-[#054239] text-white font-bold h-9 px-4"
                >
                  <MessageCircle className="w-3.5 h-3.5 ml-1" />
                  رد
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
