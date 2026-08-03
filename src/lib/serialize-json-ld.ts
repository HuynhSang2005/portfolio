/**
 * Serialize JSON-LD for embedding in `<script type="application/ld+json">`.
 * Escapes `<` so a payload cannot break out of the script element (XSS).
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
