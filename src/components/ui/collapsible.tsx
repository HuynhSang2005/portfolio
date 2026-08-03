"use client";

import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";

import { cn } from "@/lib/utils";

/** Root collapsible — Base UI wrapper với `data-slot="collapsible"`. */
function Collapsible(props: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />;
}

/** Nút trigger — nhận `data-panel-open` khi panel mở. */
function CollapsibleTrigger(props: React.ComponentProps<typeof CollapsiblePrimitive.Trigger>) {
  return <CollapsiblePrimitive.Trigger data-slot="collapsible-trigger" {...props} />;
}

/**
 * Panel nội dung có animation bridge: map `--collapsible-panel-height` (Base UI)
 * sang `--radix-collapsible-content-height` cho tw-animate-css keyframes.
 */
function CollapsiblePanel({
  className,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Panel>) {
  return (
    <CollapsiblePrimitive.Panel
      data-slot="collapsible-panel"
      className={cn(
        "overflow-hidden [--radix-collapsible-content-height:var(--collapsible-panel-height)]",
        "data-[open]:animate-collapsible-down data-[closed]:animate-collapsible-up",
        className,
      )}
      {...props}
    />
  );
}

export { Collapsible, CollapsiblePanel, CollapsibleTrigger };
