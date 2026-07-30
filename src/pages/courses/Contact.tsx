import { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCourseData } from "@/contexts/CourseContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Send, User, CheckCheck, ArrowRight } from "lucide-react";

interface ChatMessage {
  id: number;
  sender: 'student' | 'teacher';
  senderName: string;
  content: string;
  createdAt: string;
}

export default function CourseContact() {
    const { courseId } = useParams<{ courseId: string }>();
    const { user } = useAuth();
    const { courseData } = useCourseData();
    const course = courseData[Number(courseId)];

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputText, setInputText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Seed mock messages if none exist in localStorage
    useEffect(() => {
        if (!courseId) return;
        const key = `ta3_chat_${courseId}`;
        const saved = localStorage.getItem(key);
        if (saved) {
            setMessages(JSON.parse(saved));
        } else {
            const initialMessages: ChatMessage[] = [
                {
                    id: 1,
                    sender: 'teacher',
                    senderName: course?.teacher || "د. خالد",
                    content: "مرحباً بك في مقررنا الدراسي. يمكنك طرح استفساراتك هنا وسأقوم بالرد عليها في أقرب وقت.",
                    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
                }
            ];
            setMessages(initialMessages);
            localStorage.setItem(key, JSON.stringify(initialMessages));
        }
    }, [courseId, course]);

    // Scroll to bottom on new messages
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim() || !user || !courseId) return;

        const newMsg: ChatMessage = {
            id: Date.now(),
            sender: user.role === 'teacher' ? 'teacher' : 'student',
            senderName: user.name,
            content: inputText.trim(),
            createdAt: new Date().toISOString()
        };

        const updated = [...messages, newMsg];
        setMessages(updated);
        localStorage.setItem(`ta3_chat_${courseId}`, JSON.stringify(updated));
        setInputText("");

        // If student is sending, simulate a teacher response
        if (user.role === 'student') {
            setIsTyping(true);
            setTimeout(() => {
                const autoReply: ChatMessage = {
                    id: Date.now() + 1,
                    sender: 'teacher',
                    senderName: course?.teacher || "د. خالد",
                    content: "أهلاً بك يا أحمد، لقد تلقيت استفسارك وسأجيبك بالتفصيل قريباً إن شاء الله.",
                    createdAt: new Date().toISOString()
                };
                const withReply = [...updated, autoReply];
                setMessages(withReply);
                localStorage.setItem(`ta3_chat_${courseId}`, JSON.stringify(withReply));
                setIsTyping(false);
                toast.info("تم تلقي رد جديد من المعلم");
            }, 1800);
        }
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
        <DashboardLayout title={`التواصل مع المعلم - ${course.name}`}>
            <div className="flex flex-col h-[calc(100vh-140px)] space-y-4" dir="rtl">
                {/* Header Navigation */}
                <div className="flex justify-between items-center border-b border-border/40 pb-3 flex-shrink-0 text-right">
                    <div className="space-y-0.5">
                        <div className="flex items-center gap-2 justify-end text-xs text-muted-foreground">
                            <Link to={backPath} className="hover:text-primary transition-colors flex items-center gap-1">
                                {course.name}
                                <ArrowRight className="h-3 w-3" />
                            </Link>
                            <span>/</span>
                            <span className="font-semibold text-foreground">التواصل</span>
                        </div>
                        <h1 className="text-xl font-bold text-foreground">مراسلة المعلم: {course.teacher}</h1>
                    </div>
                </div>

                {/* Messages Chatbox Area */}
                <div className="flex-1 bg-slate-50/50 border border-border/50 rounded-2xl p-4 overflow-y-auto space-y-4 shadow-inner">
                    {messages.map((msg) => {
                        const isMe = (user?.role === 'teacher' && msg.sender === 'teacher') || 
                                     (user?.role !== 'teacher' && msg.sender === 'student');
                        return (
                            <div
                                key={msg.id}
                                className={`flex flex-col max-w-[75%] space-y-1 ${
                                    isMe ? "mr-auto items-start" : "ml-auto items-end"
                                }`}
                            >
                                <span className="text-[10px] text-muted-foreground font-semibold px-1">
                                    {msg.senderName}
                                </span>
                                <div
                                    className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm font-medium ${
                                        isMe
                                            ? "bg-primary text-primary-foreground rounded-tl-none text-left"
                                            : "bg-card text-foreground border border-border/60 rounded-tr-none text-right"
                                    }`}
                                >
                                    <p className="whitespace-pre-wrap">{msg.content}</p>
                                </div>
                                <div className={`flex items-center gap-1 text-[9px] text-muted-foreground px-1 ${
                                    isMe ? "justify-start" : "justify-end"
                                }`}>
                                    <span>{new Date(msg.createdAt).toLocaleTimeString("ar-EG", { hour: '2-digit', minute: '2-digit' })}</span>
                                    {isMe && <CheckCheck className="h-3 w-3 text-primary" />}
                                </div>
                            </div>
                        );
                    })}

                    {/* Teacher Typing Indicator */}
                    {isTyping && (
                        <div className="flex flex-col max-w-[70%] space-y-1 ml-auto items-end">
                            <span className="text-[10px] text-muted-foreground font-semibold px-1">{course.teacher}</span>
                            <div className="bg-card border border-border/50 rounded-2xl px-4 py-3 rounded-tr-none flex items-center gap-1 shadow-sm">
                                <span className="h-1.5 w-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="h-1.5 w-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="h-1.5 w-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                {/* Input Controls */}
                <form onSubmit={handleSendMessage} className="flex gap-2 items-center flex-shrink-0">
                    <Button type="submit" className="h-10 px-4 font-bold flex items-center gap-1.5">
                        <Send className="h-4 w-4" />
                        <span>إرسال</span>
                    </Button>
                    <Input
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder={user?.role === 'teacher' ? "اكتب رسالة للطلاب..." : `اكتب رسالتك لـ ${course.teacher}...`}
                        className="flex-1 text-right focus-visible:ring-primary/50 h-10 text-sm"
                        required
                    />
                </form>
            </div>
        </DashboardLayout>
    );
}
