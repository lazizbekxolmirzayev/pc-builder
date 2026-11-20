import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Cpu, Globe, Menu, Moon, Search, Sun, X } from "lucide-react";
import { useState } from "react";
import { useI18n, LANGS } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", key: "nav.home" },
  { to: "/builder", key: "nav.builder" },
  { to: "/components", key: "nav.components" },
  { to: "/view3d", key: "nav.view3d" },
  { to: "/saved", key: "nav.saved" },
  { to: "/about", key: "nav.about" },
] as const;

export function Navbar() {
  const { t, lang, setLang } = useI18n();
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 shadow-[0_12px_40px_-28px_rgba(34,211,238,.7)] backdrop-blur-2xl">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex min-w-0 items-center gap-2.5 group">
          <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-[0_0_24px_-6px_var(--glow)] transition-transform group-hover:scale-105">
            <Cpu className="h-5 w-5" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-base font-black tracking-[0.08em]">
              PC BUILDER
            </span>
            <span className="block truncate text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              {t("brand.tag")}
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-1.5">
          <nav className="mr-3 hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={{ exact: l.to === "/" }}
                className="rounded-lg px-3 py-2 text-[13px] font-semibold text-muted-foreground transition-colors hover:bg-accent/70 hover:text-foreground"
                activeProps={{ className: "!text-primary bg-primary/10" }}
              >
                {t(l.key)}
              </Link>
            ))}
          </nav>

          <button
            aria-label="Search"
            className="hidden h-9 w-9 place-items-center rounded-lg border border-border bg-card/70 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary sm:grid"
          >
            <Search className="h-4 w-4" />
          </button>

          <div className="hidden items-center rounded-lg border border-border bg-card p-0.5 sm:flex">
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={cn(
                  "rounded-md px-2 py-1 text-xs font-bold transition-colors",
                  lang === l.code
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
                aria-label={`${t("lang.label")}: ${l.label}`}
              >
                {l.label}
              </button>
            ))}
          </div>

          <button
            onClick={toggle}
            aria-label={t("theme.toggle")}
            className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:text-primary"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <ButtonLink />

          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-card text-muted-foreground lg:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="animate-in slide-in-from-top-2 border-t border-border/60 bg-background px-4 pb-4 lg:hidden">
          <nav className="flex flex-col py-2">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: l.to === "/" }}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent"
                activeProps={{ className: "!text-primary bg-primary/10" }}
              >
                {t(l.key)}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2 pt-2 sm:hidden">
            <Globe className="h-4 w-4 shrink-0 text-muted-foreground" />
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={cn(
                  "rounded-md border border-border px-3 py-1 text-xs font-bold",
                  lang === l.code ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                )}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

function ButtonLink() {
  return (
    <Link
      to="/builder"
      className="group hidden items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-extrabold text-primary-foreground shadow-[0_0_25px_-10px_var(--glow)] transition-all hover:-translate-y-0.5 hover:brightness-110 sm:flex"
    >
      Start building
      <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </Link>
  );
}
