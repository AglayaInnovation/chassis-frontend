import Link from "next/link";
import { Code2, Webhook, Gauge } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home(): JSX.Element {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="h-6 w-6" />
            <h1 className="text-xl font-bold">@aglaya</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-4xl font-bold mb-4">
          Welcome to @aglaya Examples
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Interactive demos and examples for all @aglaya packages. Explore our
          collection of React hooks, API utilities, and UI components.
        </p>
      </section>

      {/* Examples Grid */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Hooks Demo */}
          <Link
            href="/hooks-demo"
            className="group relative overflow-hidden rounded-lg border bg-card p-6 hover:shadow-lg transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <Gauge className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                  Hooks Demo
                </h3>
                <p className="text-sm text-muted-foreground">
                  Interactive demos of all @aglaya/hooks including useDebounce,
                  useLocalStorage, useOnlineStatus, and more.
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm font-medium text-primary">
              View Examples
              <span className="ml-1 group-hover:translate-x-1 transition-transform">
                →
              </span>
            </div>
          </Link>

          {/* API Core Demo */}
          <Link
            href="/api-demo"
            className="group relative overflow-hidden rounded-lg border bg-card p-6 hover:shadow-lg transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <Webhook className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                  API Core Demo
                </h3>
                <p className="text-sm text-muted-foreground">
                  See @aglaya/api-core in action with live HTTP request
                  examples, error handling, and more.
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm font-medium text-primary">
              View Examples
              <span className="ml-1 group-hover:translate-x-1 transition-transform">
                →
              </span>
            </div>
          </Link>

          {/* Placeholder for future examples */}
          <div className="relative overflow-hidden rounded-lg border bg-muted/50 p-6 opacity-60">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-muted p-3">
                <Code2 className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">
                  More Examples Coming Soon
                </h3>
                <p className="text-sm text-muted-foreground">
                  We're working on adding more examples and demos. Stay tuned!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>Built with Next.js, Tailwind CSS, and shadcn/ui</p>
        </div>
      </footer>
    </div>
  );
}
