import { z } from "zod";
import type { Manifest } from "../../manifest/types/manifest.types";

export const PreAlertDetailsSchema = z.object({
  id: z.string(),
  manifestId: z.union([z.string(), z.number()]),
  manifestNumber: z.string(),
  origin: z.string(),
  destination: z.string(),
  consigneeAddress: z.string(),
  masterAwbNumber: z.string(),
  houseAwbNumber: z.string(),
  airlineName: z.string(),
  etd: z.string(),
  eta: z.string(),
  distance: z.string(),
  documentNames: z.array(z.string()),
  remarks: z.string(),
  createdAt: z.string(),
  client: z.string().optional(),
  vessel: z.string().optional(),
  hub: z.string().optional(),
  mode: z.string().optional(),
  packageCount: z.number().optional(),
  totalWeight: z.number().optional(),
  vesselPo: z.string().optional(),
  keyAccountManager: z.string().optional(),
  vendorInvoices: z.array(z.object({
    invoiceNo: z.string().optional(),
  }).passthrough()).optional(),
  consignee: z.string().optional(),
  status: z.string().optional(),
  stage: z.number().optional(),
  awbDocumentNames: z.array(z.string()).optional(),
  stocks: z.array(z.object({
    id: z.union([z.string(), z.number()]),
    stock_id: z.string(),
    charges: z.array(z.object({
      id: z.string(),
      description: z.string(),
      agent: z.string(),
      invoiceNo: z.string(),
      currency: z.string(),
      charges: z.string(),
    })).optional(),
  })).optional(),
});
export type PreAlertDetails = z.infer<typeof PreAlertDetailsSchema>;

export const TransitInformationSchema = z.object({
  id: z.string(),
  preAlertId: z.string(),
  origin: z.string(),
  destination: z.string(),
  flightDetails: z.string(),
  departureDate: z.string(),
  departureTime: z.string(),
  arrivalDate: z.string(),
  etaTime: z.string(),
  actualArrivalDate: z.string(),
  revisedSchedule: z.string(),
  shipmentDelayRemark: z.string(),
});
export type TransitInformation = z.infer<typeof TransitInformationSchema>;

export type PreAlertLocationState = { manifest?: Manifest };

// Filters for the all-stage list.
export const PreAlertAllStageSelectFilterKeySchema = z.enum([
  "client",
  "vessel",
  "hub",
  "status",
  "vesselPo",
  "keyAccountManager",
  "consignee",
  "destinationPort",
  "stage",
]);
export type PreAlertAllStageSelectFilterKey = z.infer<typeof PreAlertAllStageSelectFilterKeySchema>;

export const PreAlertAllStageFiltersSchema = z.object({
  search: z.string(),
  client: z.string(),
  vessel: z.string(),
  hub: z.string(),
  status: z.string(),
  vesselPo: z.string(),
  keyAccountManager: z.string(),
  consignee: z.string(),
  destinationPort: z.string(),
  stage: z.string(),
  manifestNo: z.string(),
  awbNumber: z.string(),
  fromDate: z.string(),
  toDate: z.string(),
});
export type PreAlertAllStageFilters = z.infer<typeof PreAlertAllStageFiltersSchema>;

export type PreAlertAllStageFilterProps = {
  filters: PreAlertAllStageFilters;
  onChange: (filters: PreAlertAllStageFilters) => void;
  /** Dropdowns that are always visible. Other dropdowns appear under "Show more". */
  primaryFields?: PreAlertAllStageSelectFilterKey[];
  options?: Partial<Record<PreAlertAllStageSelectFilterKey, string[]>>;
};

// Stage 1 filter types for the dedicated Stage 1 page.
export const PreAlertStage1SelectFilterKeySchema = z.enum([
  "client", "vessel", "hub", "status", "vesselPo", "keyAccountManager", "consignee", "destinationPort", "stage",
]);
export type PreAlertStage1SelectFilterKey = z.infer<typeof PreAlertStage1SelectFilterKeySchema>;

export const PreAlertStage1FiltersSchema = z.object({
  search: z.string(), client: z.string(), vessel: z.string(), hub: z.string(), status: z.string(),
  vesselPo: z.string(), keyAccountManager: z.string(), consignee: z.string(), destinationPort: z.string(),
  stage: z.string(), manifestNo: z.string(), awbNumber: z.string(), fromDate: z.string(), toDate: z.string(),
});
export type PreAlertStage1Filters = z.infer<typeof PreAlertStage1FiltersSchema>;

