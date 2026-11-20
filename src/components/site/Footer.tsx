import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Cpu } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { CONTACTS } from "@/lib/site-config";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="mt-24 border-t border-primary/30 bg-card/35">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2 text-sm font-black tracking-[0.08em]">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Cpu className="h-4 w-4" />
            </span>
            PC BUILDER
          </div>
          <p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">
            A precise workspace for choosing hardware, checking compatibility and planning your next
            build.
          </p>
        </div>
        <div>
          <p className="eyebrow">Workspace</p>
          <nav className="mt-4 grid gap-2 text-sm text-muted-foreground">
            <Link to="/builder" className="transition-colors hover:text-primary">
              {t("nav.builder")}
            </Link>
            <Link to="/components" className="transition-colors hover:text-primary">
              {t("nav.components")}
            </Link>
            <Link to="/view3d" className="transition-colors hover:text-primary">
              {t("nav.view3d")}
            </Link>
          </nav>
        </div>
        <div>
          <p className="eyebrow">Explore</p>
          <nav className="mt-4 grid gap-2 text-sm text-muted-foreground">
            <Link to="/saved" className="transition-colors hover:text-primary">
              {t("nav.saved")}
            </Link>
            <Link to="/about" className="transition-colors hover:text-primary">
              {t("nav.about")}
            </Link>
            <Link
              to="/builder"
              className="inline-flex items-center gap-1 text-primary transition-colors hover:text-foreground"
            >
              Start a build <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </nav>
        </div>
        <div>
          <p className="eyebrow">{t("footer.contact")}</p>
          <ul className="mt-4 grid gap-2 text-sm text-muted-foreground">
            <li>
              <Link to="/cart" className="transition-colors hover:text-primary">
                {t("nav.cart")}
              </Link>
            </li>
            <li>
              <Link to="/orders" className="transition-colors hover:text-primary">
                {t("orders.title")}
              </Link>
            </li>
            {CONTACTS.phone && (
              <li>
                <a
                  href={`tel:${CONTACTS.phone.replace(/[^\d+]/g, "")}`}
                  className="hover:text-primary"
                >
                  {CONTACTS.phone}
                </a>
              </li>
            )}
            {CONTACTS.telegram && (
              <li>
                <a
                  href={CONTACTS.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary"
                >
                  Telegram
                </a>
              </li>
            )}
            {CONTACTS.email && (
              <li>
                <a href={`mailto:${CONTACTS.email}`} className="hover:text-primary">
                  {CONTACTS.email}
                </a>
              </li>
            )}
            {CONTACTS.address && <li>{CONTACTS.address}</li>}
            {CONTACTS.hours && <li>{CONTACTS.hours}</li>}
          </ul>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl flex-col gap-2 border-t border-border/60 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          © {new Date().getFullYear()} · {t("footer.rights")}
        </p>
        <p>{t("footer.estimate")}</p>
      </div>
    </footer>
  );
}
