// Store settings. Empty contact values are hidden on the site.
export const CONTACTS = {
  phone: "", // e.g. "+998 90 123 45 67"
  telegram: "", // e.g. "https://t.me/yourshop"
  email: "", // e.g. "info@yourshop.uz"
  address: "", // e.g. "Tashkent, Chilonzor 5"
  hours: "", // e.g. "Mon–Sat 10:00–19:00"
};

// Prices in the catalogue are stored in USD and shown in so'm by default (rounded to 1 000).
// Set CURRENCY to "USD" to show dollars. Keep USD_TO_UZS in sync with the rate you use.
export const CURRENCY: "USD" | "UZS" = "UZS";
export const USD_TO_UZS = 12500;

// Zero-markup instalment shown on product cards (price / months). Set to 0 to hide it.
export const INSTALLMENT_MONTHS = 12;

export type PaymentMethod = "cash" | "card";
export const PAYMENT_METHODS: PaymentMethod[] = ["cash", "card"];
export type DeliveryMethod = "pickup" | "courier";
export const DELIVERY_METHODS: DeliveryMethod[] = ["pickup", "courier"];
