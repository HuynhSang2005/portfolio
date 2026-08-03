import { BracesIcon, FileCodeIcon, FileTerminalIcon, FileTypeIcon } from "lucide-react";
import type { ReactNode } from "react";

const LANGUAGE_ICONS: Record<string, ReactNode> = {
  ts: <FileTypeIcon className="size-3.5" />,
  tsx: <FileTypeIcon className="size-3.5" />,
  js: <FileCodeIcon className="size-3.5" />,
  jsx: <FileCodeIcon className="size-3.5" />,
  json: <BracesIcon className="size-3.5" />,
  bash: <FileTerminalIcon className="size-3.5" />,
  shell: <FileTerminalIcon className="size-3.5" />,
};

/** Icon lucide theo phần mở rộng ngôn ngữ code block; mặc định {@link FileCodeIcon}. */
export function getIconForLanguageExtension(language: string): ReactNode {
  return LANGUAGE_ICONS[language] ?? <FileCodeIcon className="size-3.5" />;
}
