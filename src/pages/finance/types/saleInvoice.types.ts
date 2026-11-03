import { z } from "zod";
import {
  getAllExtraInvoices,
  getAllMainInvoices,
  saveExtraInvoice,
  saveMainInvoice,
  type SavedMainInvoice,
} from "../../invoices/mainInvoiceStorage";
import { InvoiceStatusSchema, SavedMainInvoiceSchema, type InvoiceStatus } from "../../invoices/types/invoices.types";
import { PreAlertDetailsSchema, type PreAlertDetails } from "../../jobs/types/preAlert.types";

const STAGE4_STORAGE_KEY = "tts-demo-pre-alert-stage-4";

export const SaleInvoiceFiltersSchema = z.object({
  search: z.string(),
  client: z.string(),
  vessel: z.string(),
  hub: z.string(),
  vendorInvoiceNo: z.string(),
  status: z.string(),
  approvalStatus: z.string(),
  mode: z.string(),
  keyAccountManager: z.string(),
  invoiceNumber: z.string(),
  jobNumber: z.string(),
  fromDate: z.string(),
  toDate: z.string(),
});
export type SaleInvoiceFilters = z.infer<typeof SaleInvoiceFiltersSchema>;

export const SaleInvoiceRowSchema = z.object({
  preAlert: PreAlertDetailsSchema,
  invoice: SavedMainInvoiceSchema,
  type: z.enum(["main", "extra"]),
  source: z.enum(["demo", "saved"]),
});
export type SaleInvoiceRow = z.infer<typeof SaleInvoiceRowSchema>;

export const getInvoiceApprovalStatus = (
  invoice: Pick<SavedMainInvoice, "arApproved" | "apApproved">,
): "Pending" | "AR Approval Pending" | "AP Approval Pending" | "Approved" => {
  if (invoice.arApproved && invoice.apApproved) return "Approved";
  if (invoice.arApproved) return "AP Approval Pending";
  if (invoice.apApproved) return "AR Approval Pending";
  return "Pending";
};

export const updateSaleInvoiceStatus = (invoiceNumber: string, status: InvoiceStatus): boolean => {
  const parsedStatus = InvoiceStatusSchema.safeParse(status);
  if (!parsedStatus.success) {
    console.error("Could not update invoice status: invalid status.", parsedStatus.error);
    return false;
  }

  const storedInvoices = [
    ...getAllMainInvoices().map((entry) => ({ ...entry, type: "main" as const })),
    ...getAllExtraInvoices().map((entry) => ({ ...entry, type: "extra" as const })),
  ];
  const match = storedInvoices.find(({ invoice }) => invoice.invoiceNo === invoiceNumber);
  if (!match) return false;

  const invoiceResult = SavedMainInvoiceSchema.safeParse(match.invoice);
  if (!invoiceResult.success) {
    console.error(`Invoice record "${invoiceNumber}" is invalid.`, invoiceResult.error);
    return false;
  }

  const updatedInvoice = { ...invoiceResult.data, status: parsedStatus.data };
  if (match.type === "main") {
    saveMainInvoice(match.preAlertId, updatedInvoice);
  } else {
    saveExtraInvoice(match.preAlertId, updatedInvoice);
  }

  return true;
};

const demoPreAlert: PreAlertDetails = {
  id: "demo-sale-invoice-pre-alert",
  manifestId: "MAN-26031",
  manifestNumber: "MAN-26031",
  origin: "DXB",
  destination: "LHR",
  consigneeAddress: "London consignee",
  masterAwbNumber: "176-12345678",
  houseAwbNumber: "NSM-031",
  airlineName: "Emirates SkyCargo",
  etd: "2026-10-24",
  eta: "2026-10-25",
  distance: "5,500 km",
  documentNames: [],
  remarks: "Sample invoice data",
  createdAt: "2026-10-20T09:00:00.000Z",
  client: "Northstar Marine",
  vessel: "Ocean Pioneer",
  hub: "Dubai",
  mode: "Air",
  keyAccountManager: "Alex Morgan",
  vendorInvoices: [{ invoiceNo: "GAC-VI-26031" }],
  status: "Completed",
  stage: 4,
};

