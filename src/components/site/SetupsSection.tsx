import { CheckCircle2 } from "lucide-react";

import { SetupScene } from "@/components/site/SetupScene";
import { Button } from "@/components/ui/button";
import { SETUPS, type Setup } from "@/data/setups";
import { money, useBuild } from "@/lib/build";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

function SetupCard({ setup }: { setup: Setup }) {
  const { t } = useI18n();
  const { setupId, applySetup } = useBuild();
  const active = setupId === setup.id;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border bg-card",
        active ? "border-primary" : "border-border/80",
      )}
    >
      <div className="h-52 w-full sm:h-64">
        <SetupScene url={setup.model} />
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="eyebrow">{setup.brand}</p>
            <h3 className="mt-1 text-xl font-black">{setup.name}</h3>
          </div>
          <span className="text-xl font-black text-primary">{money(setup.price)}</span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{setup.tagline}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {Object.entries(setup.specs).map(([k, v]) => (
            <span
              key={k}
              className="rounded-lg bg-secondary px-2.5 py-1 text-xs font-semibold text-muted-foreground"
            >
              {k}: {v}
            </span>
          ))}
        </div>
        <p className="mt-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {t("setup.parts")}: {Object.keys(setup.parts).length}
        </p>
        <Button
          className="mt-4 w-full"
          variant={active ? "secondary" : "default"}
          onClick={() => applySetup(setup)}
        >
          {active && <CheckCircle2 className="text-primary" />}
          {active ? t("setup.active") : t("setup.apply")}
        </Button>
      </div>
    </div>
  );
}

export function SetupsSection({ className }: { className?: string }) {
  const { t } = useI18n();
  return (
    <section className={cn("rounded-xl border border-border/80 bg-card/60 p-5", className)}>
      <div className="mb-1 flex items-center justify-between gap-3">
        <h2 className="text-2xl font-black">{t("setup.title")}</h2>
        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
          {t("setup.autoSelect")}
        </span>
      </div>
      <p className="mb-4 text-sm text-muted-foreground">{t("setup.sub")}</p>
      <div className="grid gap-4 lg:grid-cols-2">
        {SETUPS.map((setup) => (
          <SetupCard key={setup.id} setup={setup} />
        ))}
      </div>
    </section>
  );
}
