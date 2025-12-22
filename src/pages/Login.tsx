import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";

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

    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4" dir="rtl">
            <Helmet>
                <title>تعلّم | منصة إدارة التعلّم </title>
                <meta name="description" content="منصة عربية حديثة لإدارة التعلّم بثلاث لوحات: المسؤول، المعلم، والطالب." />
                <link rel="canonical" href="/" />
            </Helmet>
            <section className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center container py-16">
                    <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-right">
                        <span className="text-primary">تعلّم</span>
                    </h1>
                    <p className="text-xl text-muted-foreground mb-10 text-right">منصة عربية حديثة لإدارة التعلّم.</p>
                </div>
            </section>
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">تسجيل الدخول</CardTitle>
                    <CardDescription className="text-center">
                        أدخل بيانات الدخول الخاصة بك للمتابعة
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">اسم المستخدم</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="student / teacher / admin"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">كلمة المرور</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" type="submit" disabled={loading}>
                            {loading ? "جاري التحقق..." : "تسجيل الدخول"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
