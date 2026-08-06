import { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCourseData } from "@/contexts/CourseContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Send, User, CheckCheck, ArrowRight, Clock, Mail, MessageSquare } from "lucide-react";

interface ChatMessage {
  id: number;
  sender: 'student' | 'teacher';
  senderName: string;
  content: string;
  createdAt: string;
}

function formatStandardTime(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
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
          content: "مرحباً بك في مقررنا الدراسي. يمكنك طرح استفساراتك هنا وسأقوم بالرد عليها في أقرب وقت خلال الساعات المكتبية.",
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
        }
      ];
      setMessages(initialMessages);
      localStorage.setItem(key, JSON.stringify(initialMessages));
    }
  }, [courseId, course]);

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

    if (user.role === 'student') {
      setIsTyping(true);
      setTimeout(() => {
        const autoReply: ChatMessage = {
          id: Date.now() + 1,
          sender: 'teacher',
          senderName: course?.teacher || "د. خالد",
          content: "أهلاً بك، تم استلام استفسارك وسأراجع تفاصيله وأرد عليك باقرب وقت إن شاء الله.",
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
      <div className="space-y-6" dir="rtl">
        {/* Navigation Breadcrumb & Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#428177]/20 pb-4">
          <div className="text-right space-y-1">
            <div className="flex items-center gap-2 justify-start text-xs text-[#3D3A3B]">
              <Link to={backPath} className="hover:text-[#428177] transition-colors flex items-center gap-1 font-semibold">
                {course.name}
                <ArrowRight className="h-3 w-3" />
              </Link>
              <span>/</span>
              <span className="font-bold text-[#002623]">المراسلة والتواصل</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#002623]">مراسلة أستاذ المادة: {course.teacher}</h1>
            <p className="text-xs text-[#3D3A3B] font-medium">قناة تواصل مباشرة ومحمية لمناقشة التساؤلات الفردية والملاحظات الخاصة بالمقرر</p>
          </div>

          <div className="flex items-center gap-2 bg-[#EDEBE0]/60 px-4 py-2 rounded-xl border border-[#428177]/20 text-xs font-bold text-[#002623]">
            <Clock className="w-4 h-4 text-[#428177]" />
            <span>الساعات المكتبية: الأحد والأربعاء (10:00 - 12:00)</span>
          </div>
        </div>

        {/* Chat Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Office Hours Sidebar Card */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="border border-[#428177]/30 bg-white shadow-sm rounded-2xl overflow-hidden text-right">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center gap-2 justify-start text-[#002623] border-b border-[#EDEBE0] pb-3">
                  <User className="w-5 h-5 text-[#428177]" />
                  <div>
                    <h3 className="font-bold text-sm">{course.teacher}</h3>
                    <span className="text-[11px] text-[#3D3A3B]">أستاذ مقرر {course.code}</span>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-[#3D3A3B]">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#002623]">حالة الاستجابة:</span>
                    <span className="bg-[#428177]/15 text-[#054239] px-2 py-0.5 rounded-full font-bold">نشط اليوم</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#002623]">البريد الأكاديمي:</span>
                    <span className="font-semibold dir-ltr">teacher@ta3.edu</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#002623]">المكتب:</span>
                    <span className="font-semibold">مبنى العلوم - 204</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Feed & Input */}
          <div className="lg:col-span-3 flex flex-col h-[520px] bg-white border border-[#428177]/30 rounded-2xl p-4 shadow-sm">
            <div className="flex-1 bg-[#EDEBE0]/20 rounded-xl p-4 overflow-y-auto space-y-4 border border-[#428177]/10">
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
                    <span className="text-[10px] text-[#3D3A3B] font-bold px-1">
                      {msg.senderName}
                    </span>
                    <div
                      className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm font-medium ${
                        isMe
                          ? "bg-[#428177] text-white rounded-tl-none text-left"
                          : "bg-white text-[#002623] border border-[#428177]/20 rounded-tr-none text-right"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                    <div className={`flex items-center gap-1 text-[9px] text-[#3D3A3B] px-1 ${
                      isMe ? "justify-start" : "justify-end"
                    }`}>
                      <span>{formatStandardTime(msg.createdAt)}</span>
                      {isMe && <CheckCheck className="h-3 w-3 text-[#428177]" />}
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex flex-col max-w-[70%] space-y-1 ml-auto items-end">
                  <span className="text-[10px] text-[#3D3A3B] font-bold px-1">{course.teacher}</span>
                  <div className="bg-white border border-[#428177]/20 rounded-2xl px-4 py-3 rounded-tr-none flex items-center gap-1 shadow-sm">
                    <span className="h-1.5 w-1.5 bg-[#428177] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-1.5 w-1.5 bg-[#428177] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-1.5 w-1.5 bg-[#428177] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-2 items-center pt-3 mt-auto">
              <Button type="submit" className="h-10 px-5 bg-[#428177] hover:bg-[#054239] text-white font-bold flex items-center gap-1.5">
                <Send className="h-4 w-4" />
                <span>إرسال</span>
              </Button>
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={user?.role === 'teacher' ? "اكتب رسالة للطلاب..." : `اكتب رسالتك لـ ${course.teacher}...`}
                className="flex-1 text-right border-[#428177]/30 focus-visible:ring-[#428177] h-10 text-sm font-medium bg-white"
                required
              />
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
