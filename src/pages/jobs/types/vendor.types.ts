import { z } from "zod";
import { PreAlertDetailsSchema } from "./preAlert.types";

export const VendorInvoiceSchema = z.object({
  id: z.string(),
  vendorName: z.string(),
  manifestNo: z.string(),
  invoiceNo: z.string(),
  invoiceDate: z.string(),
  overdueDate: z.string(),
  purchaseAmount: z.string(),
  currency: z.string(),
  vatPercent: z.string(),
  vatAmount: z.string(),
  finalAmountAed: z.string(),
  status: z.enum(["Pending","Partially Paid", "Approved", "Rejected"]).optional(),
  invoiceFiles: z.array(z.custom<File>(
    (value) => typeof File !== "undefined" && value instanceof File,
  )),
});
export type VendorInvoice = z.infer<typeof VendorInvoiceSchema>;

export const VendorPreAlertRowSchema = PreAlertDetailsSchema.extend({
  mailSent: z.enum(["Yes", "No"]).optional(),
}).passthrough();
export type VendorPreAlertRow = z.infer<typeof VendorPreAlertRowSchema>;

export const VendorDocumentKeySchema = z.enum([
  "proofOfDelivery",
  "clientPo",
  "emailConfirmation",
]);
export type VendorDocumentKey = z.infer<typeof VendorDocumentKeySchema>;

export const createEmptyVendorInvoice = (manifestNo: string): VendorInvoice => ({
  id: crypto.randomUUID(),
  vendorName: "",
  manifestNo,
  invoiceNo: "",
  invoiceDate: "",
  overdueDate: "",
  purchaseAmount: "",
  currency: "AED",
  vatPercent: "",
  vatAmount: "",
  finalAmountAed: "",
  status: "Pending",
  invoiceFiles: [],
});