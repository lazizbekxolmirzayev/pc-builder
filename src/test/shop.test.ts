import { beforeEach, describe, expect, it } from "vitest";
import { getPart } from "@/data/parts";
import { cartCount, cartLines, cartTotal } from "@/lib/cart";
import { createOrder, listOrders, validateOrder, type OrderInput } from "@/lib/orders";
import { DICTS } from "@/lib/i18n";

class MemoryStorage {
  private m = new Map<string, string>();
  getItem(k: string) {
    return this.m.get(k) ?? null;
  }
  setItem(k: string, v: string) {
    this.m.set(k, v);
  }
  removeItem(k: string) {
    this.m.delete(k);
  }
}

const valid: OrderInput = {
  name: "Ali Valiyev",
  phone: "+998 90 123 45 67",
  address: "",
  comment: "",
  delivery: "pickup",
  payment: "cash",
};

beforeEach(() => {
  (globalThis as unknown as { localStorage: MemoryStorage }).localStorage = new MemoryStorage();
});

describe("cart maths", () => {
  const items = { "cpu-1": 2, "gpu-1": 1, "unknown-id": 5, "ram-1": 0 };
  it("ignores unknown parts and zero quantities", () => {
    expect(
      cartLines(items)
        .map((l) => l.part.id)
        .sort(),
    ).toEqual(["cpu-1", "gpu-1"]);
  });
  it("totals price and count", () => {
    expect(cartCount(items)).toBe(3);
    expect(cartTotal(items)).toBe(getPart("cpu-1")!.price * 2 + getPart("gpu-1")!.price);
  });
});

describe("order validation", () => {
  it("accepts a valid pickup order without an address", () => {
    expect(validateOrder(valid)).toEqual([]);
  });
  it("rejects a short name and a bad phone", () => {
    expect(validateOrder({ ...valid, name: "A", phone: "12" }).sort()).toEqual(["name", "phone"]);
  });
  it("requires an address only for courier delivery", () => {
    expect(validateOrder({ ...valid, delivery: "courier" })).toEqual(["address"]);
    expect(
      validateOrder({ ...valid, delivery: "courier", address: "Tashkent, Chilonzor 5" }),
    ).toEqual([]);
  });
});

describe("createOrder", () => {
  it("stores the order with a snapshot of names, prices and the total", async () => {
    const order = await createOrder(valid, { "cpu-1": 2, "ram-1": 1 });
    expect(order.id).toMatch(/^PCB-\d{8}-[A-Z0-9]{4}$/);
    expect(order.total).toBe(getPart("cpu-1")!.price * 2 + getPart("ram-1")!.price);
    expect(order.lines).toHaveLength(2);
    expect(listOrders()[0]?.id).toBe(order.id);
  });
  it("refuses an empty cart and invalid data", async () => {
    await expect(createOrder(valid, {})).rejects.toThrow();
    await expect(createOrder({ ...valid, name: "" }, { "cpu-1": 1 })).rejects.toThrow();
    expect(listOrders()).toEqual([]);
  });
  it("keeps the newest order first", async () => {
    const a = await createOrder(valid, { "cpu-1": 1 });
    const b = await createOrder(valid, { "cpu-2": 1 });
    expect(listOrders().map((o) => o.id)).toEqual([b.id, a.id]);
  });
});

describe("shop translations", () => {
  it("every language has the shop keys", () => {
    for (const lang of ["en", "ru", "uz"] as const)
      for (const k of [
        "cart.title",
        "checkout.place",
        "checkout.pay.cash",
        "orders.status.new",
        "nav.cart",
      ])
        expect(DICTS[lang][k]).toBeTruthy();
  });
});
