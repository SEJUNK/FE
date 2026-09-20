import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Receipts of a Life" },
      {
        name: "description",
        content: "A story assembled from eleven years of songs, purchases, places and notes.",
      },
      { property: "og:title", content: "Receipts of a Life" },
      {
        property: "og:description",
        content: "A story assembled from eleven years of songs, purchases, places and notes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,300..500&family=Inter:wght@400;500;600;700&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen overflow-x-hidden bg-ink text-cloud">
        <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/70 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-4 md:flex-row md:items-center md:justify-between md:px-10">
            <Link to="/" className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-xl border border-white/15 bg-white/5 font-display text-2xl text-accent">
                ✦
              </span>
              <span>
                <span className="block font-display text-2xl leading-none tracking-tight">Receipts of a Life</span>
                <span className="mt-1 block text-[10px] uppercase tracking-[0.25em] text-muted">
                  A story in fragments · 2013–2024
                </span>
              </span>
            </Link>
            <nav className="flex flex-wrap items-center gap-2 text-xs">
              <Link
                to="/"
                activeOptions={{ exact: true }}
                activeProps={{ className: "bg-white/15 text-cloud" }}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-muted transition hover:bg-white/10"
              >
                Overture
              </Link>
              <Link
                to="/explore"
                activeProps={{ className: "bg-white/15 text-cloud" }}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-muted transition hover:bg-white/10"
              >
                Explore
              </Link>
              <Link
                to="/patterns"
                activeProps={{ className: "bg-white/15 text-cloud" }}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-muted transition hover:bg-white/10"
              >
                What it means
              </Link>
            </nav>
          </div>
        </header>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
        <footer className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-2 px-6 py-6 text-[10px] uppercase tracking-[0.2em] text-muted md:px-10">
            <span>Receipts of a Life · built from three donated archives</span>
            <span>Streaming history · household ledger · card trail</span>
          </div>
        </footer>
      </div>
    </QueryClientProvider>
  );
}
