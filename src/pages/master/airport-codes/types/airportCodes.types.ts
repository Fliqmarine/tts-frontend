import { z } from "zod";

// ── Schema ────────────────────────────────────────────────────────────────────

export const AirportCodesSchema = z.object({
    id: z.number(),
    city_name: z.string().min(1, "City name is required"),
    airport_code: z.string().min(1, "Airport code is required").max(4),
    airport_name: z.string().min(1, "Airport name is required"),
    country: z.string().min(1, "Country is required"),
});

export const CreateAirportCodeSchema = AirportCodesSchema.omit({ id: true });

// ── Derived Types ─────────────────────────────────────────────────────────────

export type AirportCodes = z.infer<typeof AirportCodesSchema>;
export type CreateAirportCode = z.infer<typeof CreateAirportCodeSchema>;

// ── Safe Parse Helpers ────────────────────────────────────────────────────────

export const parseAirportCode = (raw: unknown): AirportCodes => AirportCodesSchema.parse(raw);
export const parseAirportCodes = (raw: unknown): AirportCodes[] => z.array(AirportCodesSchema).parse(raw);