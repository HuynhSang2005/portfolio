import { ThemeProvider } from "@wrksz/themes/next";
import type { Metadata, Viewport } from "next";
import type React from "react";

import { Providers } from "@/app/providers";
import Navigation from "@/components/layout/navigation";
import { META_THEME_COLORS, SITE_URL, siteConfig } from "@/config/site";
import { fontMono, fontX } from "@/lib/fonts";
import { cn } from "@/lib/utils";

import "./globals.css";

export const viewport: Viewport = {
  themeColor: META_THEME_COLORS.light,
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${siteConfig.name} — ${siteConfig.jobTitle}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
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
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-foreground focus:text-sm focus:ring-2 focus:ring-ring"
        >
          Skip to content
        </a>
        {/* ThemeProvider từ @wrksz/themes/next là async RSC — không đặt trong "use client". */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
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
        </ThemeProvider>
      </body>
    </html>
  );
}
