import { z } from "zod";

// ── Calculation Rules ─────────────────────────────────────────────────────────

export const CALCULATION_RULES = [
    "None",
    "Per Kg",
    "Per Container",
    "Per CBM",
    "Flat Rate",
    "Per Day",
    "Per Trip",
] as const;

// ── Schema ────────────────────────────────────────────────────────────────────

export const TariffMasterSchema = z.object({
    id: z.number(),
    name: z.string().min(1, "Tariff name is required"),
    calculation_rule: z.enum(CALCULATION_RULES),
});

export const CreateTariffSchema = TariffMasterSchema.omit({ id: true });

// ── Derived Types ─────────────────────────────────────────────────────────────

export type TariffMaster = z.infer<typeof TariffMasterSchema>;
export type CreateTariff = z.infer<typeof CreateTariffSchema>;
export type CalculationRule = (typeof CALCULATION_RULES)[number];

// ── Safe Parse Helpers ────────────────────────────────────────────────────────

export const parseTariff = (raw: unknown): TariffMaster => TariffMasterSchema.parse(raw);
export const parseTariffs = (raw: unknown): TariffMaster[] => z.array(TariffMasterSchema).parse(raw);