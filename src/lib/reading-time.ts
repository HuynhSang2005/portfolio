const WORDS_PER_MINUTE = 238;

/**
 * Ước tính thời gian đọc từ nội dung markdown/MDX.
 *
 * @param content - Nội dung thô (có thể chứa code fence và markdown syntax).
 * @returns Chuỗi định dạng `"N min read"` (spec §7.2), làm tròn lên, tối thiểu 1 phút.
 */
export function computeReadTime(content: string): string {
  const stripped = content.replace(/```[\s\S]*?```/g, " ").replace(/[#>*`\-[\]()!]/g, " ");
  const words = stripped.split(/\s+/).filter((token) => /[\p{L}\p{N}]/u.test(token));
  const minutes = Math.max(1, Math.ceil(words.length / WORDS_PER_MINUTE));
  return `${minutes} min read`;
}
