import { SCROLL_AREA_ID } from "@/config/site";
import { cn } from "@/lib/utils";

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Gắn `id={SCROLL_AREA_ID}` để hook scroll và dock/header tìm đúng vùng scroll. */
  useScrollAreaId?: boolean;
}

/**
 * Vùng scroll chính của layout — wrapper flex column với class `scrollable-area`.
 *
 * @param useScrollAreaId — khi `true`, gán `id` theo `SCROLL_AREA_ID` từ site config.
 */
export const ScrollArea = ({ useScrollAreaId = false, className, ...props }: ScrollAreaProps) => (
  <div
    {...(useScrollAreaId && { id: SCROLL_AREA_ID })}
    className={cn("scrollable-area relative flex w-full flex-col", className)}
    {...props}
  />
);
