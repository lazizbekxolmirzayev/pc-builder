import { createFileRoute } from "@tanstack/react-router";
import { Cpu, Gauge, Globe2, ShieldCheck, WifiOff, Zap } from "lucide-react";

import { MODEL_CREDITS } from "@/data/models3d";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About PC Builder Studio | PC Builder" },
      {
        name: "description",
        content:
          "Learn how PC Builder Studio helps plan custom PCs with component data, compatibility checks, and FPS estimates.",
      },
      { property: "og:title", content: "About PC Builder Studio | PC Builder" },
      {
        property: "og:description",
        content:
          "A modern front-end PC configurator for comparing parts and planning desktop builds.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { t } = useI18n();
  const features = [
    { icon: ShieldCheck, title: t("about.f1"), body: t("about.f1d") },
    { icon: Gauge, title: t("about.f2"), body: t("about.f2d") },
    { icon: Globe2, title: t("about.f3"), body: t("about.f3d") },
    { icon: WifiOff, title: t("about.f4"), body: t("about.f4d") },
  ];

  return (
    <div className="app-grid mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <section className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="eyebrow mb-5">Built for better decisions</p>
          <div className="mb-5 grid h-14 w-14 place-items-center rounded-xl bg-primary text-primary-foreground shadow-[0_0_28px_-10px_var(--glow)]">
            <Cpu className="h-7 w-7" />
          </div>
          <h1 className="text-balance text-4xl font-black tracking-tight sm:text-6xl">
            {t("about.title")}
          </h1>
          <div className="mt-6 space-y-4 text-lg leading-8 text-muted-foreground">
            <p>{t("about.p1")}</p>
            <p>{t("about.p2")}</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                className="rounded-xl border border-border/80 bg-card/80 p-5 transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_20px_50px_-32px_var(--glow)]"
              >
                <Icon className="h-7 w-7 text-primary" />
                <h2 className="mt-4 text-xl font-black">{feature.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{feature.body}</p>
              </article>
            );
          })}
        </div>
      </section>
      <section className="mt-16 grid gap-4 border-y border-border/60 py-8 sm:grid-cols-3">
        {[
          ["11", "hardware categories"],
          ["3", "languages built in"],
          ["100%", "local and private"],
        ].map(([value, label]) => (
          <div key={label} className="flex items-center gap-3">
            <Zap className="h-5 w-5 text-primary" />
            <div>
              <p className="text-2xl font-black">{value}</p>
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
            </div>
          </div>
        ))}
      </section>
      <section className="mt-12">
        <h2 className="text-xl font-black">3D model credits</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          These models are licensed under Creative Commons Attribution 4.0 and were rescaled,
          reoriented and compressed for the web.
        </p>
        <ul className="mt-4 grid gap-1.5 text-sm sm:grid-cols-2">
          {MODEL_CREDITS.map((m) => (
            <li key={m.id} className="text-muted-foreground">
              <a
                href={m.source}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-foreground hover:text-primary"
              >
                {m.label}
              </a>{" "}
              by {m.author} · {m.license}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
