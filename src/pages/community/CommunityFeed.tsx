import { useState, useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { CommunityPostCard, CommunityPost } from "@/components/community/CommunityPostCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import {
  MessageSquare,
  Users,
  Sparkles,
  Send,
  Pin,
  Flame,
  Tag,
  PlusCircle,
  TrendingUp,
  Clock,
  HelpCircle,
  Search,
  Trophy,
  Code2,
  Calendar,
  Compass
} from "lucide-react";
import { getAssetUrl } from "@/lib/assetUtils";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const CHANNELS = [
  { id: "all", name: "🌟 جميع المنشورات", count: 28 },
  { id: "announcements", name: "📢 إعلانات صانع المحتوى", count: 4 },
  { id: "discussions", name: "💬 نقاشات وأسئلة برمجية", count: 12 },
  { id: "projects", name: "🚀 مشاريع الطلاب والابتكارات", count: 8 },
  { id: "jobs", name: "💼 فرص عمل وتدريب محلي", count: 4 },
];

const LEADERBOARD = [
  { rank: 1, name: "م. إياس الدمشقي", level: 6, xp: 480, avatar: "إد" },
  { rank: 2, name: "سارة العلي", level: 5, xp: 395, avatar: "سع" },
  { rank: 3, name: "أحمد منصور", level: 4, xp: 310, avatar: "أم" },
  { rank: 4, name: "ليلى الحمصي", level: 3, xp: 240, avatar: "لح" },
];

