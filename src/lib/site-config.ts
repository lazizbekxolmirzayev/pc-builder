// Store settings. Empty contact values are hidden on the site.
export const CONTACTS = {
  phone: "", // e.g. "+998 90 123 45 67"
  telegram: "", // e.g. "https://t.me/yourshop"
  email: "", // e.g. "info@yourshop.uz"
  address: "", // e.g. "Tashkent, Chilonzor 5"
  hours: "", // e.g. "Mon–Sat 10:00–19:00"
};

// Prices in the catalogue are stored in USD. Set CURRENCY to "UZS" to show so'm instead,
// and keep USD_TO_UZS in sync with the rate you use.
export const CURRENCY: "USD" | "UZS" = "UZS";
export const USD_TO_UZS = 12500;

export type PaymentMethod = "cash" | "card";
export const PAYMENT_METHODS: PaymentMethod[] = ["cash", "card"];
export type DeliveryMethod = "pickup" | "courier";
export const DELIVERY_METHODS: DeliveryMethod[] = ["pickup", "courier"];
