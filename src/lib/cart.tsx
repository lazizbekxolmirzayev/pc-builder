import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getPart, type Part } from "@/data/parts";

// The cart is kept in the browser. To move it to a server, replace the localStorage
// reads/writes below with API calls; the rest of the UI only uses the useCart() hook.
const CART_KEY = "pcb.cart";
export const MAX_QTY = 20;

export type CartItems = Record<string, number>;
export type CartLine = { part: Part; qty: number };

export function cartLines(items: CartItems): CartLine[] {
  return Object.entries(items)
    .map(([id, qty]) => ({ part: getPart(id), qty }))
    .filter((l): l is CartLine => Boolean(l.part) && l.qty > 0);
}
export const cartTotal = (items: CartItems) =>
  cartLines(items).reduce((s, l) => s + l.part.price * l.qty, 0);
export const cartCount = (items: CartItems) => cartLines(items).reduce((s, l) => s + l.qty, 0);

function clampQty(n: number) {
  return Math.max(0, Math.min(MAX_QTY, Math.floor(n)));
}

type CartCtx = {
  items: CartItems;
  lines: CartLine[];
  count: number;
  total: number;
  add: (id: string, qty?: number) => void;
  addMany: (ids: string[]) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItems>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItems;
        const clean: CartItems = {};
        for (const [id, q] of Object.entries(parsed))
          if (getPart(id) && clampQty(Number(q)) > 0) clean[id] = clampQty(Number(q));
        setItems(clean);
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, ready]);

  const add = useCallback((id: string, qty = 1) => {
    if (!getPart(id)) return;
    setItems((s) => ({ ...s, [id]: clampQty((s[id] ?? 0) + qty) }));
  }, []);

  const addMany = useCallback((ids: string[]) => {
    setItems((s) => {
      const next = { ...s };
      for (const id of ids) if (getPart(id)) next[id] = clampQty((next[id] ?? 0) + 1);
      return next;
    });
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setItems((s) => {
      const next = { ...s };
      const q = clampQty(qty);
      if (q <= 0) delete next[id];
      else next[id] = q;
      return next;
    });
  }, []);

  const remove = useCallback((id: string) => {
    setItems((s) => {
      const next = { ...s };
      delete next[id];
      return next;
    });
  }, []);

  const clear = useCallback(() => setItems({}), []);

  const value = useMemo<CartCtx>(
    () => ({
      items,
      lines: cartLines(items),
      count: cartCount(items),
      total: cartTotal(items),
      add,
      addMany,
      setQty,
      remove,
      clear,
    }),
    [items, add, addMany, setQty, remove, clear],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
