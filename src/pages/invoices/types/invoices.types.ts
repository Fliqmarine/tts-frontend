
import type { ReactNode } from "react";
import { z } from "zod";
import { PreAlertDetailsSchema } from "../../jobs/types/preAlert.types";

export type SectionHeaderProps = {
  title: string;
  icon?: ReactNode;
  required?: boolean;
};

/** Vendor (purchase) invoice linked to the main invoice - summary strip */
export type VendorInvoiceSummary = {
  id: string;
  vendorName: string;
  invoiceNo: string;
  invoiceDate: string;
  dueDate: string;
  purchaseAmount: number;
  currency: string;
  vat: number;
  vatAmount: number;
  totalAmount: number;
};

/** Cost line (what we pay the vendor) inside one sub invoice */
export type VendorCostRow = {
  id: string;
  vendorName: string;
  vendorInvoice: string;
  
  purchaseAmount: string;
  currency: string;
  vatPercent: string;
  vatAmount: string;
  finalAmountAed: string;
};

/** Billable line (what we charge the client) inside one sub invoice */
export type InvoiceLineRow = {
  id: string;
  description: string;
  additionalDescription: string;
  currency: string;
  unitPrice: string;
  qty: string;
  vat: string;
};

export type SubInvoiceRow = {
  id: string;
  manifestNo: string;
  vessels: string[];
  shipmentRef: string;
  clientRef: string;
  services: string;
  transportDocRef: string;
  origin: string;
  destination: string;
  eta: string;
  etd: string;
  jobCompletionDate: string;
  packages: string;
  totalWeight: string;
  vendorCosts: VendorCostRow[];
  lines: InvoiceLineRow[];
};

export type MainInvoiceForm = {
  recipient: string;
  invoiceDate: string;
  dueDate: string;
  paymentTerms: string;
  invoiceCurrency: string;
  proformaInvoice: string;
  clientPoNumber: string;
  notes: string;
};

export type InvoiceStatus = "Draft" | "Issued" | "Partially Paid" | "Paid";

export const VendorCostRowSchema = z.object({
  id: z.string(),
  vendorName: z.string(),
  vendorInvoice: z.string(),
  purchaseAmount: z.string(),
  currency: z.string(),
  vatPercent: z.string(),
  vatAmount: z.string(),
  finalAmountAed: z.string(),
});

export const InvoiceLineRowSchema = z.object({
  id: z.string(),
  description: z.string(),
  additionalDescription: z.string(),
  currency: z.string(),
  unitPrice: z.string(),
  qty: z.string(),
  vat: z.string(),
});

export const SubInvoiceRowSchema = z.object({
  id: z.string(),
  manifestNo: z.string(),
  vessels: z.array(z.string()),
  shipmentRef: z.string(),
  clientRef: z.string(),
  services: z.string(),
  transportDocRef: z.string(),
  origin: z.string(),
  destination: z.string(),
  eta: z.string(),
  etd: z.string(),
  jobCompletionDate: z.string(),
  packages: z.string(),
  totalWeight: z.string(),
  vendorCosts: z.array(VendorCostRowSchema),
  lines: z.array(InvoiceLineRowSchema),
});

export const MainInvoiceFormSchema = z.object({
  recipient: z.string(),
  invoiceDate: z.string(),
  dueDate: z.string(),
  paymentTerms: z.string(),
  invoiceCurrency: z.string(),
  proformaInvoice: z.string(),
  clientPoNumber: z.string(),
  notes: z.string(),
});

export const InvoiceStatusSchema = z.enum(["Draft", "Issued", "Partially Paid", "Paid"]);

export const SavedMainInvoiceSchema = z.object({
  invoiceId: z.string(),
  invoiceNo: z.string(),
  preAlert: PreAlertDetailsSchema.optional(),
  form: MainInvoiceFormSchema,
  status: InvoiceStatusSchema,
  arApproved: z.boolean().optional(),
  apApproved: z.boolean().optional(),
  arApprovalDecision: z.enum(["approve", "hold"]).optional(),
  arHoldReasons: z.array(z.string()).optional(),
  arOtherReason: z.string().optional(),
  subInvoices: z.array(SubInvoiceRowSchema),
  amount: z.number(),
  totalCost: z.number(),
  totalPrice: z.number(),
  totalProfit: z.number(),
  specialCommission: z.number().nonnegative().optional(),
  savedAt: z.string(),
});