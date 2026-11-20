import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Bookmark,
  Boxes,
  ChevronDown,
  Cpu,
  Globe,
  House,
  LayoutGrid,
  Moon,
  Phone,
  Search,
  ShoppingCart,
  Sun,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { ALL_PARTS, CATEGORIES } from "@/data/parts";
import { money } from "@/lib/build";
import { useCart } from "@/lib/cart";
import { CATEGORY_ICONS } from "@/lib/categories";
import { useI18n, LANGS } from "@/lib/i18n";
import { CONTACTS } from "@/lib/site-config";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", key: "nav.home" },
  { to: "/builder", key: "nav.builder" },
  { to: "/components", key: "nav.components" },
  { to: "/view3d", key: "nav.view3d" },
  { to: "/about", key: "nav.about" },
] as const;

function CountBadge({ n }: { n: number }) {
  if (n <= 0) return null;
  return (
    <span className="absolute -right-1.5 -top-1.5 grid min-w-[1.1rem] place-items-center rounded-full bg-primary px-1 text-[10px] font-black leading-[1.1rem] text-primary-foreground">
      {n > 99 ? "99+" : n}
    </span>
  );
}

export function Navbar() {
  const { t, lang, setLang } = useI18n();
  const { theme, toggle } = useTheme();
  const { count } = useCart();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [q, setQ] = useState("");
  const [focus, setFocus] = useState(false);
  const searchRef = useRef<HTMLFormElement>(null);
  const catalogRef = useRef<HTMLDivElement>(null);

  // close menus on navigation
  useEffect(() => {
    setCatalogOpen(false);
    setFocus(false);
  }, [pathname]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!searchRef.current?.contains(e.target as Node)) setFocus(false);
      if (!catalogRef.current?.contains(e.target as Node)) setCatalogOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCatalogOpen(false);
        setFocus(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const suggestions = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (s.length < 2) return [];
    return ALL_PARTS.filter((p) => `${p.brand} ${p.name}`.toLowerCase().includes(s)).slice(0, 6);
  }, [q]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setFocus(false);
    void navigate({ to: "/components", search: { q: q.trim() || undefined, cat: undefined } });
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-xl">
        {/* top strip */}
        <div className="hidden border-b border-border/70 bg-secondary/60 text-xs lg:block">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-1.5">
            <div className="flex items-center gap-5 text-muted-foreground">
              {CONTACTS.phone ? (
                <a
                  href={`tel:${CONTACTS.phone.replace(/[^\d+]/g, "")}`}
                  className="flex items-center gap-1.5 font-semibold text-foreground hover:text-brand"
                >
                  <Phone className="h-3.5 w-3.5" />
                  {CONTACTS.phone}
                </a>
              ) : null}
              <Link to="/saved" className="hover:text-brand">
                {t("nav.saved")}
              </Link>
              <Link to="/orders" className="hover:text-brand">
                {t("orders.title")}
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-md border border-border bg-card p-0.5">
                {LANGS.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLang(l.code)}
                    className={cn(
                      "rounded px-2 py-0.5 text-[11px] font-bold transition-colors",
                      lang === l.code
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                    aria-label={`${t("lang.label")}: ${l.label}`}
                    aria-pressed={lang === l.code}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
              <button
                onClick={toggle}
                aria-label={t("theme.toggle")}
                className="grid h-7 w-7 place-items-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:text-brand"
              >
                {theme === "dark" ? (
                  <Sun className="h-3.5 w-3.5" />
                ) : (
                  <Moon className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* main row */}
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3 sm:px-6 lg:flex-nowrap lg:gap-4">
          <Link to="/" className="group flex shrink-0 items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
              <Cpu className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-base font-black leading-none tracking-[0.06em]">
                PC BUILDER
              </span>
              <span className="mt-1 block text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                {t("brand.tag")}
              </span>
            </span>
          </Link>

          <div ref={catalogRef} className="relative hidden shrink-0 lg:block">
            <button
              onClick={() => setCatalogOpen((o) => !o)}
              aria-expanded={catalogOpen}
              className="flex h-11 items-center gap-2 rounded-xl border border-border bg-secondary px-4 text-sm font-bold text-foreground transition-all hover:border-brand/50 active:scale-[0.98]"
            >
              {catalogOpen ? <X className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
              {t("nav.catalog")}
              <ChevronDown
                className={cn("h-4 w-4 transition-transform", catalogOpen && "rotate-180")}
              />
            </button>
            {catalogOpen && (
              <div className="absolute left-0 top-[calc(100%+0.5rem)] z-50 w-[34rem] rounded-2xl border border-border bg-card p-3 shadow-2xl">
                <div className="grid grid-cols-2 gap-1">
                  {CATEGORIES.map((c) => {
                    const Icon = CATEGORY_ICONS[c];
                    return (
                      <Link
                        key={c}
                        to="/components"
                        search={{ cat: c, q: undefined }}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-accent"
                      >
                        <span className="grid h-9 w-9 place-items-center rounded-lg bg-secondary text-brand">
                          <Icon className="h-4.5 w-4.5" />
                        </span>
                        {t(`cat.${c}`)}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <form ref={searchRef} onSubmit={submit} role="search" className="relative min-w-0 flex-1">
            <div className="flex h-11 overflow-hidden rounded-xl border border-input bg-card focus-within:border-brand/60 focus-within:ring-2 focus-within:ring-brand/20">
              <input
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setFocus(true);
                }}
                onFocus={() => setFocus(true)}
                placeholder={t("nav.searchPlaceholder")}
                aria-label={t("nav.search")}
                className="min-w-0 flex-1 bg-transparent px-4 text-sm outline-none placeholder:text-muted-foreground"
              />
              <button
                type="submit"
                aria-label={t("nav.search")}
                className="grid w-12 place-items-center text-muted-foreground transition-colors hover:text-brand"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
            {focus && suggestions.length > 0 && (
              <ul className="absolute inset-x-0 top-[calc(100%+0.4rem)] z-50 overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
                {suggestions.map((p) => (
                  <li key={p.id}>
                    <Link
                      to="/components/$id"
                      params={{ id: p.id }}
                      className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-accent"
                    >
                      <img
                        src={p.image}
                        alt=""
                        className="h-9 w-9 rounded-md bg-media object-cover"
                      />
                      <span className="min-w-0 flex-1 truncate">
                        <span className="text-muted-foreground">{p.brand}</span> {p.name}
                      </span>
                      <span className="shrink-0 font-bold">{money(p.price)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </form>

          <div className="ml-auto flex shrink-0 items-center gap-1.5 lg:ml-0">
            <Link
              to="/saved"
              aria-label={t("nav.saved")}
              className="hidden h-11 w-11 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-accent hover:text-brand sm:grid"
            >
              <Bookmark className="h-5 w-5" />
            </Link>
            <Link
              to="/cart"
              aria-label={`${t("nav.cart")}: ${count}`}
              className="relative grid h-11 w-11 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-accent hover:text-brand"
            >
              <ShoppingCart className="h-5 w-5" />
              <CountBadge n={count} />
            </Link>
            <button
              onClick={toggle}
              aria-label={t("theme.toggle")}
              className="grid h-11 w-11 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-accent hover:text-brand lg:hidden"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <div className="flex items-center gap-0.5 lg:hidden">
              <Globe className="h-4 w-4 text-muted-foreground" />
              {LANGS.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  aria-pressed={lang === l.code}
                  className={cn(
                    "rounded px-1.5 py-1 text-[11px] font-bold",
                    lang === l.code
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* nav row */}
        <nav className="mx-auto hidden max-w-7xl items-center gap-1 px-6 pb-2 lg:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className="rounded-lg px-3 py-1.5 text-[13px] font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              activeProps={{ className: "!text-foreground bg-primary/25" }}
            >
              {t(l.key)}
            </Link>
          ))}
        </nav>
      </header>
      <MobileTabBar />
    </>
  );
}

function MobileTabBar() {
  const { t } = useI18n();
  const { count } = useCart();
  const tabs = [
    { to: "/", icon: House, label: t("nav.home") },
    { to: "/components", icon: LayoutGrid, label: t("nav.catalog") },
    { to: "/builder", icon: Boxes, label: t("nav.builder") },
    { to: "/cart", icon: ShoppingCart, label: t("nav.cart"), badge: count },
    { to: "/saved", icon: Bookmark, label: t("nav.saved") },
  ] as const;
  return (
    <nav
      aria-label="Mobile"
      className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-5 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
    >
      {tabs.map(({ to, icon: Icon, label, ...rest }) => (
        <Link
          key={to}
          to={to}
          activeOptions={{ exact: to === "/" }}
          className="relative flex flex-col items-center gap-0.5 py-2 text-[10px] font-semibold text-muted-foreground"
          activeProps={{ className: "!text-foreground" }}
        >
          {({ isActive }: { isActive: boolean }) => (
            <>
              <span
                className={cn(
                  "relative grid h-7 w-12 place-items-center rounded-full transition-colors",
                  isActive && "bg-primary text-primary-foreground",
                )}
              >
                <Icon className="h-5 w-5" />
                {"badge" in rest && <CountBadge n={rest.badge} />}
              </span>
              <span className="max-w-full truncate px-1">{label}</span>
            </>
          )}
        </Link>
      ))}
    </nav>
  );
}
