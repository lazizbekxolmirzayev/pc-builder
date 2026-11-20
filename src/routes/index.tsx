import { Link, createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Cpu,
  Gauge,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

import heroImg from "@/assets/hero.jpg";
import { PartCard } from "@/components/site/PartCard";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ALL_PARTS, FEATURED_BUILDS, getPart } from "@/data/parts";
import { buildScore, money, totalPrice, useBuild } from "@/lib/build";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Build Your Dream PC | PC Builder" },
      {
        name: "description",
        content:
          "Build a custom PC, compare components, check compatibility, and estimate gaming performance.",
      },
      { property: "og:title", content: "Build Your Dream PC | PC Builder" },
      {
        property: "og:description",
        content:
          "Choose PC parts, calculate total price, and verify basic compatibility in a polished builder.",
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
  const popular = [...ALL_PARTS].sort((a, b) => b.perf - a.perf).slice(0, 4);

  return (
    <div className="app-grid overflow-hidden">
      <section className="relative isolate min-h-[calc(100vh-4.25rem)] border-b border-border/60">
        <img
          src={heroImg}
          alt="High-end custom gaming PC setup"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--color-background)_5%,oklch(0.105_0.025_255/.82)_52%,oklch(0.105_0.025_255/.56))]" />
        <div className="hero-glow pointer-events-none absolute -right-32 top-12 h-96 w-96 rounded-full" />
        <div className="relative mx-auto grid min-h-[calc(100vh-4.25rem)] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-3xl animate-in fade-in slide-in-from-left-4 duration-700">
            <div className="eyebrow mb-6 inline-flex items-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-3 py-2">
              <Sparkles className="h-3.5 w-3.5" />
              PC Builder Studio
            </div>
            <h1 className="text-balance max-w-4xl text-5xl font-black leading-[0.93] tracking-[-0.04em] text-foreground sm:text-6xl lg:text-8xl">
              {t("hero.title1")}
              <span className="block text-primary">{t("hero.title2")}</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              {t("hero.sub")}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="group h-12 px-5 shadow-[0_0_30px_-12px_var(--glow)]"
              >
                <Link to="/builder">
                  {t("hero.cta")}
                  <ArrowRight className="transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 border-border/80 bg-background/40 px-5 backdrop-blur"
              >
                <Link to="/components">
                  {t("hero.cta2")} <ArrowUpRight />
                </Link>
              </Button>
            </div>
            <div className="mt-12 grid max-w-2xl grid-cols-3 divide-x divide-border/70 border-y border-border/60 py-4">
              {[
                [ALL_PARTS.length, t("hero.stat1")],
                [5, t("hero.stat2")],
                [11, t("hero.stat3")],
              ].map(([value, label]) => (
                <div key={label} className="px-3 first:pl-0">
                  <div className="text-2xl font-black text-foreground">
                    {value}
                    <span className="text-primary">+</span>
                  </div>
                  <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="ambient-float animate-in fade-in slide-in-from-right-4 duration-700">
            <div className="surface relative overflow-hidden rounded-2xl p-5 backdrop-blur-xl sm:p-6">
              <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="eyebrow">{t("hero.live")}</p>
                  <h2 className="mt-1 text-2xl font-black">Apex / 4K Edition</h2>
                </div>
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary text-primary-foreground shadow-[0_0_30px_-9px_var(--glow)]">
                  <Cpu className="h-6 w-6" />
                </span>
              </div>
              <div className="relative mt-5 overflow-hidden rounded-xl border border-primary/20 bg-[#08111d]">
                <img
                  src={heroImg}
                  alt="Showcase gaming PC"
                  className="h-48 w-full object-cover opacity-80 mix-blend-screen"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08111d] via-transparent to-primary/10" />
                <span className="absolute bottom-3 left-3 flex items-center gap-2 rounded-md border border-primary/30 bg-[#07101b]/80 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-primary backdrop-blur">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />{" "}
                  {t("hero.online")}
                </span>
              </div>
              <div className="mt-6 space-y-4">
                {[
                  ["GPU", 96],
                  ["CPU", 92],
                  ["Thermals", 88],
                ].map(([label, value]) => (
                  <div key={label}>
                    <div className="mb-2 flex justify-between text-[11px] font-bold uppercase tracking-[0.12em]">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="text-primary">{value}/100</span>
                    </div>
                    <Progress value={Number(value)} />
                  </div>
                ))}
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                {[
                  ["1080p", "240+"],
                  ["1440p", "180+"],
                  ["4K", "95+"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-lg border border-border/60 bg-secondary/70 p-3"
                  >
                    <div className="text-xl font-black text-primary">{value}</div>
                    <div className="text-xs text-muted-foreground">{label} FPS</div>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center gap-2 border-t border-border/60 pt-4 text-xs text-muted-foreground">
                <Activity className="h-4 w-4 text-primary" /> {t("home.estimate")}
                <span className="ml-auto flex items-center gap-1 text-primary">
                  <Zap className="h-3.5 w-3.5" /> {t("home.stable")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">{t("home.proven")}</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              {t("home.featured")}
            </h2>
            <p className="mt-2 text-muted-foreground">{t("home.featuredSub")}</p>
          </div>
          <Link
            to="/builder"
            className="hidden items-center gap-1 text-sm font-bold text-primary sm:flex"
          >
            {t("home.openBuilder")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {FEATURED_BUILDS.map((build) => (
            <article
              key={build.key}
              className="group overflow-hidden rounded-xl border border-border/80 bg-card/80 transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_24px_55px_-30px_var(--glow)]"
            >
              <div className="relative h-40 overflow-hidden bg-[#08101d]">
                <img
                  src={getPart(build.parts.gpu)?.image}
                  alt=""
                  className="h-full w-full object-cover opacity-70 transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08101d] to-transparent" />
                <span className="absolute bottom-3 left-4 rounded-md border border-primary/30 bg-background/70 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-primary backdrop-blur">
                  {buildScore(build.parts)}/100
                </span>
              </div>
              <div className="p-5">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <h3 className="text-xl font-black">{t(`build.${build.key}`)}</h3>
                  <span className="text-lg font-black text-primary">
                    {money(totalPrice(build.parts))}
                  </span>
                </div>
                <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <Gauge className="h-4 w-4 text-primary" />
                  {buildScore(build.parts)}/100
                </div>
                <ul className="mb-5 space-y-2 text-sm text-muted-foreground">
                  {Object.values(build.parts)
                    .slice(0, 4)
                    .map((id) => {
                      const part = getPart(id);
                      return part ? <li key={id}>{part.name}</li> : null;
                    })}
                </ul>
                <Button
                  asChild
                  className="w-full"
                  onClick={() => loadSelection({ ...build.parts })}
                >
                  <Link to="/builder">{t("home.load")}</Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-3">
          <div>
            <p className="eyebrow">{t("home.library")}</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight">{t("home.popular")}</h2>
            <p className="mt-2 text-muted-foreground">{t("home.popularSub")}</p>
          </div>
          <div className="hidden items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground sm:flex">
            <ShieldCheck className="h-5 w-5 text-primary" /> {t("home.sample")}
          </div>
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
