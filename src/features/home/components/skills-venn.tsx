import Image from "next/image";

import { cn } from "@/lib/utils";

/** Props cho biểu đồ Venn 4 kỹ năng với ảnh đại diện ở trung tâm. */
interface SkillsVennProps {
  profileImage: string;
  skills: {
    top: string;
    left: string;
    right: string;
    bottom: string;
  };
  className?: string;
}

/**
 * Biểu đồ Venn 4 vòng tròn (55% w/h) với nhãn kỹ năng và avatar trung tâm — RSC, không tương tác.
 *
 * @param profileImage - Đường dẫn ảnh đại diện (ví dụ `/assets/profile.jpg`).
 * @param skills - Nhãn 4 vị trí: top, left, right, bottom.
 */
export function SkillsVenn({ profileImage, skills, className }: SkillsVennProps) {
  return (
    <div className={cn("relative mx-auto w-full max-w-xs sm:max-w-md md:max-w-lg", className)}>
      <div className="relative aspect-square w-full">
        {/* Top circle */}
        <div className="absolute top-0 left-1/2 h-[55%] w-[55%] -translate-x-1/2 rounded-full border border-foreground/10" />

        {/* Left circle */}
        <div className="absolute top-[22%] left-[2%] h-[55%] w-[55%] rounded-full border border-foreground/10" />

        {/* Right circle */}
        <div className="absolute top-[22%] right-[2%] h-[55%] w-[55%] rounded-full border border-foreground/10" />

        {/* Bottom circle */}
        <div className="absolute bottom-0 left-1/2 h-[55%] w-[55%] -translate-x-1/2 rounded-full border border-foreground/10" />

        {/* Labels */}
        <span className="absolute top-[14%] left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-center text-[10px] sm:text-xs md:text-sm text-foreground/50">
          {skills.top}
        </span>

        <span className="absolute top-1/2 left-[15%] -translate-x-1/2 -translate-y-1/2 text-[10px] sm:text-xs md:text-sm text-foreground/50">
          {skills.left}
        </span>

        <span className="absolute top-1/2 right-[15%] translate-x-1/2 -translate-y-1/2 text-[10px] sm:text-xs md:text-sm text-foreground/50">
          {skills.right}
        </span>

        <span className="absolute bottom-[14%] left-1/2 -translate-x-1/2 translate-y-1/2 whitespace-pre-wrap text-center text-[10px] sm:text-xs md:text-sm leading-tight text-foreground/50">
          {skills.bottom}
        </span>

        {/* Center profile image */}
        <div className="absolute top-1/2 left-1/2 h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-2 sm:border-4 border-background shadow-md">
          <Image src={profileImage} alt="Profile" fill className="object-cover" />
        </div>
      </div>
    </div>
  );
}
