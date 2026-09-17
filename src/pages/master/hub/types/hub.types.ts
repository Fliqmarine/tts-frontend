import { z } from "zod";

// ── Schema ────────────────────────────────────────────────────────────────────

export const HubSchema = z.object({
    id: z.number(),
    contactCode: z.string().min(1, "Contact code is required"),
    name: z.string().min(1, "Hub name is required"),
    stationCode: z.string().min(1, "Station code is required"),
    email: z.string().email("Invalid email address"),
    telephoneNo: z.string().min(1, "Telephone number is required"),
    country: z.string().min(1, "Country is required"),
    isActive: z.boolean(),
});

export const CreateHubSchema = HubSchema.omit({ id: true });

// ── Derived Types ─────────────────────────────────────────────────────────────

export type Hub = z.infer<typeof HubSchema>;
export type CreateHub = z.infer<typeof CreateHubSchema>;

// ── Safe Parse Helpers ────────────────────────────────────────────────────────

export const parseHub = (raw: unknown): Hub => HubSchema.parse(raw);
export const parseHubs = (raw: unknown): Hub[] => z.array(HubSchema).parse(raw);
