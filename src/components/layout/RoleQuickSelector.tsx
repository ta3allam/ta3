import { Button } from "@/components/ui/button";
import { User, Shield, GraduationCap } from "lucide-react";

interface RoleQuickSelectorProps {
  onSelect: (username: string) => void;
}

export default function RoleQuickSelector({ onSelect }: RoleQuickSelectorProps) {
  const roles = [
    {
      id: "student",
      label: "طالب (Student)",
      icon: GraduationCap,
      color: "hover:bg-primary/10 hover:text-primary hover:border-primary/30",
    },
    {
      id: "teacher",
      label: "معلم (Teacher)",
      icon: User,
      color: "hover:bg-accent/10 hover:text-accent hover:border-accent/30",
    },
    {
      id: "admin",
      label: "مدير (Admin)",
      icon: Shield,
      color: "hover:bg-neutral-500/10 hover:text-neutral-500 hover:border-neutral-500/30",
    },
  ];

  return (
    <div className="space-y-3 pt-4 border-t border-border mt-4 w-full" dir="rtl">
      <p className="text-xs text-center text-muted-foreground font-medium">
        تسجيل دخول سريع للتجربة (المطورين):
      </p>
      <div className="grid grid-cols-3 gap-2">
        {roles.map((role) => {
          const Icon = role.icon;
          return (
            <Button
              key={role.id}
              variant="outline"
              type="button"
              onClick={() => onSelect(role.id)}
              className={`flex flex-col items-center gap-1.5 h-auto py-2.5 px-1 text-xs transition-all duration-200 border-dashed rounded-lg bg-card/50 ${role.color}`}
            >
              <Icon className="h-4 w-4" />
              <span>{role.label.split(" ")[0]}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
