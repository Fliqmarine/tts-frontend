import { z } from "zod";

// ── Sub-schemas ───────────────────────────────────────────────────────────────

export const PersonInfoSchema = z.object({
    name: z.string(),
    email: z.string(),
    telephone: z.string(),
});

// ── Main Schema ───────────────────────────────────────────────────────────────

export const VesselFormSchema = z.object({
    // Vessel basic info
    clientId: z.string(),
    vesselName: z.string().min(1, "Vessel name is required"),
    imoNo: z.string(),
    shipId: z.string(),
    vesselFlag: z.string(),
    buildYear: z.string(),
    budget: z.string(),
    currency: z.string(),
    email: z.string(),
    telephone: z.string(),
    vesselType: z.string(),
    keyAccountManager: z.string(),

    // Person in charge (PIC)
    clientPic: PersonInfoSchema,

    // Vessel manager (Superintendent)
    supt: PersonInfoSchema,

    // Invoice info
    billingAddress: z.string(),
    billingAddressSameAsAddress: z.boolean(),
});

// ── Derived Types ─────────────────────────────────────────────────────────────

export type PersonInfo = z.infer<typeof PersonInfoSchema>;
export type VesselFormState = z.infer<typeof VesselFormSchema>;

// ── Initial State ─────────────────────────────────────────────────────────────

export const INITIAL_PERSON_INFO: PersonInfo = {
    name: "",
    email: "",
    telephone: "",
};

export const INITIAL_VESSEL_STATE: VesselFormState = {
    clientId: "",
    vesselName: "",
    imoNo: "",
    shipId: "",
    vesselFlag: "",
    buildYear: "",
    budget: "",
    currency: "",
    email: "",
    telephone: "",
    vesselType: "",
    keyAccountManager: "",
    clientPic: { ...INITIAL_PERSON_INFO },
    supt: { ...INITIAL_PERSON_INFO },
    billingAddress: "",
    billingAddressSameAsAddress: false,
};
