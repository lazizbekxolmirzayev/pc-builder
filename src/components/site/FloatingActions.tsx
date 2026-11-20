import { ArrowUp, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { CONTACTS } from "@/lib/site-config";

/** Scroll-to-top button and, when a Telegram link is configured, a chat shortcut. */
export function FloatingActions() {
  const { t } = useI18n();
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const btn =
    "grid h-11 w-11 place-items-center rounded-full border border-border bg-card text-foreground shadow-lg transition-all hover:bg-primary hover:text-primary-foreground";
  return (
    <div className="fixed bottom-20 right-4 z-40 flex flex-col gap-2 lg:bottom-6">
      {CONTACTS.telegram && (
        <a
          href={CONTACTS.telegram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Telegram"
          className={btn}
        >
          <Send className="h-5 w-5" />
        </a>
      )}
      {show && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label={t("footer.top")}
          className={btn}
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
