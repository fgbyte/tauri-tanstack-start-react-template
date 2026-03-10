import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { M3 } from "tauri-plugin-m3";

import appCss from "../styles.css?url";

const queryClient = new QueryClient();

interface InsetsScheme {
  adjustedInsetTop?: number;
  adjustedInsetBottom?: number;
}

export const RootComponent: React.FC = () => {
  const [insetTop, setInsetTop] = useState(0);
  const [insetBottom, setInsetBottom] = useState(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const updateStatusBar = (e: MediaQueryListEvent | MediaQueryList) => {
      M3.setBarColor(e.matches ? "light" : "dark");
    };

    const setupInsets = async () => {
      const insets = await M3.getInsets();
      if (insets && typeof insets === "object") {
        const typedInsets = insets as InsetsScheme;
        setInsetTop(typedInsets.adjustedInsetTop ?? 0);
        setInsetBottom(typedInsets.adjustedInsetBottom ?? 0);
      }
    };

    updateStatusBar(mediaQuery);
    void setupInsets();
    mediaQuery.addEventListener("change", updateStatusBar);
    return () => mediaQuery.removeEventListener("change", updateStatusBar);
  }, []);

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body
        className="antialiased"
        style={
          {
            paddingTop: insetTop,
            paddingBottom: insetBottom,
          } as React.CSSProperties
        }
      >
        <QueryClientProvider client={queryClient}>
          <Outlet />
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  );
};

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Tauri + TanStack Start",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),

  component: RootComponent,
});
