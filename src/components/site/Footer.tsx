import { Link } from "@tanstack/react-router";
import { Cpu } from "lucide-react";
import { CATEGORIES } from "@/data/parts";
import { useI18n } from "@/lib/i18n";
import { CONTACTS, PAYMENT_METHODS } from "@/lib/site-config";

export function Footer() {
  const { t } = useI18n();
  const linkCls = "transition-colors hover:text-brand";
  return (
    <footer className="mt-16 border-t border-border bg-card pb-16 lg:pb-0">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5 text-base font-black tracking-[0.06em]">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Cpu className="h-5 w-5" />
            </span>
            PC BUILDER
          </div>
          <p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">
            {t("footer.about")}
          </p>
        </div>

        <div>
          <p className="eyebrow">{t("footer.catalog")}</p>
          <nav className="mt-4 grid gap-2 text-sm text-muted-foreground">
            {CATEGORIES.slice(0, 7).map((c) => (
              <Link key={c} to="/components" search={{ cat: c, q: undefined }} className={linkCls}>
                {t(`cat.${c}`)}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <p className="eyebrow">{t("footer.contact")}</p>
          <nav className="mt-4 grid gap-2 text-sm text-muted-foreground">
            <Link to="/builder" className={linkCls}>
              {t("nav.builder")}
            </Link>
            <Link to="/view3d" className={linkCls}>
              {t("nav.view3d")}
            </Link>
            <Link to="/cart" className={linkCls}>
              {t("nav.cart")}
            </Link>
            <Link to="/orders" className={linkCls}>
              {t("orders.title")}
            </Link>
            <Link to="/saved" className={linkCls}>
              {t("nav.saved")}
            </Link>
            <Link to="/about" className={linkCls}>
              {t("nav.about")}
            </Link>
          </nav>
        </div>

        <div>
          <p className="eyebrow">{t("footer.help")}</p>
          <ul className="mt-4 grid gap-2 text-sm text-muted-foreground">
            {CONTACTS.phone && (
              <li>
                <a
                  href={`tel:${CONTACTS.phone.replace(/[^\d+]/g, "")}`}
                  className="font-bold text-foreground hover:text-brand"
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
                  className={linkCls}
                >
                  Telegram
                </a>
              </li>
            )}
            {CONTACTS.email && (
              <li>
                <a href={`mailto:${CONTACTS.email}`} className={linkCls}>
                  {CONTACTS.email}
                </a>
              </li>
            )}
            {CONTACTS.address && <li>{CONTACTS.address}</li>}
            {CONTACTS.hours && <li>{CONTACTS.hours}</li>}
          </ul>
          <p className="eyebrow mt-6">{t("footer.payment")}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {PAYMENT_METHODS.map((m) => (
              <span
                key={m}
                className="rounded-md border border-border bg-secondary px-2.5 py-1 text-xs font-semibold text-muted-foreground"
              >
                {t(`checkout.pay.${m}`)}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            © {new Date().getFullYear()} · {t("footer.rights")}
          </p>
          <p>{t("footer.estimate")}</p>
        </div>
      </div>
    </footer>
  );
}
