import { useState, useEffect } from "react";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";
import RoleQuickSelector from "@/components/layout/RoleQuickSelector";
import { LogIn, UserPlus } from "lucide-react";

export default function Login() {
    const { user, login, register } = useAuth();
    const navigate = useNavigate();

    // Login state
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginLoading, setLoginLoading] = useState(false);

    // Register state
    const [regName, setRegName] = useState("");
    const [regEmail, setRegEmail] = useState("");
    const [regPassword, setRegPassword] = useState("");
    const [regRole, setRegRole] = useState<UserRole>("student");
    const [regLoading, setRegLoading] = useState(false);

    // Dynamic redirection based on user role
    useEffect(() => {
        if (user) {
            if (user.role === 'student') navigate('/student', { replace: true });
            else if (user.role === 'teacher') navigate('/teacher', { replace: true });
            else if (user.role === 'admin') navigate('/admin', { replace: true });
        }
    }, [user, navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginLoading(true);

        try {
            const success = await login(username, password);
            if (success) {
                toast.success("تم تسجيل الدخول بنجاح");
            } else {
                toast.error("خطأ في اسم المستخدم أو كلمة المرور");
            }
        } catch (error) {
            toast.error("حدث خطأ أثناء تسجيل الدخول");
        } finally {
            setLoginLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!regEmail || !regPassword || !regName) return;
        setRegLoading(true);

        try {
            const res = await register(regEmail, regPassword, regName, regRole);
            if (res.success) {
                toast.success("تم إنشاء الحساب وتسجيل الدخول بنجاح");
            } else {
                toast.error(res.message || "حدث خطأ أثناء إنشاء الحساب");
            }
        } catch (error) {
            toast.error("حدث خطأ أثناء التسجيل");
        } finally {
            setRegLoading(false);
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

                {/* Login / Register Tabs Card */}
                <Card className="border border-border/80 shadow-lg bg-card/90 backdrop-blur-sm transition-all duration-300">
                    <Tabs defaultValue="login" dir="rtl" className="w-full">
                        <CardHeader className="space-y-3 pb-2">
                            <TabsList className="grid grid-cols-2 w-full bg-muted/60 p-1">
                                <TabsTrigger value="login" className="font-bold text-xs">تسجيل الدخول</TabsTrigger>
                                <TabsTrigger value="register" className="font-bold text-xs">إنشاء حساب جديد</TabsTrigger>
                            </TabsList>
                        </CardHeader>

                        {/* LOGIN TAB */}
                        <TabsContent value="login">
                            <form onSubmit={handleLogin}>
                                <CardContent className="space-y-4 pt-2">
                                    <div className="space-y-1.5 text-right">
                                        <Label htmlFor="username" className="text-xs font-semibold text-foreground/80">اسم المستخدم / البريد الإلكتروني</Label>
                                        <Input
                                            id="username"
                                            type="text"
                                            placeholder="مثال: student, teacher أو البريد الإلكتروني"
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
                                    <Button className="w-full font-bold shadow-sm" type="submit" disabled={loginLoading}>
                                        {loginLoading ? (
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
                        </TabsContent>

                        {/* REGISTER TAB */}
                        <TabsContent value="register">
                            <form onSubmit={handleRegister}>
                                <CardContent className="space-y-3 pt-2">
                                    <div className="space-y-1 text-right">
                                        <Label htmlFor="reg-name" className="text-xs font-semibold text-foreground/80">الاسم الكامل</Label>
                                        <Input
                                            id="reg-name"
                                            type="text"
                                            placeholder="مثال: أحمد عبد الله"
                                            value={regName}
                                            onChange={(e) => setRegName(e.target.value)}
                                            required
                                            className="text-right text-xs"
                                        />
                                    </div>
                                    <div className="space-y-1 text-right">
                                        <Label htmlFor="reg-email" className="text-xs font-semibold text-foreground/80">البريد الإلكتروني</Label>
                                        <Input
                                            id="reg-email"
                                            type="email"
                                            placeholder="user@domain.com"
                                            value={regEmail}
                                            onChange={(e) => setRegEmail(e.target.value)}
                                            required
                                            className="text-right text-xs"
                                        />
                                    </div>
                                    <div className="space-y-1 text-right">
                                        <Label htmlFor="reg-pass" className="text-xs font-semibold text-foreground/80">كلمة المرور</Label>
                                        <Input
                                            id="reg-pass"
                                            type="password"
                                            placeholder="••••••••"
                                            value={regPassword}
                                            onChange={(e) => setRegPassword(e.target.value)}
                                            required
                                            className="text-right text-xs"
                                        />
                                    </div>
                                    <div className="space-y-1 text-right">
                                        <Label htmlFor="reg-role" className="text-xs font-semibold text-foreground/80">نوع الحساب (الدور الأكاديمي)</Label>
                                        <Select value={regRole} onValueChange={(val) => setRegRole(val as UserRole)}>
                                            <SelectTrigger id="reg-role" className="text-right text-xs">
                                                <SelectValue placeholder="اختر الدور" />
                                            </SelectTrigger>
                                            <SelectContent dir="rtl">
                                                <SelectItem value="student">🎓 طالب علم</SelectItem>
                                                <SelectItem value="teacher">👨‍🏫 معلم مادة</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex flex-col gap-2 pt-2">
                                    <Button className="w-full font-bold shadow-sm bg-[#428177] hover:bg-[#054239] text-white" type="submit" disabled={regLoading}>
                                        {regLoading ? (
                                            <span className="flex items-center gap-2 justify-center">
                                                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                                                جاري التسجيل...
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1.5 justify-center">
                                                <UserPlus className="h-4 w-4" />
                                                إنشاء حساب جديد
                                            </span>
                                        )}
                                    </Button>
                                </CardFooter>
                            </form>
                        </TabsContent>
                    </Tabs>
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
