import { z } from "zod";

// ── Schema ────────────────────────────────────────────────────────────────────

export const CurrencySchema = z.object({
    id: z.number(),
    code: z.string().min(1, "Currency code is required").max(5),
    country: z.string().min(1, "Country is required"),
    currency: z.string().min(1, "Currency name is required"),
    symbol: z.string().min(1, "Symbol is required"),
    active: z.boolean(),
    conversion_rate: z.number().nonnegative("Conversion rate must be positive"),
});

export const CreateCurrencySchema = CurrencySchema.omit({ id: true });

// ── Derived Types ─────────────────────────────────────────────────────────────

export type Currency = z.infer<typeof CurrencySchema>;
export type CreateCurrency = z.infer<typeof CreateCurrencySchema>;

// ── Safe Parse Helpers ────────────────────────────────────────────────────────

export const parseCurrency = (raw: unknown): Currency => CurrencySchema.parse(raw);
export const parseCurrencies = (raw: unknown): Currency[] => z.array(CurrencySchema).parse(raw);
