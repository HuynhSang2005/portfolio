"use client";

/** Error boundary gốc — cho phép retry render mà không reload trang. */
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="layout content-wrapper flex min-h-[60vh] flex-col items-start justify-center gap-4">
      <h1 className="font-bold text-2xl tracking-tight">Something went wrong</h1>
      <p className="text-muted-foreground text-sm">
        An unexpected error occurred. Please try again.
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-lg bg-muted px-4 py-2 font-medium text-foreground text-sm transition-colors hover:bg-accent"
      >
        Try again
      </button>
    </div>
  );
}
