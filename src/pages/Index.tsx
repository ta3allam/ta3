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
      <section className="page-center-layout">
        <div className="text-center container py-16">
          <h1 className="hero-header">
            <span className="text-primary">تعلّم</span>
          </h1>
          <p className="hero-text">منصة عربية حديثة لإدارة التعلّم.</p>

          <div className="grid-dashboard">
            <Card className="shadow-elev">
              <CardContent className="card-content-rtl">
                <h3 className="text-2xl font-bold">لوحة المسؤول</h3>
                <p className="text-muted-foreground">إدارة المستخدمين والمقررات والطلبات.</p>
                <NavLink to="/admin" className="inline-block">
                  <Button variant="hero">الدخول</Button>
                </NavLink>
              </CardContent>
            </Card>

            <Card className="shadow-elev">
              <CardContent className="card-content-rtl">
                <h3 className="text-2xl font-bold">لوحة المعلم</h3>
                <p className="text-muted-foreground">إدارة المحتوى والإعلانات والطلاب.</p>
                <NavLink to="/teacher" className="inline-block">
                  <Button variant="hero">الدخول</Button>
                </NavLink>
              </CardContent>
            </Card>

            <Card className="shadow-elev">
              <CardContent className="card-content-rtl">
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
