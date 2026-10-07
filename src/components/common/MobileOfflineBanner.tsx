import React, { useState, useEffect } from "react";
import { WifiOff, Wifi, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function MobileOfflineBanner() {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== "undefined" ? navigator.onLine : true;
  });
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        toast.success("تمت استعادة الاتصال بالإنترنت بنجاح! جاري مزامنة البيانات.");
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
      toast.warning("تم فقدان الاتصال بالإنترنت. تم تفعيل نمط الحفظ المحلي دون اتصال.");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [wasOffline]);

  if (isOnline && !wasOffline) return null;

  if (isOnline && wasOffline) {
    return (
      <div
        className="bg-emerald-700 text-white px-4 py-2 text-xs font-bold flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top duration-300"
        dir="rtl"
        role="status"
      >
        <div className="flex items-center gap-2">
          <Wifi className="w-4 h-4 text-emerald-200" />
          <span>تمت استعادة الاتصال بالشبكة • بياناتك متزامنة بالكامل</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setWasOffline(false)}
          className="h-6 text-[11px] text-white hover:bg-emerald-800 rounded px-2"
        >
          إخفاء
        </Button>
      </div>
    );
  }

  return (
    <div
      className="bg-[#6B1F2A] text-white px-4 py-2.5 text-xs font-bold flex items-center justify-between shadow-md border-b border-rose-900 sticky top-0 z-50 animate-in fade-in slide-in-from-top duration-300"
      dir="rtl"
      role="alert"
    >
      <div className="flex items-center gap-2">
        <WifiOff className="w-4 h-4 text-rose-200 animate-pulse" />
        <div>
          <span>أنت تعمل في وضع عدم الاتصال (Offline)</span>
          <span className="hidden sm:inline text-rose-200 mr-2 text-[11px] font-normal">
            • المنشورات والمسودات وملاحظات الدروس يتم حفظها محلياً تلقائياً
          </span>
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          if (navigator.onLine) {
            setIsOnline(true);
            setWasOffline(false);
            toast.success("تم التحقق من الاتصال بالشبكة");
          } else {
            toast.error("لا يزال الجهاز غير متصل بالإنترنت");
          }
        }}
        className="h-6 text-[11px] bg-white/10 hover:bg-white/20 text-white border-white/30 rounded px-2.5 gap-1"
      >
        <RefreshCw className="w-3 h-3" />
        إعادة فحص الاتصال
      </Button>
    </div>
  );
}
