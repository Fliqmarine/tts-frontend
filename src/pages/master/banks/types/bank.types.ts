import { z } from "zod";

// ── Const Options (keep as source of truth for dropdowns) ─────────────────────

export const ENTITY_OPTIONS = ["Fliq", "TTS", "MFS", "Fliq LLP"] as const;
export const CURRENCY_OPTIONS = ["AED", "USD", "EUR", "GBP", "INR", "SAR", "QAR", "BHD", "KWD", "OMR"] as const;

// ── Schemas ───────────────────────────────────────────────────────────────────

export const BankSchema = z.object({
    id: z.number(),
    entity: z.enum(ENTITY_OPTIONS),
    bank: z.string().min(1, "Bank name is required"),
    bankCode: z.string().min(1, "Bank code is required"),
    accountName: z.string().min(1, "Account name is required"),
    accountNumber: z.string().min(1, "Account number is required"),
    currency: z.enum(CURRENCY_OPTIONS),
    bankBalance: z.string(),
    isActive: z.boolean(),
});

export const BankFormSchema = BankSchema.omit({ id: true, isActive: true });

// ── Derived Types ─────────────────────────────────────────────────────────────

export type Entity = (typeof ENTITY_OPTIONS)[number];
export type BankCurrency = (typeof CURRENCY_OPTIONS)[number];
export type Bank = z.infer<typeof BankSchema>;
export type BankFormState = z.infer<typeof BankFormSchema>;

// ── Initial State ─────────────────────────────────────────────────────────────

export const INITIAL_BANK_STATE: BankFormState = {
    entity: "TTS",
    bank: "",
    bankCode: "",
    accountName: "",
    accountNumber: "",
    currency: "AED",
    bankBalance: "",
};

// ── Safe Parse Helpers ────────────────────────────────────────────────────────

export const parseBank = (raw: unknown): Bank => BankSchema.parse(raw);
export const parseBanks = (raw: unknown): Bank[] => z.array(BankSchema).parse(raw);