export default function CommunityFeed() {
  const { user } = useAuth();
  const [activeChannel, setActiveChannel] = useState("all");
  const [activeSort, setActiveSort] = useState<"trending" | "latest" | "unanswered">("trending");
  const [searchQuery, setSearchQuery] = useState("");
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [showCodeField, setShowCodeField] = useState(false);

  // Composer state
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newTags, setNewTags] = useState("");
  const [newCodeSnippet, setNewCodeSnippet] = useState("");
  const [newCodeLanguage, setNewCodeLanguage] = useState("TypeScript");

  const [posts, setPosts] = useState<CommunityPost[]>([
    {
      id: "cp-1",
      authorName: "د. خالد صانع المحتوى",
      authorRole: "creator",
      authorLevel: 9,
      authorXp: 1200,
      channelName: "📢 إعلانات صانع المحتوى",
      title: "مرحباً بكم في مجتمع تعلّم لهندسة البرمجيات والأنظمة الموزعة! 🌟",
      content: "يسعدنا انضمامكم جميعاً. هذا المجتمع مصمم على نموذج Skool ليكون بيتكم المعرفي اليومي. كل مشاركة هادفة، سؤال بناء، أو مساعدة لزميل تمنحكم نقاط خبرة (XP) ومستويات متقدمة تفتح لكم مسارات تدريبية إضافية!",
      tags: ["ترحيب", "أنظمة_موزعة", "مجتمع_تعلّم"],
      upvotesCount: 52,
      commentsCount: 18,
      createdAt: "منذ ساعتين",
      isPinned: true
    },
    {
      id: "cp-2",
      authorName: "سارة العلي",
      authorRole: "student",
      authorLevel: 5,
      authorXp: 395,
      channelName: "💬 نقاشات وأسئلة برمجية",
      title: "كيف نطبق Optimistic Concurrency Control لمنع تعارض الحجوزات؟",
      content: "أثناء دراسة محاضرة قواعد البيانات الموزعة، قمت ببناء نموذج لقفل التضارب الإيجابي عبر حقل version. هل يفضل إضافة Exponential Backoff عند إعادة المحاولة؟",
      codeSnippet: `async function updateWithOCC(id: string, version: number, patch: Partial<Data>) {
  const { data, error } = await supabase
    .from('inventory')
    .update({ ...patch, version: version + 1 })
    .match({ id, version });
  if (!data) throw new Error('OCC_CONFLICT');
  return data;
}`,
      codeLanguage: "TypeScript",
      tags: ["قواعد_بيانات", "OCC", "استفسار"],
      upvotesCount: 28,
      commentsCount: 9,
      createdAt: "منذ 4 ساعات"
    },
    {
      id: "cp-3",
      authorName: "أحمد منصور",
      authorRole: "student",
      authorLevel: 4,
      authorXp: 310,
      channelName: "🚀 مشاريع الطلاب والابتكارات",
      title: "مشروعي للتخرج: محرك بحث ذكي للنصوص باللغة العربية مع دعم التشكيل",
      content: "شاركت الكود المصدري على منصة GitHub مع دعم التشكيل والبحث بالمعنى والتجذير. بانتظار ملاحظاتكم وتقييم الزملاء والمشرفين!",
      tags: ["مشروع_تخرج", "ذكاء_اصطناعي", "لغة_عربية"],
      upvotesCount: 39,
      commentsCount: 14,
      createdAt: "منذ يوم"
    },
    {
      id: "cp-4",
      authorName: "م. طارق مهندس أنظمة",
      authorRole: "student",
      authorLevel: 3,
      authorXp: 215,
      channelName: "💼 فرص عمل وتدريب محلي",
      title: "مطلوب مطور React & TypeScript لمنصة تجارة إلكترونية مقرها دمشق",
      content: "نبحث عن مطور شغوف يمتلك مهارات قوية في Tailwind CSS و React Query للعمل عن بعد مع فريق تقني في بلاد الشام. يرجى إرسال معرض أعمالكم عبر التعليقات.",
      tags: ["فرص_عمل", "دمشق", "React", "عن_بعد"],
      upvotesCount: 19,
      commentsCount: 7,
      createdAt: "منذ يومين"
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
      authorLevel: 2,
      authorXp: 50,
      channelName: CHANNELS.find(c => c.id === activeChannel)?.name || "💬 نقاشات وأسئلة برمجية",
      title: newTitle,
      content: newContent,
      codeSnippet: showCodeField && newCodeSnippet.trim() ? newCodeSnippet.trim() : undefined,
      codeLanguage: newCodeLanguage,
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
    setNewCodeSnippet("");
    setShowCodeField(false);
    setIsComposerOpen(false);
    toast.success("تم نشر مساهمتك في المجتمع وحصلت على +10 XP!");
  };

  const filteredPosts = useMemo(() => {
    return posts
      .filter(post => {
        // Channel filter
        if (activeChannel === "announcements" && !post.channelName.includes("إعلانات")) return false;
        if (activeChannel === "discussions" && !post.channelName.includes("نقاشات")) return false;
        if (activeChannel === "projects" && !post.channelName.includes("مشاريع")) return false;
        if (activeChannel === "jobs" && !post.channelName.includes("فرص")) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = post.title.toLowerCase().includes(q);
          const matchContent = post.content.toLowerCase().includes(q);
          const matchAuthor = post.authorName.toLowerCase().includes(q);
          const matchTags = post.tags.some(t => t.toLowerCase().includes(q));
          if (!matchTitle && !matchContent && !matchAuthor && !matchTags) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;

        if (activeSort === "trending") {
          return b.upvotesCount - a.upvotesCount;
        }
        if (activeSort === "unanswered") {
          return a.commentsCount - b.commentsCount;
        }
        return 0; // default latest / array order
      });
  }, [posts, activeChannel, activeSort, searchQuery]);

  return (
    <DashboardLayout title="مجتمع تعلّم التفاعلي">
      <div className="space-y-6" dir="rtl">
        {/* Header Hero Banner */}
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
                <span>مجتمع تعلّم العربي • نموذج Skool للشرق الأوسط</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-[#002623]">مجتمع المعرفة والنقاشات التفاعلية 💬</h1>
              <p className="text-[#3D3A3B] mt-2 text-sm max-w-xl font-medium">
                تفاعل مع زملائك وصناع المحتوى، شارك تجاربك العملية، واكسب نقاط XP لرفع مستواك وفتح ميزات حصرية.
              </p>
            </div>

            <div className="flex gap-2 items-center flex-wrap">
              <Button
                asChild
                variant="outline"
                className="border-[#428177]/40 text-[#002623] font-bold text-xs gap-1.5 shadow-sm bg-white"
              >
                <Link to="/cohorts">
                  <Calendar className="h-4 w-4 text-[#428177]" />
                  جدول الفعاليات المباشرة
                </Link>
              </Button>

              <Button
                onClick={() => setIsComposerOpen(prev => !prev)}
                className="bg-[#428177] hover:bg-[#054239] text-white font-bold text-xs gap-1.5 shadow-sm"
              >
                <PlusCircle className="h-4 w-4" />
                إنشاء منشور جديد
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Sort Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#428177]/30 shadow-sm">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="ابحث في النقاشات، الوسوم، أو الكُتّاب..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-9 text-xs border-none bg-[#EDEBE0]/30 focus-visible:ring-1 focus-visible:ring-[#428177]"
            />
          </div>

          {/* Sort Tabs */}
          <div className="flex items-center gap-1 bg-[#EDEBE0]/40 p-1 rounded-xl">
            <button
              onClick={() => setActiveSort("trending")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeSort === "trending"
                  ? "bg-[#428177] text-white shadow-xs"
                  : "text-[#3D3A3B] hover:text-[#002623]"
              }`}
            >
              <TrendingUp className="h-3.5 w-3.5" />
              <span>الأكثر تفاعلاً</span>
            </button>

            <button
              onClick={() => setActiveSort("latest")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeSort === "latest"
                  ? "bg-[#428177] text-white shadow-xs"
                  : "text-[#3D3A3B] hover:text-[#002623]"
              }`}
            >
              <Clock className="h-3.5 w-3.5" />
              <span>الأحدث</span>
            </button>

            <button
              onClick={() => setActiveSort("unanswered")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeSort === "unanswered"
                  ? "bg-[#428177] text-white shadow-xs"
                  : "text-[#3D3A3B] hover:text-[#002623]"
              }`}
            >
              <HelpCircle className="h-3.5 w-3.5" />
              <span>بانتظار إجابة</span>
            </button>
          </div>
        </div>

        {/* Main Grid: Channels + Feed Stream + Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left/Sidebar: Channels */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="border border-[#428177]/30 bg-white shadow-sm rounded-2xl p-4 text-right">
              <h2 className="text-xs font-extrabold text-[#002623] mb-3 flex items-center gap-1.5">
                <Tag className="h-4 w-4 text-[#428177]" />
                قنوات وغرف المجتمع
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

            {/* Skool Gamification Leaderboard Card */}
            <Card className="border border-[#428177]/30 bg-white shadow-sm rounded-2xl p-4 text-right">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-extrabold text-[#002623] flex items-center gap-1.5">
                  <Trophy className="h-4 w-4 text-[#988561]" />
                  لوحة الشرف وتصنيف الأعضاء
                </h3>
                <span className="text-[10px] font-bold text-[#428177]">هذا الأسبوع</span>
              </div>

              <div className="space-y-2.5">
                {LEADERBOARD.map((item) => (
                  <div key={item.rank} className="flex items-center justify-between text-xs p-2 rounded-xl bg-[#EDEBE0]/25 border border-[#428177]/10">
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                        item.rank === 1 ? "bg-[#988561] text-white" : "bg-muted text-muted-foreground"
                      }`}>
                        {item.rank}
                      </span>
                      <span className="font-bold text-[#002623] text-xs">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Badge variant="outline" className="text-[9px] py-0 px-1 border-[#428177]/40 text-[#054239] font-bold">
                        Lvl {item.level}
                      </Badge>
                      <span className="text-[10px] font-extrabold text-[#6B1F2A]">{item.xp} XP</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Center/Right: Feed Stream & Post Composer */}
          <div className="lg:col-span-3 space-y-5">
            {/* Post Composer Card */}
            {isComposerOpen && (
              <Card className="border border-[#428177] bg-white shadow-md rounded-2xl p-5 text-right transition-all" dir="rtl">
                <form onSubmit={handleCreatePost} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-[#002623] flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-[#988561]" />
                      كتابة مساهمة جديدة في مجتمع تعلّم
                    </h3>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCodeField(prev => !prev)}
                      className="text-xs text-[#428177] gap-1 h-7 font-bold"
                    >
                      <Code2 className="h-3.5 w-3.5" />
                      {showCodeField ? "إخفاء محرر الكود" : "إضافة كود مصدري"}
                    </Button>
                  </div>

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

                  {/* Code Snippet Box */}
                  {showCodeField && (
                    <div className="space-y-1.5 bg-[#002623]/5 p-3 rounded-xl border border-[#428177]/30">
                      <div className="flex items-center justify-between text-xs font-bold text-[#002623]">
                        <span>الكود المصدري البرمجي</span>
                        <Input
                          placeholder="اللغة (مثال: TypeScript, Python, SQL)"
                          value={newCodeLanguage}
                          onChange={(e) => setNewCodeLanguage(e.target.value)}
                          className="w-36 h-6 text-[10px] text-left"
                          dir="ltr"
                        />
                      </div>
                      <Textarea
                        placeholder="// الصق الكود هنا..."
                        rows={3}
                        value={newCodeSnippet}
                        onChange={(e) => setNewCodeSnippet(e.target.value)}
                        className="font-mono text-xs text-left border-[#428177]/40 bg-white"
                        dir="ltr"
                      />
                    </div>
                  )}

                  <Input
                    placeholder="وسوم مفصولة بمسافة (مثال: برمجة أنظمة_موزعة React)"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    className="text-right text-xs border-[#428177]/40"
                  />

                  <div className="flex gap-2 justify-end pt-1">
                    <Button type="submit" size="sm" className="bg-[#428177] hover:bg-[#054239] text-white font-bold text-xs gap-1.5">
                      <Send className="h-3.5 w-3.5" />
                      نشر في المجتمع (+10 XP)
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => setIsComposerOpen(false)} className="border-[#428177]/30 text-xs">
                      إلغاء
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {/* Posts List */}
            {filteredPosts.length === 0 ? (
              <Card className="p-8 text-center bg-white border border-[#428177]/30 rounded-2xl">
                <p className="text-sm font-bold text-muted-foreground">لا توجد منشورات مطابقة للبحث أو القناة المحددة.</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredPosts.map(post => (
                  <CommunityPostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
