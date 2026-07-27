import { format, formatDistance, formatDistanceToNow, parseISO } from "date-fns";

export function formatDate(
  value: Date | string | number,
  locale = "en-US",
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  },
): string {
  const date = typeof value === "string" ? parseISO(value) : new Date(value);
  return new Intl.DateTimeFormat(locale, options).format(date);
}

export function formatDatePattern(value: Date | string | number, pattern = "yyyy-MM-dd"): string {
  const date = typeof value === "string" ? parseISO(value) : new Date(value);
  return format(date, pattern);
}

export function formatRelative(value: Date | string | number, baseDate = new Date()): string {
  const date = typeof value === "string" ? parseISO(value) : new Date(value);
  return formatDistance(date, baseDate, { addSuffix: true });
}

export function formatRelativeToNow(value: Date | string | number): string {
  const date = typeof value === "string" ? parseISO(value) : new Date(value);
  return formatDistanceToNow(date, { addSuffix: true });
}
