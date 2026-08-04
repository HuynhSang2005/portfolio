"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

import { UiStoreProvider } from "@/providers/ui-store-provider";

/**
 * Client providers tree — Query / ui-store.
 * Theme sống ở RSC `ThemeProvider` trong `layout.tsx` (`@wrksz/themes/next` là async).
 */
export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <UiStoreProvider>{children}</UiStoreProvider>
    </QueryClientProvider>
  );
}
