import { cn } from "@/lib/utils";

type SectionProps = {
  /** Class cho phần tử `<section>` ngoài cùng. */
  sectionClassName?: string;
  ref?: React.Ref<HTMLElement>;
} & React.HTMLAttributes<HTMLElement>;

/** Góc chrome — vạch góc ẩn trên mobile, hiện từ `sm`. */
const CornerMark = ({
  position,
}: {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}) => {
  const isTop = position.includes("top");
  const isLeft = position.includes("left");

  return (
    <div
      className={cn(
        "absolute hidden h-1.5 w-1.5 bg-transparent sm:block",
        isTop ? "top-0" : "bottom-0",
        isLeft ? "left-0" : "right-0",
        isTop && isLeft && "border-l border-t border-foreground/30",
        isTop && !isLeft && "border-r border-t border-foreground/30",
        !isTop && isLeft && "border-l border-b border-foreground/30",
        !isTop && !isLeft && "border-r border-b border-foreground/30",
      )}
    />
  );
};

/**
 * Khối nội dung có chrome góc + đường viền dọc hai bên (template parity).
 *
 * Corner marks và side lines chỉ hiển thị từ breakpoint `sm` trở lên.
 */
export const Section = ({ children, sectionClassName, className, ref, ...props }: SectionProps) => (
  <section ref={ref} className={sectionClassName} {...props}>
    <div className="relative mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
      <div className={cn("relative py-3 sm:px-3 md:py-4", className)}>
        <CornerMark position="top-left" />
        <CornerMark position="top-right" />
        <CornerMark position="bottom-left" />
        <CornerMark position="bottom-right" />
        <div className="absolute left-0 top-1.5 bottom-1.5 hidden w-px bg-foreground/10 sm:block" />
        <div className="absolute right-0 top-1.5 bottom-1.5 hidden w-px bg-foreground/10 sm:block" />
        {children}
      </div>
    </div>
  </section>
);

Section.displayName = "Section";
