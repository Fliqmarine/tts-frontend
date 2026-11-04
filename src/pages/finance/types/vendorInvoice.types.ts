import { z } from "zod";
import { VendorInvoiceSchema, VendorPreAlertRowSchema } from "../../jobs/types/vendor.types";

export const VendorInvoiceFiltersSchema = z.object({
  vendor: z.string(),
  vessel: z.string(),
  modeOfArrival: z.string(),
  fromDate: z.string(),
  toDate: z.string(),
  status: z.string(),
  bank: z.string(),
});
export type VendorInvoiceFilters = z.infer<typeof VendorInvoiceFiltersSchema>;

export const VendorInvoiceSelectFilterKeySchema = z.enum([
  "vendor",
  "vessel",
  "modeOfArrival",
  "status",
  "bank",
]);
export type VendorInvoiceSelectFilterKey = z.infer<typeof VendorInvoiceSelectFilterKeySchema>;

const StoredVendorInvoiceSchema = VendorInvoiceSchema
  .omit({ invoiceFiles: true })
  .extend({
    invoiceFileNames: z.array(z.string()).optional(),
    bank: z.string().optional(),
    finalAmountUsd: z.string().optional(),
  })
  .passthrough();

export const VendorInvoiceRowSchema = z.object({
  id: z.string(),
  vendorName: z.string(),
  manifestNo: z.string(),
  invoiceNo: z.string(),
  invoiceDate: z.string(),
  overdueDate: z.string(),
  purchaseAmount: z.string(),
  currency: z.string(),
  finalAmountAed: z.string(),
  status: z.string(),
  bank: z.string(),
  vessel: z.string(),
  modeOfArrival: z.string(),
});
export type VendorInvoiceRow = z.infer<typeof VendorInvoiceRowSchema>;

const STAGE4_STORAGE_KEY = "tts-demo-pre-alert-stage-4";

export const getVendorInvoiceRows = (): VendorInvoiceRow[] => {
  const stored = localStorage.getItem(STAGE4_STORAGE_KEY);
  if (!stored) return [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(stored);
  } catch (error) {
    console.error("Could not read Stage 4 vendor invoices from storage.", error);
    return [];
  }

  if (!Array.isArray(parsed)) {
    console.error("Stage 4 vendor invoice storage has an invalid format.");
    return [];
  }

  const rows: VendorInvoiceRow[] = [];
  parsed.forEach((value: unknown) => {
    const preAlertResult = VendorPreAlertRowSchema.safeParse(value);
    if (!preAlertResult.success) {
      console.error("A Stage 4 pre-alert has invalid vendor invoice data.", preAlertResult.error);
      return;
    }

    const preAlert = preAlertResult.data;
    if ((preAlert.stage ?? 4) !== 4 || !Array.isArray(preAlert.vendorInvoices)) return;

    preAlert.vendorInvoices.forEach((value) => {
      const invoiceResult = StoredVendorInvoiceSchema.safeParse(value);
      if (!invoiceResult.success) {
        console.error("A vendor invoice record is invalid.", invoiceResult.error);
        return;
      }

      const invoice = invoiceResult.data;
      const rowResult = VendorInvoiceRowSchema.safeParse({
        id: invoice.id,
        vendorName: invoice.vendorName,
        manifestNo: invoice.manifestNo,
        invoiceNo: invoice.invoiceNo,
        invoiceDate: invoice.invoiceDate,
        overdueDate: invoice.overdueDate,
        purchaseAmount: invoice.purchaseAmount,
        currency: invoice.currency,
        finalAmountAed: invoice.finalAmountAed,
        status: invoice.status ?? "Pending",
        bank: invoice.bank ?? "",
        vessel: preAlert.vessel ?? "",
        modeOfArrival: preAlert.mode ?? "",
      });
      if (!rowResult.success) {
        console.error("A vendor invoice record has invalid display data.", rowResult.error);
        return;
      }
      rows.push(rowResult.data);
    });
  });
  return rows;
};