import { z } from "zod";

// ── Const Options ─────────────────────────────────────────────────────────────

export const PAYMENT_TERM_OPTIONS = ["COD", "10 Days", "15 Days", "30 Days", "60 Days"] as const;
export const CURRENCY_OPTIONS = ["AED", "USD", "EUR", "GBP", "INR", "SAR", "QAR", "BHD", "KWD", "OMR"] as const;

// ── Schemas ───────────────────────────────────────────────────────────────────

export const VendorSchema = z.object({
    id: z.number(),
    vendorName: z.string().min(1, "Vendor name is required"),
    currency: z.enum(CURRENCY_OPTIONS),
    paymentTerm: z.enum(PAYMENT_TERM_OPTIONS),
    isActive: z.boolean(),
});

export const VendorFormSchema = VendorSchema.omit({ id: true });

// ── Derived Types ─────────────────────────────────────────────────────────────

export type PaymentTerm = (typeof PAYMENT_TERM_OPTIONS)[number];
export type VendorCurrency = (typeof CURRENCY_OPTIONS)[number];
export type Vendor = z.infer<typeof VendorSchema>;
export type VendorFormState = z.infer<typeof VendorFormSchema>;

// ── Initial State ─────────────────────────────────────────────────────────────

export const INITIAL_VENDOR_STATE: VendorFormState = {
    vendorName: "",
    currency: "AED",
    paymentTerm: "COD",
    isActive: true,
};

// ── Safe Parse Helpers ────────────────────────────────────────────────────────

export const parseVendor = (raw: unknown): Vendor => VendorSchema.parse(raw);
export const parseVendors = (raw: unknown): Vendor[] => z.array(VendorSchema).parse(raw);
