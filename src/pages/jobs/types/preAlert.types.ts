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
