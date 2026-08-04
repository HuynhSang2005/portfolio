import Link from "next/link";

/** Trang 404 — brand tối giản, link về home. */
export default function NotFound() {
  return (
    <div className="layout content-wrapper flex min-h-[60vh] flex-col items-start justify-center gap-4">
      <h1 className="font-bold text-4xl tracking-tight">404</h1>
      <p className="text-muted-foreground text-sm">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="rounded-lg bg-muted px-4 py-2 font-medium text-foreground text-sm transition-colors hover:bg-accent"
      >
        Back to home
      </Link>
    </div>
  );
}
