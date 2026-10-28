import { z } from "zod";
import type { ReactNode } from "react";

export const FileItemSchema = z.object({ name: z.string(), url: z.string() });
export type FileItem = z.infer<typeof FileItemSchema>;

export const StockCargoRowSchema = z.object({
    id: z.string(), length: z.string(), width: z.string(), height: z.string(), pieces: z.string(), weight: z.string(),
    dg: z.boolean(), repackingRequired: z.boolean(), medicine: z.boolean(), packageType: z.string(),
    cbm: z.string(), cwtAir: z.string(), cwtCourier: z.string(), whl: z.string(),
});
export type StockCargoRow = z.infer<typeof StockCargoRowSchema>;

export const StockChargeRowSchema = z.object({
    id: z.string(), description: z.string(), agent: z.string(), invoiceNo: z.string(), currency: z.string(), charges: z.string(),
});
export type StockChargeRow = z.infer<typeof StockChargeRowSchema>;

export const StockSchema = z.object({
    id: z.number(),
    station: z.string(),
    vessel: z.string(),
    client: z.string(),
    po_no: z.string(),
    supplier: z.string(),
    arrival_date: z.string(),
    entry_date: z.string().optional(),
    country_of_origin: z.string().optional(),
    cargo_status: z.enum(["On stock", "New", "Hold", "Landed Goods", "Transit", "Pending", "Storage", "Received"]),
    cargo_description: z.string().optional(),
    hs_code: z.string().optional(),
    currency: z.string().optional(),
    cargo_value: z.number().optional(),
    mode_of_arrival: z.string().optional(),
    transit_no: z.string(),
    eu_reference: z.string().optional(),
    storage_type: z.string().optional(),
    pickup: z.boolean(),
    fumigation: z.boolean().optional(),

    cargo_details: z.array(StockCargoRowSchema).optional(),
    charges: z.array(StockChargeRowSchema).optional(),
});
export type Stock = z.infer<typeof StockSchema>;

export const StockIndexFiltersSchema = z.object({
    search: z.string(), client: z.string(), vessel: z.string(), station: z.string(),
    supplier: z.string(), po_no: z.string(), transit_no: z.string(), status: z.string(),
    fromDate: z.string(), toDate: z.string(), stock30PlusDays: z.boolean(), dg: z.boolean(),
    pickup: z.boolean(), withoutChineseDocs: z.boolean(),
});
export type StockIndexFilters = z.infer<typeof StockIndexFiltersSchema>;

export const StockFollowupFiltersSchema = z.object({
    search: z.string(), client: z.string(), vessel: z.string(), station: z.string(),
    supplier: z.string(), po_no: z.string(), transit_no: z.string(), status: z.string(),
    key_account_manager: z.string(),
});
export type StockFollowupFilters = z.infer<typeof StockFollowupFiltersSchema>;

export const StockHistoryFiltersSchema = z.object({
    search: z.string(), client: z.string(), vessel: z.string(), station: z.string(),
    supplier: z.string(), po_no: z.string(), transit_no: z.string(), status: z.string(),
    fromDate: z.string(), toDate: z.string()
});
export type StockHistoryFilters = z.infer<typeof StockHistoryFiltersSchema>;

export interface StockIndexFilterProps {
    filters: StockIndexFilters;
    onChange: (filters: StockIndexFilters) => void;
}
export interface StockFollowupFilterProps {
    filters: StockFollowupFilters;
    onChange: (filters: StockFollowupFilters) => void;
}
export interface StockHistoryFilterProps {
    filters: StockHistoryFilters;
    onChange: (filters: StockHistoryFilters) => void;
}
export interface StockFollowupTableProps { filters?: StockFollowupFilters }
export interface StockIndexTableProps { filters: StockIndexFilters }
export interface StockHistoryTableProps { filters: StockHistoryFilters }

export type StockEditLocationState = { stock?: Stock };
export type StockViewLocationState = { stock?: Stock };
export type StockStatusColor = "success" | "warning" | "info";
export type StockColumn = {
    key: string;
    label: string;
    width: number;
    align?: "left" | "right" | "center";
    bold?: boolean;
    text?: (row: Stock) => string;
    node?: (row: Stock) => ReactNode;
};
export type StockIndexColumn = {
    key: keyof Stock;
    label: string;
    width: number;
    align?: "left" | "center" | "right";
};
export type StockFileCellProps = { files: FileItem[]; type: "doc" | "image" };
export type StockSectionHeaderProps = { title: string; icon?: ReactNode; required?: boolean };
export type StockReadOnlyFilesProps = { title: string; files: FileItem[] };
export type StockEditableFilesProps = { title: string; files: FileItem[]; onRemove: (index: number) => void };
export type StockCargoColumn = { key: keyof Omit<StockCargoRow, "id">; label: string; required?: boolean; type: "text" | "checkbox" | "select"; icon?: ReactNode };
export type StockChargeColumn = { key: keyof Omit<StockChargeRow, "id">; label: string; type: "text" };
export type StockReadOnlyFieldProps = { label: string; value?: string | number };
export type StockTextFieldDefinition = { label: string; key: keyof Stock };
export type StockFileProgress = { done: number; total: number };
export type StockCreatePageProps = {
    onChange?: (change: { cargo?: StockCargoRow[]; charges?: StockChargeRow[] }) => void;
};
