import { z } from "zod";
import type { ReactNode } from "react";

export const ManifestStockRowSchema = z.object({
    id: z.union([z.string(), z.number()]),
    vessel: z.string(),
    stock_id: z.string(),
    station: z.string(),
    arrival_date: z.string(),
    supplier: z.string(),
    po_no: z.string(),
    pkgs: z.number().nonnegative(),
    weight: z.number().nonnegative(),
    cbm: z.number().nonnegative(),
    value: z.number().nonnegative(),
    stock_status: z.string(),
    docs: z.array(z.object({ name: z.string(), url: z.string() })).optional(),
    charges: z.array(z.object({
        id: z.string(),
        description: z.string(),
        agent: z.string(),
        invoiceNo: z.string(),
        currency: z.string(),
        charges: z.string(),
    })).optional(),
});
export type ManifestStockRow = z.infer<typeof ManifestStockRowSchema>;

export const ManifestFormSchema = z.object({
    client: z.string(),
    vessel: z.string(),
    stationCode: z.string(),
    mode: z.string(),
    activation: z.string(),
    deadline: z.string(),
    originAirportCode: z.string(),
    customerPoRef: z.string(),
    stockOrigin: z.boolean(),
    consignee: z.string(),
    country: z.string(),
    destinationAirportCode: z.string(),
    email: z.string(),
    telephone: z.string(),
    consigneeAddress: z.string(),
    notifyParty: z.string(),
    manifestNumber:z.string(),
});
export type ManifestFormValues = z.infer<typeof ManifestFormSchema>;

export const ManifestSchema = ManifestFormSchema.extend({
    id: z.union([z.string(), z.number()]),
    stocks: z.array(ManifestStockRowSchema),
    manifestNumber: z.string().optional(),
    updated_at: z.string().optional(),
    status: z.string().optional(),
    keyAccountManager: z.string().optional(),
    InternalStatus: z.string().optional(),
});
export type Manifest = z.infer<typeof ManifestSchema>;

export type ManifestStockColumn = {
    key: keyof ManifestStockRow;
    label: string;
    width?: number;
    align?: "left" | "center" | "right";
};

export type ManifestCreatePageProps = {
    initialValues?: Partial<ManifestFormValues>;
    title?: string;
    onSubmit?: (values: ManifestFormValues & { stocks: ManifestStockRow[] }) => void;
};

export type ManifestIndexFilters = {
    search: string;
    manifestNo: string;
    client: string;
    vessel: string;
    keyAccountManager: string;
    fromDate: string;
    toDate: string;
    arrival: string;
    vesselPo: string;
    hub: string;
    status: string;
    consignee: string;
    portOfDestination: string;
    mode: string;
    transitNo: string;
    invoice: string;
    InternalStatus: string;
};

export type ManifestSectionHeaderProps = { title: string; icon?: ReactNode; required?: boolean };

