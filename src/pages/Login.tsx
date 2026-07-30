import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";
import RoleQuickSelector from "@/components/layout/RoleQuickSelector";
import { LogIn } from "lucide-react";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const success = await login(username, password);
            if (success) {
                toast.success("تم تسجيل الدخول بنجاح");
                if (username === "student") navigate("/student");
                else if (username === "teacher") navigate("/teacher");
                else if (username === "admin") navigate("/admin");
            } else {
                toast.error("خطأ في اسم المستخدم أو كلمة المرور");
            }
        } catch (error) {
            toast.error("حدث خطأ أثناء تسجيل الدخول");
        } finally {
            setLoading(false);
        }
    };

    const handleQuickSelect = (roleUsername: string) => {
        setUsername(roleUsername);
        setPassword("123");
        toast.info(`تم ملء بيانات الدخول لدور: ${
            roleUsername === "student" ? "طالب" : roleUsername === "teacher" ? "معلم" : "مدير"
        }`);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background/40 relative z-10" dir="rtl">
            <Helmet>
                <title>تعلّم | تسجيل الدخول</title>
                <meta name="description" content="منصة عربية حديثة لإدارة التعلّم بثلاث لوحات: المسؤول، المعلم، والطالب." />
                <link rel="canonical" href={import.meta.env.BASE_URL} />
            </Helmet>
            
            <div className="w-full max-w-md space-y-6">
                {/* Brand Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-5xl font-extrabold tracking-tight text-primary drop-shadow-sm select-none">
                        تعلّم
                    </h1>
                    <p className="text-sm text-muted-foreground font-medium">
                        منصة عربية حديثة لإدارة التعلّم
                    </p>
                </div>

                {/* Login Card */}
                <Card className="border border-border/80 shadow-lg bg-card/90 backdrop-blur-sm transition-all duration-300">
                    <CardHeader className="space-y-1 pb-4">
                        <CardTitle className="text-xl font-bold text-center">تسجيل الدخول</CardTitle>
                        <CardDescription className="text-center text-xs">
                            أدخل بيانات الدخول الخاصة بك للمتابعة
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleLogin}>
                        <CardContent className="space-y-4">
                            <div className="space-y-1.5 text-right">
                                <Label htmlFor="username" className="text-xs font-semibold text-foreground/80">اسم المستخدم</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="مثال: student, teacher"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="text-right focus-visible:ring-primary/50 transition-all duration-200"
                                />
                            </div>
                            <div className="space-y-1.5 text-right">
                                <Label htmlFor="password" className="text-xs font-semibold text-foreground/80">كلمة المرور</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="text-right focus-visible:ring-primary/50 transition-all duration-200"
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-2 pt-2">
                            <Button className="w-full font-bold shadow-sm" type="submit" disabled={loading}>
                                {loading ? (
                                    <span className="flex items-center gap-2 justify-center">
                                        <span className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent" />
                                        جاري التحقق...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1.5 justify-center">
                                        <LogIn className="h-4 w-4" />
                                        تسجيل الدخول
                                    </span>
                                )}
                            </Button>

                            {/* Dev Quick Selector */}
                            <RoleQuickSelector onSelect={handleQuickSelect} />
                        </CardFooter>
                    </form>
                </Card>

                {/* Footer notes / Help */}
                <div className="text-center">
                    <p className="text-xs text-muted-foreground">
                        نظام تعلّم الأكاديمي الموحد
                    </p>
                </div>
            </div>
        </div>
    );
}