const createDemoInvoice = (
  type: SaleInvoiceRow["type"],
  invoiceId: string,
  invoiceNo: string,
  status: SavedMainInvoice["status"],
  invoiceDate: string,
): SaleInvoiceRow => {
  const totalCost = type === "main" ? 4200 : 850;
  const totalPrice = type === "main" ? 5800 : 1200;

  return {
    preAlert: demoPreAlert,
    type,
    source: "demo",
    invoice: {
      invoiceId,
      invoiceNo,
      form: {
        recipient: demoPreAlert.client ?? "",
        invoiceDate,
        dueDate: "2026-11-24",
        paymentTerms: "30",
        invoiceCurrency: "AED",
        proformaInvoice: "",
        clientPoNumber: "NSM-PO-26031",
        notes: "Sample data for the Sale Invoice list.",
      },
      status,
      subInvoices: [{
        id: `${invoiceId}-sub`,
        manifestNo: demoPreAlert.manifestNumber,
        vessels: [demoPreAlert.vessel ?? ""],
        shipmentRef: "NSM-031",
        clientRef: "NSM-PO-26031",
        services: "Freight",
        transportDocRef: demoPreAlert.masterAwbNumber,
        origin: demoPreAlert.origin,
        destination: demoPreAlert.destination,
        eta: demoPreAlert.eta,
        etd: demoPreAlert.etd,
        jobCompletionDate: "2026-10-26",
        packages: "12",
        totalWeight: "845",
        vendorCosts: [{
          id: `${invoiceId}-vendor`,
          vendorName: "Gulf Agency Company",
          vendorInvoice: "GAC-VI-26031",
          purchaseAmount: String(totalCost),
          currency: "AED",
          vatPercent: "5",
          vatAmount: "210",
          finalAmountAed: String(totalCost + 210),
        }],
        lines: [{
          id: `${invoiceId}-line`,
          description: "International freight",
          additionalDescription: "",
          currency: "AED",
          unitPrice: String(totalPrice),
          qty: "1",
          vat: "5",
        }],
      }],
      amount: totalPrice,
      totalCost,
      totalPrice,
      totalProfit: totalPrice - totalCost,
      savedAt: `${invoiceDate}T09:00:00.000Z`,
    },
  };
};

const demoRows: SaleInvoiceRow[] = [
  createDemoInvoice("main", "demo-main-invoice-26031", "INV-2026-031", "Issued", "2026-10-24"),
  createDemoInvoice("extra", "demo-extra-invoice-26031", "EX-INV-2026-031", "Draft", "2026-10-26"),
];

const readStage4Rows = (): PreAlertDetails[] => {
  const stored = localStorage.getItem(STAGE4_STORAGE_KEY);
  if (!stored) return [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(stored);
  } catch (error) {
    console.error("Could not read Stage 4 pre-alerts for sale invoices.", error);
    return [];
  }

  if (!Array.isArray(parsed)) {
    console.error("Stage 4 pre-alerts have an invalid storage format.");
    return [];
  }

  const validRows: PreAlertDetails[] = [];
  parsed.forEach((value: unknown) => {
    const result = PreAlertDetailsSchema.safeParse(value);
    if (result.success && (result.data.stage ?? 4) === 4) {
      validRows.push(result.data);
    } else if (!result.success) {
      console.error("A Stage 4 pre-alert has an invalid record.", result.error);
    }
  });
  return validRows;
};

export const getSaleInvoiceRows = (): SaleInvoiceRow[] => {
  const stage4Rows = new Map(readStage4Rows().map((preAlert) => [preAlert.id, preAlert]));
  const savedInvoices = [
    ...getAllMainInvoices().map((entry) => ({ ...entry, type: "main" as const })),
    ...getAllExtraInvoices().map((entry) => ({ ...entry, type: "extra" as const })),
  ];
  if (savedInvoices.length === 0) return demoRows;

  return savedInvoices.flatMap(({ preAlertId, invoice: storedInvoice, type }) => {
    const invoiceResult = SavedMainInvoiceSchema.safeParse(storedInvoice);
    if (!invoiceResult.success) {
      console.error(`Invoice record "${storedInvoice.invoiceNo}" is invalid.`, invoiceResult.error);
      return [];
    }
    const invoice = invoiceResult.data;
    let preAlert = stage4Rows.get(preAlertId);
    if (!preAlert && invoice.preAlert) {
      const result = PreAlertDetailsSchema.safeParse(invoice.preAlert);
      if (!result.success) {
        console.error(`Invoice "${invoice.invoiceNo}" has invalid Stage 4 details.`, result.error);
        return [];
      }
      if (result.data.id !== preAlertId) {
        console.error(`Invoice "${invoice.invoiceNo}" does not match its saved pre-alert.`);
        return [];
      }
      preAlert = result.data;
    }

    if (!preAlert || (preAlert.stage ?? 4) !== 4) return [];
    const rowResult = SaleInvoiceRowSchema.safeParse({ preAlert, invoice, type, source: "saved" });
    if (!rowResult.success) {
      console.error(`Invoice "${invoice.invoiceNo}" has invalid sale invoice data.`, rowResult.error);
      return [];
    }
    return [rowResult.data];
  });
};
