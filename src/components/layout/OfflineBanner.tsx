import { useState, useEffect } from "react";
import { WifiOff, Wifi, RefreshCw } from "lucide-react";
import { OfflineDraftStore } from "@/lib/pwa/offlineDraftStore";
import { toast } from "sonner";

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [unsyncedCount, setUnsyncedCount] = useState(0);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      toast.success("تمت استعادة الاتصال بالإنترنت بنجاح! جاري مزامنة المسودات...");
    };

    const handleOffline = () => {
      setIsOffline(true);
      const unsynced = OfflineDraftStore.getUnsyncedDrafts().length;
      setUnsyncedCount(unsynced);
      toast.warning("أنت تعمل الآن في الوضع غير المتصل بالإنترنت (Offline Mode). يتم حفظ مسوداتك محلياً.");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="bg-[#6B1F2A] text-white py-2 px-4 text-xs font-bold flex items-center justify-between shadow-md" dir="rtl">
      <div className="flex items-center gap-2">
        <WifiOff className="h-4 w-4 text-[#EDEBE0] animate-pulse" />
        <span>أنت غير متصل بالإنترنت حالياً — المنصة تعمل في وضع الحفظ المحلي (Offline Mode).</span>
      </div>
      {unsyncedCount > 0 && (
        <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-[11px]">
          {unsyncedCount} مسودات محفوظة بانتظار المزامنة
        </span>
      )}
    </div>
  );
}
