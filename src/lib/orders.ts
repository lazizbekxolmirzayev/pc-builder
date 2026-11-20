import { z } from "zod";
import type { CartItems } from "@/lib/cart";
import { cartLines } from "@/lib/cart";
import type { DeliveryMethod, PaymentMethod } from "@/lib/site-config";

// Orders are stored in the browser for now. createOrder() and listOrders() are the only
// functions the UI calls: replace their bodies with API requests to connect a real backend.
const ORDERS_KEY = "pcb.orders";

export type OrderLine = { id: string; name: string; price: number; qty: number };
export type Order = {
  id: string;
  createdAt: string;
  status: "new";
  customer: { name: string; phone: string; address: string; comment: string };
  delivery: DeliveryMethod;
  payment: PaymentMethod;
  lines: OrderLine[];
  total: number;
};

export const orderSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z
    .string()
    .trim()
    .refine((v) => {
      const digits = v.replace(/\D/g, "");
      return digits.length >= 9 && digits.length <= 12 && /^[+\d][\d\s()+-]*$/.test(v);
    }),
  address: z.string().trim().max(200),
  comment: z.string().trim().max(500),
  delivery: z.enum(["pickup", "courier"]),
  payment: z.enum(["cash", "card"]),
});
export type OrderInput = z.infer<typeof orderSchema>;

/** Courier delivery needs an address; pickup does not. Returns the invalid field names. */
export function validateOrder(input: OrderInput): string[] {
  const parsed = orderSchema.safeParse(input);
  const bad = new Set<string>();
  if (!parsed.success) for (const issue of parsed.error.issues) bad.add(String(issue.path[0]));
  if (input.delivery === "courier" && input.address.trim().length < 5) bad.add("address");
  return [...bad];
}

export function listOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch {
    return [];
  }
}

function orderId() {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  return `PCB-${ymd}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export async function createOrder(input: OrderInput, items: CartItems): Promise<Order> {
  const lines = cartLines(items).map((l) => ({
    id: l.part.id,
    name: `${l.part.brand} ${l.part.name}`,
    price: l.part.price,
    qty: l.qty,
  }));
  if (!lines.length) throw new Error("empty cart");
  const bad = validateOrder(input);
  if (bad.length) throw new Error(`invalid: ${bad.join(",")}`);
  const order: Order = {
    id: orderId(),
    createdAt: new Date().toISOString(),
    status: "new",
    customer: {
      name: input.name.trim(),
      phone: input.phone.trim(),
      address: input.address.trim(),
      comment: input.comment.trim(),
    },
    delivery: input.delivery,
    payment: input.payment,
    lines,
    total: lines.reduce((s, l) => s + l.price * l.qty, 0),
  };
  localStorage.setItem(ORDERS_KEY, JSON.stringify([order, ...listOrders()]));
  return order;
}
