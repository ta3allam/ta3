import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Users, Star, BookOpen, Globe } from "lucide-react";

export interface CreatorProfileProps {
  name: string;
  username: string;
  bio: string;
  avatarUrl?: string;
  rating?: number;
  totalFollowers: number;
  totalCourses: number;
  isVerified?: boolean;
}

export function CreatorProfileCard({
  name,
  username,
  bio,
  avatarUrl,
  rating = 4.9,
  totalFollowers,
  totalCourses,
  isVerified = true
}: CreatorProfileProps) {
  return (
    <Card className="border border-[#428177]/30 bg-white shadow-sm rounded-2xl overflow-hidden text-right" dir="rtl">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-[#428177]">
              <AvatarImage src={avatarUrl} alt={name} />
              <AvatarFallback className="bg-[#428177] text-white font-extrabold text-lg">
                {name.substring(0, 2)}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-1 text-right">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-[#002623]">{name}</h2>
                {isVerified && (
                  <Badge className="bg-[#428177]/15 text-[#054239] border border-[#428177]/30 gap-1 text-[11px] font-bold">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#428177]" />
                    صانع محتوى معتمد
                  </Badge>
                )}
              </div>
              <p className="text-xs text-[#3D3A3B] font-semibold">{username}</p>
              <p className="text-xs text-[#3D3A3B] leading-relaxed max-w-xl">{bio}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-[#EDEBE0]/60 p-3 rounded-xl border border-[#428177]/20 text-xs font-bold text-[#002623] self-stretch md:self-auto justify-around">
            <div className="flex items-center gap-1.5 px-2">
              <Star className="h-4 w-4 text-[#988561] fill-[#988561]" />
              <span>{rating} تقييم المنصة</span>
            </div>
            <div className="h-4 w-[1px] bg-[#428177]/20"></div>
            <div className="flex items-center gap-1.5 px-2">
              <Users className="h-4 w-4 text-[#428177]" />
              <span>{totalFollowers} متابع</span>
            </div>
            <div className="h-4 w-[1px] bg-[#428177]/20"></div>
            <div className="flex items-center gap-1.5 px-2">
              <BookOpen className="h-4 w-4 text-[#428177]" />
              <span>{totalCourses} دورات</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
