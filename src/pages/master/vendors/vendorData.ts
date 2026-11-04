import type { Vendor } from "./types/vendor.types";

export const DEMO_VENDORS: Vendor[] = [
  { id: 1, vendorName: "Al Futtaim Logistics", currency: "AED", paymentTerm: "30 Days", isActive: true },
  { id: 2, vendorName: "Gulf Agency Company", currency: "USD", paymentTerm: "COD", isActive: true },
  { id: 3, vendorName: "Agility Global", currency: "USD", paymentTerm: "60 Days", isActive: false },
  { id: 4, vendorName: "DP World Services", currency: "AED", paymentTerm: "15 Days", isActive: true },
  { id: 5, vendorName: "Aramex Freight", currency: "EUR", paymentTerm: "30 Days", isActive: true },
  { id: 6, vendorName: "Kuehne + Nagel ME", currency: "USD", paymentTerm: "10 Days", isActive: true },
  { id: 7, vendorName: "DB Schenker UAE", currency: "AED", paymentTerm: "COD", isActive: false },
  { id: 8, vendorName: "Tristar Transport", currency: "AED", paymentTerm: "30 Days", isActive: true },
];
