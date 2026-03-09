import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { M3 } from "tauri-plugin-m3";

import appCss from "../styles.css?url";

export const RootComponent: React.FC = () => {
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const updateStatusBar = (e: MediaQueryListEvent | MediaQueryList) => {
      M3.setBarColor(e.matches ? "dark" : "light");
    };

    updateStatusBar(mediaQuery);
    mediaQuery.addEventListener("change", updateStatusBar);
    return () => mediaQuery.removeEventListener("change", updateStatusBar);
  }, []);

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="antialiased">
        <Outlet />
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
