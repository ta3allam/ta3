import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Helmet } from "react-helmet-async";
import { NavLink } from "react-router-dom";

const Index = () => {
  return (
    <main>
      <Helmet>
        <title>تعلّم | منصة إدارة التعلّم </title>
        <meta name="description" content="منصة عربية حديثة لإدارة التعلّم بثلاث لوحات: المسؤول، المعلم، والطالب." />
        <link rel="canonical" href="/" />
      </Helmet>
      <section className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center container py-16">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-right">
            <span className="bg-gradient-primary bg-clip-text text-transparent animate-gradient-x">تعلّم</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 text-right">منصة عربية حديثة لإدارة التعلّم.</p>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="shadow-elev">
              <CardContent className="p-6 text-right space-y-4">
                <h3 className="text-2xl font-bold">لوحة المسؤول</h3>
                <p className="text-muted-foreground">إدارة المستخدمين والمقررات والطلبات.</p>
                <NavLink to="/admin" className="inline-block">
                  <Button variant="hero">الدخول</Button>
                </NavLink>
              </CardContent>
            </Card>

            <Card className="shadow-elev">
              <CardContent className="p-6 text-right space-y-4">
                <h3 className="text-2xl font-bold">لوحة المعلم</h3>
                <p className="text-muted-foreground">إدارة المحتوى والإعلانات والطلاب.</p>
                <NavLink to="/teacher" className="inline-block">
                  <Button variant="hero">الدخول</Button>
                </NavLink>
              </CardContent>
            </Card>

            <Card className="shadow-elev">
              <CardContent className="p-6 text-right space-y-4">
                <h3 className="text-2xl font-bold">لوحة الطالب</h3>
                <p className="text-muted-foreground">تصفح المقررات والمواد وتتبع التقدم.</p>
                <NavLink to="/student" className="inline-block">
                  <Button variant="hero">الدخول</Button>
                </NavLink>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Index;
