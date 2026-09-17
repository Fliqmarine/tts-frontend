import { z } from "zod";

// ── Sub-schemas ───────────────────────────────────────────────────────────────

export const ContactPersonInchargeSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    phone: z.string().min(1, "Phone is required"),
    faxNo: z.string().optional(),
});

export const ContactAccountingDetailsSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    phone: z.string().optional(),
    faxNo: z.string().optional(),
    country: z.string().optional(),
    creditLimit: z.string().optional(),
    useBillingCurrency: z.boolean(),
    paymentTerms: z.string().optional(),
    currency: z.string().optional(),
    billingAddress: z.string().optional(),
    specialInstructions: z.string().optional(),
});

// ── Group IDs ─────────────────────────────────────────────────────────────────

export const GROUP_IDS = [
    "Client",
    "Vendor",
    "Agent",
    "Airline",
    "Hub",
    "ShippingLine",
    "Trucker",
    "Port",
    "Customs",
    "Other",
] as const;

export const GroupIdSchema = z.enum(GROUP_IDS);

// ── Create Schema ─────────────────────────────────────────────────────────────

export const CreateContactSchema = z.object({
    groupId: GroupIdSchema,
    description: z.string().optional(),

    // Common fields
    companyName: z.string().min(1, "Company name is required"),
    initial: z.string().optional(),
    email: z.string().email("Invalid email"),
    phone: z.string().min(1, "Phone is required"),
    faxNo: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    postalCode: z.string().optional(),
    vatNo: z.string().optional(),

    // Group-specific
    stationCode: z.string().optional(),
    eoriUiseNo: z.string().optional(),
    notifyParty: z.string().optional(),
    airportCode: z.string().optional(),

    // Sections
    personIncharge: ContactPersonInchargeSchema.optional(),
    accountingDetails: ContactAccountingDetailsSchema.optional(),
    multipleEmail: z.string().optional(),

    // Client-specific extras
    oppManager: z.string().optional(),
    bankDetails: z.string().optional(),
    clientHubs: z.string().optional(),
});

export const ContactSchema = CreateContactSchema.extend({
    id: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export const UpdateContactSchema = CreateContactSchema.partial();

// ── Derived Types ─────────────────────────────────────────────────────────────

export type ContactPersonIncharge = z.infer<typeof ContactPersonInchargeSchema>;
export type ContactAccountingDetails = z.infer<typeof ContactAccountingDetailsSchema>;
export type CreateContactRequest = z.infer<typeof CreateContactSchema>;
export type Contact = z.infer<typeof ContactSchema>;
export type UpdateContactRequest = z.infer<typeof UpdateContactSchema>;
export type GroupId = z.infer<typeof GroupIdSchema>;

// ── Safe Parse Helpers ────────────────────────────────────────────────────────

export const parseContact = (raw: unknown): Contact => ContactSchema.parse(raw);
export const parseContacts = (raw: unknown): Contact[] => z.array(ContactSchema).parse(raw);
