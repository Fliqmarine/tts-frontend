import { z } from "zod";

// ── Schema ────────────────────────────────────────────────────────────────────

export const HubLocationsSchema = z.object({
    id: z.number(),
    contactCode: z.string().min(1, "Contact code is required"),
    name: z.string().min(1, "Hub name is required"),
    stationCode: z.string().min(1, "Station code is required"),
    email: z.string().email("Invalid email address"),
    telephoneNo: z.string().min(1, "Telephone number is required"),
    country: z.string().min(1, "Country is required"),
    isActive: z.boolean(),
});

export const CreateHubLocationsSchema = HubLocationsSchema.omit({ id: true });

// ── Derived Types ─────────────────────────────────────────────────────────────

export type HubLocations = z.infer<typeof HubLocationsSchema>;
export type CreateHubLocations = z.infer<typeof CreateHubLocationsSchema>;

export interface HubFilters {
    search?: string;
    stationCode?: string;
}

// ── Safe Parse Helpers ────────────────────────────────────────────────────────

export const parseHub = (raw: unknown): HubLocations => HubLocationsSchema.parse(raw);
export const parseHubs = (raw: unknown): HubLocations[] => z.array(HubLocationsSchema).parse(raw);
