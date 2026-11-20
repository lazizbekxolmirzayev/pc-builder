import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Boxes, Cuboid, Gauge, Percent, ShieldCheck, ShoppingCart } from "lucide-react";

import heroImg from "@/assets/hero.jpg";
import { PartCard } from "@/components/site/PartCard";
import { Button } from "@/components/ui/button";
import { ALL_PARTS, CATEGORIES, FEATURED_BUILDS, getPart } from "@/data/parts";
import { buildScore, money, totalPrice, useBuild } from "@/lib/build";
import { useCart } from "@/lib/cart";
import { CATEGORY_ICONS } from "@/lib/categories";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Build Your Dream PC | PC Builder" },
      {
        name: "description",
        content: "Build a custom PC, compare components, check compatibility, and order online.",
      },
      { property: "og:title", content: "Build Your Dream PC | PC Builder" },
      {
        property: "og:description",
        content:
          "Choose PC parts, calculate the total price and verify compatibility in a polished builder.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { t } = useI18n();
  const { loadSelection, setPart } = useBuild();
  const { addMany } = useCart();
  const popular = [...ALL_PARTS].sort((a, b) => b.perf - a.perf).slice(0, 8);
  const benefits = [
    { icon: ShieldCheck, k: "home.benefit1" },
    { icon: Percent, k: "home.benefit2" },
    { icon: Cuboid, k: "home.benefit3" },
    { icon: ShoppingCart, k: "home.benefit4" },
  ] as const;

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-6 sm:px-6 lg:py-8">
      {/* hero banner */}
      <section className="relative isolate overflow-hidden rounded-3xl bg-primary text-primary-foreground">
        <img
          src={heroImg}
          alt=""
          className="absolute inset-y-0 right-0 hidden h-full w-1/2 object-cover md:block"
          style={{ maskImage: "linear-gradient(90deg, transparent, #000 45%)" }}
        />
        <div className="relative max-w-xl px-6 py-12 sm:px-10 sm:py-16 lg:py-20">
          <h1 className="text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            {t("home.heroTitle")}
          </h1>
          <p className="mt-4 max-w-md text-base font-medium opacity-80 sm:text-lg">
            {t("home.heroSub")}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/builder"
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-[oklch(0.25_0.1_265)] px-6 text-sm font-extrabold text-white transition-transform hover:-translate-y-0.5"
            >
              <Boxes className="h-4 w-4" />
              {t("home.ctaBuild")}
            </Link>
            <Link
              to="/components"
              search={{ q: undefined, cat: undefined }}
              className="inline-flex h-12 items-center gap-2 rounded-xl border-2 border-[oklch(0.25_0.1_265)]/80 px-6 text-sm font-extrabold transition-colors hover:bg-[oklch(0.25_0.1_265)] hover:text-white"
            >
              {t("home.ctaCatalog")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* benefits */}
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {benefits.map(({ icon: Icon, k }) => (
          <div
            key={k}
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
              <Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold leading-tight">{t(k)}</p>
              <p className="mt-0.5 hidden text-xs leading-snug text-muted-foreground sm:block">
                {t(`${k}d`)}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* categories */}
      <section>
        <h2 className="mb-4 text-2xl font-black tracking-tight sm:text-3xl">
          {t("home.categories")}
        </h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {CATEGORIES.map((c) => {
            const Icon = CATEGORY_ICONS[c];
            return (
              <Link
                key={c}
                to="/components"
                search={{ cat: c, q: undefined }}
                className="group flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-4 text-center transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-lg"
              >
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-secondary text-brand transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-7 w-7" />
                </span>
                <span className="text-xs font-bold leading-tight sm:text-sm">{t(`cat.${c}`)}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ready builds */}
      <section>
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl">{t("home.featured")}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t("home.featuredSub")}</p>
          </div>
          <Link
            to="/builder"
            className="hidden items-center gap-1 text-sm font-bold hover:text-brand sm:flex"
          >
            {t("home.openBuilder")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {FEATURED_BUILDS.map((build) => (
            <article
              key={build.key}
              className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-xl"
            >
              <div className="relative h-40 overflow-hidden bg-media">
                <img
                  src={getPart(build.parts.gpu)?.image}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute left-3 top-3 flex items-center gap-1 rounded-md bg-primary px-2 py-1 text-[11px] font-extrabold text-primary-foreground">
                  <Gauge className="h-3 w-3" />
                  {buildScore(build.parts)}/100
                </span>
              </div>
              <div className="p-5">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <h3 className="text-xl font-black">{t(`build.${build.key}`)}</h3>
                  <span className="text-lg font-black">{money(totalPrice(build.parts))}</span>
                </div>
                <ul className="mb-5 space-y-1.5 text-sm text-muted-foreground">
                  {Object.values(build.parts)
                    .slice(0, 4)
                    .map((id) => {
                      const part = getPart(id);
                      return part ? (
                        <li key={id} className="truncate">
                          {part.name}
                        </li>
                      ) : null;
                    })}
                </ul>
                <div className="flex gap-2">
                  <Button
                    asChild
                    className="flex-1"
                    onClick={() => loadSelection({ ...build.parts })}
                  >
                    <Link to="/builder">{t("home.load")}</Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label={t("cart.addBuild")}
                    title={t("cart.addBuild")}
                    onClick={() => addMany(Object.values(build.parts))}
                  >
                    <ShoppingCart />
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* popular */}
      <section>
        <div className="mb-4">
          <h2 className="text-2xl font-black tracking-tight sm:text-3xl">{t("home.popular")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t("home.popularSub")}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {popular.map((part) => (
            <PartCard key={part.id} part={part} onAdd={() => setPart(part.category, part.id)} />
          ))}
        </div>
      </section>
    </div>
  );
}
