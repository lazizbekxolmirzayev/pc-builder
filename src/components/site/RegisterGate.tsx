import { useRouterState } from "@tanstack/react-router";
import { Cpu, UserRound } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/lib/i18n";
import { useUser } from "@/lib/user";

// Letters (any alphabet), spaces, apostrophes and hyphens: Oliy, O'tkir, Анна-Мария
const NAME_RE = /^[\p{L}][\p{L}\s'’ʻʼ`-]*$/u;

function validName(v: string) {
  const s = v.trim();
  return s.length >= 2 && s.length <= 40 && NAME_RE.test(s);
}

/** Blocks the site with a registration dialog until the visitor enters first and last name. */
export function RegisterGate() {
  const { t } = useI18n();
  const { user, ready, register } = useUser();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // /admin sahifasi ro'yxatdan o'tishni talab qilmaydi (admin kalit bilan kiriladi)
  if (!ready || user || pathname.startsWith("/admin")) return null;

  const firstBad = touched && !validName(firstName);
  const lastBad = touched && !validName(lastName);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (loading || !validName(firstName) || !validName(lastName)) return;
    setLoading(true);
    try {
      await register(firstName, lastName);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open>
      <DialogContent
        className="max-w-md [&>button:last-child]:hidden"
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="items-center text-center sm:text-center">
          <span className="mb-1 grid h-12 w-12 place-items-center rounded-xl bg-primary text-primary-foreground shadow-[0_0_24px_-6px_var(--glow)]">
            <Cpu className="h-6 w-6" />
          </span>
          <DialogTitle className="text-2xl font-black tracking-tight">{t("reg.title")}</DialogTitle>
          <DialogDescription>{t("reg.sub")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="grid gap-4" noValidate>
          <div className="grid gap-1.5">
            <Label htmlFor="reg-first">{t("reg.firstName")}</Label>
            <Input
              id="reg-first"
              autoFocus
              autoComplete="given-name"
              maxLength={40}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder={t("reg.firstPh")}
              aria-invalid={firstBad}
              className={firstBad ? "border-destructive" : undefined}
            />
            {firstBad && <p className="text-xs text-destructive">{t("reg.error")}</p>}
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="reg-last">{t("reg.lastName")}</Label>
            <Input
              id="reg-last"
              autoComplete="family-name"
              maxLength={40}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder={t("reg.lastPh")}
              aria-invalid={lastBad}
              className={lastBad ? "border-destructive" : undefined}
            />
            {lastBad && <p className="text-xs text-destructive">{t("reg.error")}</p>}
          </div>

          <Button type="submit" disabled={loading} className="mt-1 w-full">
            <UserRound />
            {loading ? t("reg.loading") : t("reg.submit")}
          </Button>
          <p className="text-center text-xs text-muted-foreground">{t("reg.note")}</p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
