import { cn } from "@/lib/utils";

/**
 * Dải phân cách nét đứt giữa các section — không nhầm với `ui/separator` (Base UI).
 *
 * Dùng utility `bg-dashed` từ globals.css cho pattern sọc 45°.
 */
const Separator = ({ className }: { className?: string }) => (
  <div className="relative mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
    <div className={cn("h-8 bg-dashed ring-[0.65px] ring-foreground/10", className)} />
  </div>
);

export default Separator;
