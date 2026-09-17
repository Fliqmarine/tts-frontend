import { z } from "zod";

// ── Schema ────────────────────────────────────────────────────────────────────

export const CargoSchema = z.object({
    id: z.number(),
    cargo_name: z.string().min(1, "Cargo name is required"),
    description: z.string().min(1, "Description is required"),
    hsv_code: z.string().min(1, "HSV code is required"),
    active: z.boolean(),
});

export const CreateCargoSchema = CargoSchema.omit({ id: true });

// ── Derived Types ─────────────────────────────────────────────────────────────

export type Cargo = z.infer<typeof CargoSchema>;
export type CreateCargo = z.infer<typeof CreateCargoSchema>;

// ── Safe Parse Helpers ────────────────────────────────────────────────────────

export const parseCargo = (raw: unknown): Cargo => CargoSchema.parse(raw);
export const parseCargoList = (raw: unknown): Cargo[] => z.array(CargoSchema).parse(raw);
