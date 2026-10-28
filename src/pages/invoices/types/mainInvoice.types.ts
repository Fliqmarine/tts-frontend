import type { ReactNode } from "react";

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

export type InvoiceStatus = "Draft" | "Issued" | "Paid";