import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCourseData } from "@/contexts/CourseContext";
import DiscussionCard, { DiscussionPost } from "@/components/courses/DiscussionCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, MessageSquare, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

import { useOptimisticAction } from "@/lib/useOptimisticAction";

export default function CourseDiscussion() {
    const { courseId } = useParams<{ courseId: string }>();
    const { user } = useAuth();
    const { courseData } = useCourseData();
    const course = courseData[Number(courseId)];

    const [posts, setPosts] = useState<DiscussionPost[]>([]);
    const [showNewPost, setShowNewPost] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newContent, setNewContent] = useState("");

    const { executeOptimistic } = useOptimisticAction<DiscussionPost[]>(posts);

    // Load posts from LocalStorage, or use initial mock data
    useEffect(() => {
        if (!courseId) return;
        const key = `ta3_discussions_${courseId}`;
        const saved = localStorage.getItem(key);
        if (saved) {
            setPosts(JSON.parse(saved));
        } else {
            // Seed default mock threads
            const defaultPosts: DiscussionPost[] = [
                {
                    id: 1,
                    title: "استفسار حول المشروع النهائي للمقرر",
                    content: "السلام عليكم، هل يمكننا تقديم المشروع النهائي كمجموعات ثنائية؟ أم يجب أن يكون العمل فردياً بالكامل؟ شكراً لكم.",
                    authorName: "أحمد علي",
                    authorRole: "student",
                    createdAt: new Date(Date.now() - 3 * 3600000).toISOString(),
                    comments: [
                        {
                            id: 1,
                            content: "وعليكم السلام، نعم يا أحمد. يمكنك تقديم المشروع مع زميل لك في مجموعة ثنائية.",
                            authorName: "د. خالد",
                            authorRole: "teacher",
                            createdAt: new Date(Date.now() - 2 * 3600000).toISOString()
                        }
                    ]
                },
                {
                    id: 2,
                    title: "روابط خارجية ومصادر إضافية للمحاضرة الثانية",
                    content: "أهلاً بالجميع، قمت برفع قائمة ببعض المراجع والمقالات المفيدة التي تشرح المفاهيم التي تناولناها في المحاضرة السابقة بشكل مبسط ومناسب لمراجعتكم الفردية.",
                    authorName: "د. خالد",
                    authorRole: "teacher",
                    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
                    comments: []
                }
            ];
            setPosts(defaultPosts);
            localStorage.setItem(key, JSON.stringify(defaultPosts));
        }
    }, [courseId]);

    const savePostsToLocalStorage = (updatedPosts: DiscussionPost[]) => {
        setPosts(updatedPosts);
        localStorage.setItem(`ta3_discussions_${courseId}`, JSON.stringify(updatedPosts));
    };

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim() || !newContent.trim() || !user) return;

        const newPost: DiscussionPost = {
            id: Math.max(0, ...posts.map((p) => p.id)) + 1,
            title: newTitle.trim(),
            content: newContent.trim(),
            authorName: user.name,
            authorRole: user.role,
            createdAt: new Date().toISOString(),
            comments: []
        };

        await executeOptimistic(newPost, {
            optimisticMutator: (current, payload) => [payload, ...current],
            action: async (payload) => {
                const updated = [payload, ...posts];
                savePostsToLocalStorage(updated);
                return { success: true, data: updated };
            },
            onSuccess: () => {
                toast.success("تم نشر الموضوع الجديد بنجاح");
                setNewTitle("");
                setNewContent("");
                setShowNewPost(false);
            },
            onError: (err) => {
                toast.error(`فشل في النشر: ${err}`);
            }
        });
    };

    const handleAddComment = async (postId: number, commentText: string) => {
        if (!user) return;

        await executeOptimistic({ postId, commentText }, {
            optimisticMutator: (current, payload) => {
                return current.map((post) => {
                    if (post.id === payload.postId) {
                        const newComment = {
                            id: Math.max(0, ...post.comments.map((c) => c.id)) + 1,
                            content: payload.commentText,
                            authorName: user.name,
                            authorRole: user.role,
                            createdAt: new Date().toISOString()
                        };
                        return {
                            ...post,
                            comments: [...post.comments, newComment]
                        };
                    }
                    return post;
                });
            },
            action: async (payload) => {
                const updated = posts.map((post) => {
                    if (post.id === payload.postId) {
                        const newComment = {
                            id: Math.max(0, ...post.comments.map((c) => c.id)) + 1,
                            content: payload.commentText,
                            authorName: user.name,
                            authorRole: user.role,
                            createdAt: new Date().toISOString()
                        };
                        return {
                            ...post,
                            comments: [...post.comments, newComment]
                        };
                    }
                    return post;
                });
                savePostsToLocalStorage(updated);
                return { success: true, data: updated };
            },
            onSuccess: () => {
                toast.success("تمت إضافة التعليق");
            },
            onError: (err) => {
                toast.error(`فشل في إضافة التعليق: ${err}`);
            }
        });
    };

    if (!course) {
        return (
            <DashboardLayout title="المقرر غير موجود">
                <div className="text-center py-12">
                    <h1 className="text-2xl font-bold text-muted-foreground">المقرر غير موجود</h1>
                </div>
            </DashboardLayout>
        );
    }

    const backPath = user?.role === 'teacher' ? `/teacher/courses/${courseId}` : `/student/courses/${courseId}`;

    return (
        <DashboardLayout title={`منتدى النقاش - ${course.name}`}>
            <div className="space-y-6" dir="rtl">
                {/* Header Navigation */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/40 pb-4">
                    <div className="text-right space-y-1">
                        <div className="flex items-center gap-2 justify-end text-xs text-muted-foreground">
                            <Link to={backPath} className="hover:text-primary transition-colors flex items-center gap-1">
                                {course.name}
                                <ArrowRight className="h-3 w-3" />
                            </Link>
                            <span>/</span>
                            <span className="font-semibold text-foreground">منتدى النقاش</span>
                        </div>
                        <h1 className="text-3xl font-extrabold text-foreground">منتدى نقاشات المقرر</h1>
                        <p className="text-xs text-muted-foreground font-medium">اطرح أسئلتك وشارك في النقاش مع زملائك ومعلم المقرر</p>
                    </div>
                    {user && (
                        <Button onClick={() => setShowNewPost(!showNewPost)} className="font-bold flex items-center gap-1.5 self-end sm:self-auto">
                            <Plus className="h-4 w-4" />
                            {showNewPost ? "إلغاء الموضوع" : "موضوع جديد"}
                        </Button>
                    )}
                </div>

                {/* New Post Form */}
                {showNewPost && (
                    <div className="border border-border/80 rounded-xl p-5 bg-card/50 shadow-sm text-right space-y-4">
                        <h3 className="font-bold text-base text-foreground">طرح موضوع جديد للنقاش</h3>
                        <form onSubmit={handleCreatePost} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="post-title" className="text-xs font-semibold text-foreground/80 block">عنوان الموضوع</Label>
                                <Input
                                    id="post-title"
                                    required
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    className="text-right focus-visible:ring-primary/50"
                                    placeholder="مثال: استفسار حول المحاضرة الثالثة"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="post-content" className="text-xs font-semibold text-foreground/80 block">تفاصيل الموضوع</Label>
                                <Textarea
                                    id="post-content"
                                    required
                                    value={newContent}
                                    onChange={(e) => setNewContent(e.target.value)}
                                    className="text-right text-xs focus-visible:ring-primary/50"
                                    placeholder="اكتب تفاصيل سؤالك أو مقترحك هنا..."
                                    rows={4}
                                />
                            </div>
                            <Button type="submit" className="w-full font-bold shadow-sm">
                                نشر الموضوع
                            </Button>
                        </form>
                    </div>
                )}

                {/* Discussion Cards List */}
                <div className="space-y-4">
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <DiscussionCard
                                key={post.id}
                                post={post}
                                onAddComment={handleAddComment}
                                currentUser={user}
                            />
                        ))
                    ) : (
                        <div className="text-center py-16 border border-dashed rounded-xl bg-slate-50 text-muted-foreground text-sm space-y-2">
                            <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground/60" />
                            <p className="font-semibold">منتدى النقاش فارغ حالياً</p>
                            <p className="text-xs text-muted-foreground/80">انقر على "موضوع جديد" لبدء نقاش في المقرر.</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
