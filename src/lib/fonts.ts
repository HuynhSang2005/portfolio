import { JetBrains_Mono as FontMono } from "next/font/google";
import localFont from "next/font/local";

/** Font monospace JetBrains Mono — dùng cho code và UI mono. */
export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});

/** Font chữ X (local woff2) — typography chính của template. */
export const fontX = localFont({
  src: [
    { path: "../../public/assets/X-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/assets/X-Medium.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-x",
});
