import { z } from "zod";
import { ClientReceiptStatusSchema } from "./clientReceipt.types";

export const ProformaInvoiceLineSchema = z.object({
  id: z.string(),
  description: z.string(),
  additionalDescription: z.string(),
  currency: z.string(),
  unitPrice: z.string(),
  quantity: z.string(),
  vat: z.string(),
});

export type ProformaInvoiceLine = z.infer<typeof ProformaInvoiceLineSchema>;

export const ProformaInvoiceSchema = z.object({
  id: z.string(),
  client: z.string(),
  clientAddress: z.string(),
  clientPoNumber: z.string(),
  vesselName: z.string(),
  manifestNumber: z.string(),
  invoiceDate: z.string(),
  paymentTerms: z.string(),
  currency: z.string(),
  notes: z.string(),
  lines: z.array(ProformaInvoiceLineSchema),
  createdAt: z.string(),
});

export type ProformaInvoice = z.infer<typeof ProformaInvoiceSchema>;

export type ProformaInvoiceForm = Omit<
  ProformaInvoice,
  "id" | "lines" | "createdAt"
>;

export const PROFORMA_INVOICE_STORAGE_KEY = "tts-proforma-invoices";
export const PROFORMA_RECEIPTS_STORAGE_KEY = "tts-proforma-receipts";

export const ProformaReceiptRecordSchema = z.object({
  invoiceId: z.string(),
  client: z.string(),
  bankId: z.string(),
  bankReference: z.string(),
  clientReference: z.string(),
  comments: z.string(),
  receivedDate: z.string(),
  amount: z.number().positive(),
  status: ClientReceiptStatusSchema,
  documents: z.array(
    z.object({
      name: z.string(),
      type: z.string(),
      dataUrl: z.string(),
    }),
  ),
});

export type ProformaReceiptRecord = z.infer<typeof ProformaReceiptRecordSchema>;
export type ProformaReceiptFormValues = Omit<ProformaReceiptRecord, "amount"> & {
  amount: string;
};
export type ProformaReceiptLocationState = { invoice?: ProformaInvoice };
export type ProformaCurrencyTotals = { subtotal: number; vat: number; gross: number };
export type ProformaReceiptStatus = ProformaReceiptRecord["status"];
export const PROFORMA_RECEIPT_STATUSES = ClientReceiptStatusSchema.options;
export type ProformaReceiptIndexFilters = {
  search: string;
  client: string;
  bankId: string;
};

export const PROFORMA_CURRENCIES = ["AED", "USD", "GBP", "EUR", "SGD"];
export const PROFORMA_PAYMENT_TERMS = ["COD", "15", "30", "60", "90"];
export const PROFORMA_VESSELS = [
  "MV Atlantic Star",
  "MV Pacific Explorer",
  "MV Indian Voyager",
  "MV Arctic Breeze",
  "MV Southern Cross",
  "MV Baltic Wave",
  "MV Mediterranean Sun",
  "MV Caribbean Dream",
  "MV North Sea Pioneer",
  "MV Red Sea Falcon",
  "MV Gulf Trader",
  "MV Coral Empress",
];

export const PROFORMA_CLIENTS = [
  {
    name: "Northstar Freight",
    address: "18 Harbour Road\nLondon, United Kingdom\nE14 9QH",
  },
  {
    name: "Cedar & Coast Trading",
    address: "Business Bay, Tower 4\nDubai, United Arab Emirates",
  },
  {
    name: "Pacific Bridge Logistics",
    address: "72 Anson Road\nSingapore 079911",
  },
];

export const createEmptyProformaLine = (): ProformaInvoiceLine => ({
  id: crypto.randomUUID(),
  description: "",
  additionalDescription: "",
  currency: "AED",
  unitPrice: "",
  quantity: "1",
  vat: "0",
});