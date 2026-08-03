import type { Metadata, Viewport } from "next";
import type React from "react";

import { Providers } from "@/app/providers";
import Navigation from "@/components/layout/navigation";
import { META_THEME_COLORS } from "@/config/site";
import { fontMono, fontX } from "@/lib/fonts";
import { cn } from "@/lib/utils";

import "./globals.css";

export const viewport: Viewport = {
  themeColor: META_THEME_COLORS.light,
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Huỳnh Sang",
  description: "Personal portfolio",
};

const platformScript = String.raw`
  try {
    if (/(Mac|iPhone|iPod|iPad)/i.test(navigator.platform)) {
      document.documentElement.classList.add('os-macos')
    }
  } catch (_) {}
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(fontX.variable, fontMono.variable, "scroll-smooth")}
      suppressHydrationWarning
    >
      <head>
        <script type="text/javascript" dangerouslySetInnerHTML={{ __html: platformScript }} />
      </head>
      <body suppressHydrationWarning>
        <Providers>
          <Navigation />
          <main
            id="main-content"
            vaul-drawer-wrapper=""
            className="relative min-h-screen w-full bg-background"
          >
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
