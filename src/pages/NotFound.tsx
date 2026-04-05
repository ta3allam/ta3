import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="page-center-layout">
      <div className="text-center">
        <h1 className="title-xl">404</h1>
        <p className="text-xl text-muted-foreground mb-4">عذراً، الصفحة غير موجودة</p>
        <a href="/" className="text-primary underline">
          العودة للصفحة الرئيسية
        </a>
      </div>
    </div>
  );
};

export default NotFound;