export type PreAlertStage1FilterProps = {
  filters: PreAlertStage1Filters;
  onChange: (filters: PreAlertStage1Filters) => void;
  /** Dropdowns that are always visible. Other dropdowns appear under "Show more". */
  primaryFields?: PreAlertStage1SelectFilterKey[];
  options?: Partial<Record<PreAlertStage1SelectFilterKey, string[]>>;
};

// Stage 2 filter types for the dedicated Stage 2 page.
export const PreAlertStage2SelectFilterKeySchema = z.enum([
  "client", "vessel", "hub", "status", "vesselPo", "keyAccountManager", "consignee", "destinationPort", "stage",
]);
export type PreAlertStage2SelectFilterKey = z.infer<typeof PreAlertStage2SelectFilterKeySchema>;

export const PreAlertStage2FiltersSchema = z.object({
  search: z.string(), client: z.string(), vessel: z.string(), hub: z.string(), status: z.string(),
  vesselPo: z.string(), keyAccountManager: z.string(), consignee: z.string(), destinationPort: z.string(),
  stage: z.string(), manifestNo: z.string(), awbNumber: z.string(), fromDate: z.string(), toDate: z.string(),
});
export type PreAlertStage2Filters = z.infer<typeof PreAlertStage2FiltersSchema>;

export type PreAlertStage2FilterProps = {
  filters: PreAlertStage2Filters;
  onChange: (filters: PreAlertStage2Filters) => void;
  /** Dropdowns that are always visible. Other dropdowns appear under "Show more". */
  primaryFields?: PreAlertStage2SelectFilterKey[];
  options?: Partial<Record<PreAlertStage2SelectFilterKey, string[]>>;
};

// Stage 3 filter types for the dedicated Stage 3 page.
export const PreAlertStage3SelectFilterKeySchema = z.enum([
  "client", "vessel", "hub", "status", "vesselPo", "keyAccountManager", "consignee", "destinationPort", "stage",
]);
export type PreAlertStage3SelectFilterKey = z.infer<typeof PreAlertStage3SelectFilterKeySchema>;

export const PreAlertStage3FiltersSchema = z.object({
  search: z.string(), client: z.string(), vessel: z.string(), hub: z.string(), status: z.string(),
  vesselPo: z.string(), keyAccountManager: z.string(), consignee: z.string(), destinationPort: z.string(),
  stage: z.string(), manifestNo: z.string(), awbNumber: z.string(), fromDate: z.string(), toDate: z.string(),
});
export type PreAlertStage3Filters = z.infer<typeof PreAlertStage3FiltersSchema>;

export type PreAlertStage3FilterProps = {
  filters: PreAlertStage3Filters;
  onChange: (filters: PreAlertStage3Filters) => void;
  /** Dropdowns that are always visible. Other dropdowns appear under "Show more". */
  primaryFields?: PreAlertStage3SelectFilterKey[];
  options?: Partial<Record<PreAlertStage3SelectFilterKey, string[]>>;
};

// Stage 4 filter types for the dedicated Stage 4 page.
export const PreAlertStage4SelectFilterKeySchema = z.enum([
  "client", "vessel", "hub", "status", "vesselPo", "keyAccountManager", "consignee", "destinationPort", "stage",
]);
export type PreAlertStage4SelectFilterKey = z.infer<typeof PreAlertStage4SelectFilterKeySchema>;

export const PreAlertStage4FiltersSchema = z.object({
  search: z.string(), client: z.string(), vessel: z.string(), hub: z.string(), status: z.string(),
  vesselPo: z.string(), keyAccountManager: z.string(), consignee: z.string(), destinationPort: z.string(),
  stage: z.string(), manifestNo: z.string(), awbNumber: z.string(), fromDate: z.string(), toDate: z.string(),
});
export type PreAlertStage4Filters = z.infer<typeof PreAlertStage4FiltersSchema>;

export type PreAlertStage4FilterProps = {
  filters: PreAlertStage4Filters;
  onChange: (filters: PreAlertStage4Filters) => void;
  /** Dropdowns that are always visible. Other dropdowns appear under "Show more". */
  primaryFields?: PreAlertStage4SelectFilterKey[];
  options?: Partial<Record<PreAlertStage4SelectFilterKey, string[]>>;
};
