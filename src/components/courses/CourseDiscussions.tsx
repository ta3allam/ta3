import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { subscribeToDiscussions } from "@/lib/discussions";
import { toast } from "sonner";
import { MessageSquare, Send, User, Clock, MessageCircle, Search, CheckCircle2, Filter } from "lucide-react";

export interface DiscussionReplyItem {
  id: number;
  authorName: string;
  authorRole: "student" | "teacher" | "admin";
  content: string;
  createdAt: string;
  isSolution?: boolean;
}

export interface DiscussionPostItem {
  id: number;
  authorName: string;
  authorRole: "student" | "teacher" | "admin";
  title: string;
  content: string;
  createdAt: string;
  isSolved?: boolean;
  replies: DiscussionReplyItem[];
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
  const isTeacher = user?.role === 'teacher';

  const [posts, setPosts] = useState<DiscussionPostItem[]>([
    {
      id: 1,
      authorName: "أحمد علي",
      authorRole: "student",
      title: "استفسار حول الواجب الثاني في تراكيب البيانات",
      content: "هل يشترط استخدام المكدس Dynamic Stack أم يمكن استخدام الأرقام القياسية في المصفوفة؟",
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      isSolved: true,
      replies: [
        {
          id: 101,
          authorName: "د. خالد",
          authorRole: "teacher",
          content: "يمكنك استخدام كلا الخيارين، ولكن يفضل Dynamic Stack للحصول على الدرجة الكاملة.",
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          isSolution: true,
        },
      ],
    },
    {
      id: 2,
      authorName: "سارة محمود",
      authorRole: "student",
      title: "موعد الاختبار القصير الأسبوع القادم",
      content: "هل يشمل الاختبار القصير الفصل الثالث بالكامل؟",
      createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
      isSolved: false,
      replies: []
    }
  ]);

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState<'all' | 'unanswered' | 'solved'>('all');
  const [replyText, setReplyText] = useState<{ [postId: number]: string }>({});

  // Realtime subscription setup
  useEffect(() => {
    const unsubscribe = subscribeToDiscussions(1, () => {
      toast.info("تحديث جديد في ساحة المناقشات");
    });
    return () => unsubscribe();
  }, []);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      toast.error("يرجى ملء عنوان وتفاصيل الموضوع");
      return;
    }

    const newPost: DiscussionPostItem = {
      id: Date.now(),
      authorName: user?.name || "مستخدم",
      authorRole: (user?.role as "student" | "teacher" | "admin") || "student",
      title: newTitle.trim(),
      content: newContent.trim(),
      createdAt: new Date().toISOString(),
      isSolved: false,
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
          const replies = p.replies || [];
          return {
            ...p,
            replies: [
              ...replies,
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

  const handleMarkSolution = (postId: number, replyId: number) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const updatedReplies = (p.replies || []).map((r) => ({
            ...r,
            isSolution: r.id === replyId ? !r.isSolution : false,
          }));
          const isSolved = updatedReplies.some((r) => r.isSolution);
          return {
            ...p,
            isSolved,
            replies: updatedReplies,
          };
        }
        return p;
      })
    );
    toast.success("تم تحديث علامة الإجابة الصحيحة بنجاح");
  };

  // Filtering & Search
  const filteredPosts = posts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.authorName.toLowerCase().includes(searchQuery.toLowerCase());

    const replies = p.replies || [];
    if (filterTab === 'unanswered') return matchesSearch && replies.length === 0;
    if (filterTab === 'solved') return matchesSearch && p.isSolved;
    return matchesSearch;
  });

  return (
    <div className="space-y-6" dir="rtl">
      {/* Search & Filter Header Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-white border border-[#428177]/30 p-4 rounded-2xl shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#428177] absolute right-3 top-3" />
          <Input
            placeholder="البحث في الأسئلة والمواقشات..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-9 text-xs bg-[#EDEBE0]/20 border-[#428177]/30 text-[#002623]"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-[#EDEBE0]/60 p-1 rounded-xl border border-[#428177]/20">
          <Button
            size="sm"
            variant={filterTab === 'all' ? 'default' : 'ghost'}
            onClick={() => setFilterTab('all')}
            className={filterTab === 'all' ? 'bg-[#428177] text-white font-bold text-xs' : 'text-[#002623] font-bold text-xs'}
          >
            جميع المواضيع ({posts.length})
          </Button>
          <Button
            size="sm"
            variant={filterTab === 'unanswered' ? 'default' : 'ghost'}
            onClick={() => setFilterTab('unanswered')}
            className={filterTab === 'unanswered' ? 'bg-[#428177] text-white font-bold text-xs' : 'text-[#002623] font-bold text-xs'}
          >
            أسئلة بلا إجابة ({posts.filter(p => (p.replies || []).length === 0).length})
          </Button>
          <Button
            size="sm"
            variant={filterTab === 'solved' ? 'default' : 'ghost'}
            onClick={() => setFilterTab('solved')}
            className={filterTab === 'solved' ? 'bg-[#428177] text-white font-bold text-xs' : 'text-[#002623] font-bold text-xs'}
          >
            مجابة ومحلولة ({posts.filter(p => p.isSolved).length})
          </Button>
        </div>
      </div>

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
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => {
            const replies = post.replies || [];
            return (
              <Card key={post.id} className="bg-white border border-[#428177]/30 rounded-2xl shadow-sm overflow-hidden">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-lg text-[#002623]">{post.title}</h4>
                        {post.isSolved && (
                          <Badge className="bg-[#428177] text-white font-bold text-[10px]">
                            مُجاب عليه ✅
                          </Badge>
                        )}
                      </div>
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
                  {replies.length > 0 && (
                    <div className="space-y-2 mr-4 border-r-2 border-[#428177]/30 pr-3">
                      {replies.map((reply) => (
                        <div
                          key={reply.id}
                          className={`p-3 rounded-xl space-y-1 text-xs border transition-colors ${
                            reply.isSolution
                              ? "bg-[#428177]/10 border-[#428177]/50"
                              : "bg-white border-[#EDEBE0]"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#002623] flex items-center gap-1">
                                <User className="w-3 h-3 text-[#428177]" />
                                {reply.authorName}{" "}
                                {reply.authorRole === "teacher" && (
                                  <span className="text-[10px] bg-[#428177]/10 text-[#428177] px-2 py-0.5 rounded-full font-bold">
                                    معلم
                                  </span>
                                )}
                              </span>

                              {reply.isSolution && (
                                <Badge className="bg-[#428177] text-white text-[10px] font-bold flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  إجابة معتمدة ومحددة كحل
                                </Badge>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-[#3D3A3B]">{formatStandardDate(reply.createdAt)}</span>
                              {(isTeacher || user?.name === post.authorName) && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleMarkSolution(post.id, reply.id)}
                                  className="text-[10px] h-6 px-2 text-[#428177] hover:bg-[#428177]/10 font-bold"
                                >
                                  {reply.isSolution ? "إلغاء تحديد الحل" : "تحديد كإجابة صحيحة"}
                                </Button>
                              )}
                            </div>
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
            );
          })
        ) : (
          <div className="text-center py-12 bg-white border border-dashed border-[#428177]/30 rounded-2xl text-xs text-[#3D3A3B]">
            لا توجد مواضيع مناقشة مطابقة لخيارات التصفية حالياً
          </div>
        )}
      </div>
    </div>
  );
}
