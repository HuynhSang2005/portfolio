import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/** Khung figure bọc quote và thông tin tác giả của một testimonial. */
export function Testimonial({ className, ...props }: ComponentProps<"figure">) {
  return <figure className={cn("flex h-full flex-col", className)} {...props} />;
}

/** Trích dẫn testimonial — chiếm phần còn lại theo chiều dọc trong card. */
export function TestimonialQuote({ className, ...props }: ComponentProps<"blockquote">) {
  return (
    <blockquote
      className={cn("grow px-4 py-3 text-base text-pretty text-foreground", className)}
      {...props}
    />
  );
}

/** Vùng figcaption chứa avatar và tên/title tác giả (grid 2 cột). */
export function TestimonialAuthor({ className, ...props }: ComponentProps<"figcaption">) {
  return (
    <figcaption
      className={cn(
        "grid grid-cols-[auto_1fr] grid-rows-2 items-center gap-x-3.5 px-4 pt-1 pb-3",
        className,
      )}
      {...props}
    />
  );
}

/** Ô avatar vuông 32px, span 2 hàng trong grid tác giả. */
export function TestimonialAvatar({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("relative row-span-2 size-8 shrink-0", className)} {...props} />;
}

/** Ảnh đại diện tác giả — dùng thẻ img thuần cho URL avatar bên ngoài. */
export function TestimonialAvatarImg({ className, src, alt, ...props }: ComponentProps<"img">) {
  return (
    // oxlint-disable-next-line nextjs/no-img-element -- template pattern: plain img for external avatars
    <img
      className={cn("size-8 rounded-full select-none", className)}
      src={src}
      alt={alt}
      loading="lazy"
      {...props}
    />
  );
}

/** Viền ring mỏng phủ lên avatar (pointer-events-none). */
export function TestimonialAvatarRing({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 rounded-full ring-1 ring-black/10 ring-inset dark:ring-white/15",
        className,
      )}
      {...props}
    />
  );
}

/** Tên tác giả — font semibold, cỡ sm. */
export function TestimonialAuthorName({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 text-sm leading-4 font-semibold text-foreground",
        className,
      )}
      {...props}
    />
  );
}

/** Tagline/chức danh tác giả — text muted, cỡ xs. */
export function TestimonialAuthorTagline({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("text-xs leading-4 text-balance text-muted-foreground", className)}
      {...props}
    />
  );
}
