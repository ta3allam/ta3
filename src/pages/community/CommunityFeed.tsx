import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { CommunityPostCard, CommunityPost } from "@/components/community/CommunityPostCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { MessageSquare, Users, Sparkles, Send, Pin, Flame, Tag, PlusCircle } from "lucide-react";
import { getAssetUrl } from "@/lib/assetUtils";
import { toast } from "sonner";

const CHANNELS = [
  { id: "all", name: "جميع المنشورات", count: 24 },
  { id: "announcements", name: "📢 إعلانات صانع المحتوى", count: 4 },
  { id: "discussions", name: "💬 نقاشات وأسئلة برمجية", count: 12 },
  { id: "projects", name: "🚀 مشاريع الطلاب والابتكارات", count: 8 },
];

export default function CommunityFeed() {
  const { user } = useAuth();
  const [activeChannel, setActiveChannel] = useState("all");
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newTags, setNewTags] = useState("");
  const [isComposerOpen, setIsComposerOpen] = useState(false);

  const [posts, setPosts] = useState<CommunityPost[]>([
    {
      id: "cp-1",
      authorName: "د. خالد صانع المحتوى",
      authorRole: "creator",
      channelName: "📢 إعلانات صانع المحتوى",
      title: "مرحباً بكم في مجتمع تعلّم لهندسة البرمجيات والأنظمة الموزعة! 🌟",
      content: "يسعدنا انضمامكم جميعاً. هذا المجتمع مخصص لتبادل الخبرات العملية ومناقشة التحديات البرمجية في بيئات الإنتاج الحقيقية. تفضلوا بطرح أسئلتكم ومشاركة مشاريعكم.",
      tags: ["ترحيب", "أنظمة_موزعة", "تعلّم"],
      upvotesCount: 48,
      commentsCount: 16,
      createdAt: "منذ ساعتين",
      isPinned: true
    },
    {
      id: "cp-2",
      authorName: "سارة العلي",
      authorRole: "student",
      channelName: "💬 نقاشات وأسئلة برمجية",
      title: "كيف نطبق Optimistic Concurrency Control لمنع تعارض الحجوزات؟",
      content: "أثناء دراسة محاضرة قواعد البيانات الموزعة، قمت ببناء نموذج لقفل التضارب الإيجابي عبر حقل version. هل يفضل إضافة Exponential Backoff عند إعادة المحاولة؟",
      tags: ["قواعد_بيانات", "OCC", "استفسار"],
      upvotesCount: 22,
      commentsCount: 9,
      createdAt: "منذ 4 ساعات"
    },
    {
      id: "cp-3",
      authorName: "أحمد منصور",
      authorRole: "student",
      channelName: "🚀 مشاريع الطلاب والابتكارات",
      title: "مشروعي للتخرج: محرك بحث ذكي للنصوص باللغة العربية",
      content: "شاركت الكود المصدري على منصة GitHub مع دعم التشكيل والبحث بالمعنى. بانتظار ملاحظاتكم وتقييم الزملاء!",
      tags: ["مشروع_تخرج", "ذكاء_اصطناعي", "لغة_عربية"],
      upvotesCount: 35,
      commentsCount: 14,
      createdAt: "منذ يوم"
    }
  ]);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      toast.error("يرجى كتابة عنوان ومحتوى المنشور");
      return;
    }

    const tagsArray = newTags
      .split(" ")
      .map(t => t.replace("#", "").trim())
      .filter(Boolean);

    const newPostObj: CommunityPost = {
      id: `cp-${Date.now()}`,
      authorName: user?.name || "عضو المنصة",
      authorRole: user?.role === "teacher" || user?.role === "admin" ? "creator" : "student",
      channelName: CHANNELS.find(c => c.id === activeChannel)?.name || "💬 نقاشات وأسئلة برمجية",
      title: newTitle,
      content: newContent,
      tags: tagsArray.length > 0 ? tagsArray : ["نقاش"],
      upvotesCount: 1,
      commentsCount: 0,
      createdAt: "الآن",
      isPinned: false
    };

    setPosts([newPostObj, ...posts]);
    setNewTitle("");
    setNewContent("");
    setNewTags("");
    setIsComposerOpen(false);
    toast.success("تم نشر مساهمتك في المجتمع بنجاح!");
  };

  const filteredPosts = posts.filter(post => {
    if (activeChannel === "all") return true;
    if (activeChannel === "announcements") return post.channelName.includes("إعلانات");
    if (activeChannel === "discussions") return post.channelName.includes("نقاشات");
    if (activeChannel === "projects") return post.channelName.includes("مشاريع");
    return true;
  });

  return (
    <DashboardLayout title="مجتمع المعرفة والتفاعل">
      <div className="space-y-6" dir="rtl">
        {/* Header Banner */}
        <div
          className="relative overflow-hidden rounded-2xl bg-white border border-[#428177] p-6 md:p-8 shadow-sm"
          style={{
            backgroundImage: `linear-gradient(to left, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.82)), url('${getAssetUrl("/dashboard bg/otherbackground.png")}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#428177]/10 text-[#428177] text-xs font-bold mb-3 border border-[#428177]/30">
                <Users className="w-3.5 h-3.5 text-[#428177]" />
                <span>مجتمعات صناع المحتوى والتعليم التفاعلي</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-[#002623]">مجتمع المعرفة والنقاشات التفاعلية 💬</h1>
              <p className="text-[#3D3A3B] mt-2 text-sm max-w-xl font-medium">
                تفاعل مع زملائك وصناع المحتوى، شارك تجاربك العملية، واطرح استفساراتك في بيئة تعليمية محفزة.
              </p>
            </div>

            <Button
              onClick={() => setIsComposerOpen(prev => !prev)}
              className="bg-[#428177] hover:bg-[#054239] text-white font-bold text-xs gap-1.5 shadow-sm"
            >
              <PlusCircle className="h-4 w-4" />
              إنشاء منشور جديد
            </Button>
          </div>
        </div>

        {/* Main Grid: Channels Sidebar + Feed Stream */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Channels Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="border border-[#428177]/30 bg-white shadow-sm rounded-2xl p-4 text-right">
              <h2 className="text-xs font-extrabold text-[#002623] mb-3 flex items-center gap-1.5">
                <Tag className="h-4 w-4 text-[#428177]" />
                قنوات وغرف النقاش
              </h2>
              <div className="space-y-1">
                {CHANNELS.map(ch => (
                  <button
                    key={ch.id}
                    onClick={() => setActiveChannel(ch.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors text-right ${
                      activeChannel === ch.id
                        ? "bg-[#428177] text-white"
                        : "hover:bg-[#EDEBE0]/60 text-[#3D3A3B]"
                    }`}
                  >
                    <span>{ch.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      activeChannel === ch.id ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                    }`}>
                      {ch.count}
                    </span>
                  </button>
                ))}
              </div>
            </Card>

            <Card className="border border-[#428177]/30 bg-[#EDEBE0]/30 shadow-sm rounded-2xl p-4 text-right text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-[#002623]">
                <Sparkles className="h-4 w-4 text-[#988561]" />
                <span>إرشادات المجتمع التفاعلي</span>
              </div>
              <p className="text-[11px] text-[#3D3A3B] leading-relaxed">
                حافظ على الاحترام المتبادل، ركّز على تقديم قيمة علمية، واستخدم وسوم واضحة لتسهيل وصول زملائك للمعلومة.
              </p>
            </Card>
          </div>

          {/* Feed Stream & Post Composer */}
          <div className="lg:col-span-3 space-y-5">
            {/* Post Composer Card */}
            {isComposerOpen && (
              <Card className="border border-[#428177] bg-white shadow-md rounded-2xl p-5 text-right transition-all" dir="rtl">
                <form onSubmit={handleCreatePost} className="space-y-3">
                  <h3 className="font-bold text-sm text-[#002623]">كتابة مساهمة جديدة في المجتمع</h3>
                  <Input
                    placeholder="عنوان المنشور أو السؤال..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="text-right text-xs border-[#428177]/40 font-bold"
                    required
                  />
                  <Textarea
                    placeholder="اكتب تفاصيل المنشور أو التجربة أو الاستفسار هنا..."
                    rows={4}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="text-right text-xs border-[#428177]/40"
                    required
                  />
                  <Input
                    placeholder="وسوم مفصولة بمسافة (مثال: برمجيات ذكاء_اصطناعي)"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    className="text-right text-xs border-[#428177]/40"
                  />
                  <div className="flex gap-2 justify-end pt-1">
                    <Button type="submit" size="sm" className="bg-[#428177] hover:bg-[#054239] text-white font-bold text-xs gap-1.5">
                      <Send className="h-3.5 w-3.5" />
                      نشر في المجتمع
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => setIsComposerOpen(false)} className="border-[#428177]/30 text-xs">
                      إلغاء
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {/* Posts List */}
            <div className="space-y-4">
              {filteredPosts.map(post => (
                <CommunityPostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
