/* ------------------------------------------------------------------ */
/*  FOB types                                                          */
/* ------------------------------------------------------------------ */

export type FobSectionKey = "export" | "import" | "other" | "po" | "onboard";

export interface FobItem {
    description: string;
    rate: number | null; // null = not quoted yet
    remarks: string;
}

export interface FobSection {
    key: FobSectionKey;
    title: string;
    items: FobItem[];
}

/** A saved FOB (one per clientType + country) */
export interface Fob {
    id: string;
    clientType: string; // stores Option.value, e.g. "direct"
    country: string;
    currency: string; // ISO code, e.g. "EUR"
    sections: FobSection[];
    createdAt: string;
    updatedAt: string;
}

/** What the create page sends to the API */
export type CreateFobPayload = Pick<
    Fob,
    "clientType" | "country" | "currency" | "sections"
>;

/** What the index page uses to look a FOB up */
export interface FobFilters {
    clientType: string;
    country: string;
}

/* ------------------------------------------------------------------ */
/*  Option lists (replace with API data later if needed)               */
/* ------------------------------------------------------------------ */

export interface Option {
    value: string;
    label: string;
}

export interface Currency {
    code: string;
    symbol: string;
    label: string;
}

// Edit these to match your real client types
export const CLIENT_TYPES: Option[] = [
    { value: "new-client", label: "New Client" },
    { value: "standard-client", label: "Standard Client" },
    { value: "client-2", label: "Client 2" },
    { value: "client-3", label: "Client 3" },
];

export const FOB_CLIENT_TYPES = CLIENT_TYPES.map((clientType) => clientType.label);

export interface FobIndexFilterProps {
    value: string;
    onChange: (value: string) => void;
}

export const COUNTRIES: string[] = [
    "Singapore",
    "United Arab Emirates",
    "China",
    "Japan",
    "Korea",
    "Germany",
    "Netherlands",
    "Denmark",
];

export const CURRENCIES: Currency[] = [
    { code: "USD", symbol: "$", label: "US Dollar" },
    { code: "SGD", symbol: "S$", label: "Singapore Dollar" },
    { code: "AED", symbol: "د.إ", label: "UAE Dirham" },
    { code: "EUR", symbol: "€", label: "Euro" },
    { code: "DKK", symbol: "kr", label: "Danish Krone" },
    { code: "NOK", symbol: "kr", label: "Norwegian Krone" },
    // { code: "INR", symbol: "₹", label: "Indian Rupee" },
    // { code: "GBP", symbol: "£", label: "British Pound" },
];

export const getClientTypeLabel = (value: string): string =>
    CLIENT_TYPES.find((c) => c.value === value)?.label ?? value;

export const getCurrency = (code: string): Currency | undefined =>
    CURRENCIES.find((c) => c.code === code);

/* ------------------------------------------------------------------ */
/*  Default rows shown on the create page (descriptions + remarks)     */
/* ------------------------------------------------------------------ */

const item = (description: string, remarks = ""): FobItem => ({
    description,
    rate: null,
    remarks,
});

export const DEFAULT_FOB_TEMPLATE: FobSection[] = [
    {
        key: "export",
        title: "Airfreight Export Handling Rates",
        items: [
            item("Airfreight Handling / AWB", "Per Hawb / Shipment"),
            item("Airport Transfer (ADD ON)", "Per Actual Kilogram"),
            item("PO Fee", "Per PO"),
            item("EX-A", "If Applicable"),
            item("WEX Doc", "If Applicable"),
            item("T1 Handling", "Per shipment"),
            item("Rush Delivery, 3 Hours Before Cut Off", "Per AWB"),
            item("Security Check Unknown Shipper", "Per Actual Kilogram Over 500 Kg (Max 40)"),
        ],
    },
    {
        key: "import",
        title: "Airfreight Import Handling Rates",
        items: [
            item("Airfreight Handling", "Basis"),
            item("Add on", "Per Actual Kilogram"),
            item("Customs Import", "Per AWB"),
            item("Terminal Handling", "Per Gross Kilogram Per Day"),
            item("T1 Handling", "Per Shipment"),
            item("(No Free Period)"),
        ],
    },
    {
        key: "other",
        title: "OTHER CHARGES (IF APPLICABLE)",
        items: [
            item("T1 Handling", "Per Shipment"),
            item("T-1 PGTS -> PDE", "Costs Applicable After 2.5 Months Storage Under T-1"),
            item("Export Truck / Courier Handling", "Per Shipment"),
            item("Dangerous Goods Handling", "Per Shipment *Battery = EUR: 35.00"),
            item("Battery handling", "Per Shipment"),
            item(
                "Issuing DGD, checking labelling, transportation & storage",
                "Excl. Repacking, packing material, etc."
            ),
            item("Trucking charges", "Basis"),
            item("Add on", "Per Actual Kilogram"),
        ],
    },
    {
        key: "po",
        title: "PO Handling",
        items: [item("PO Handling", "Per Clients PO Number")],
    },
    {
        key: "onboard",
        title: "ONBOARD",
        items: [
            item("Customs Docs", "Per Shipment"),
            item("PO Fee", "Per PO"),
            item("Onboard Handling", "Per Shipment"),
            item("EX-A", "If Applicable"),
            item("WEX Doc", "If Applicable"),
        ],
    },
];