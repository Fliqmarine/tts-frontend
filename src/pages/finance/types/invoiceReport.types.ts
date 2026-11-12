import { z } from "zod";
import { getClientReceiptRows } from "./clientReceipt.types";
import { getSaleInvoiceRows } from "./saleInvoice.types";

export const InvoiceReportFiltersSchema = z.object({
  client: z.string(),
  vessel: z.string(),
  status: z.string(),
  manifestNo: z.string(),
  invoiceNo: z.string(),
  mode: z.string(),
  dateFrom: z.string(),
  dateTo: z.string(),
});

export type InvoiceReportFilters = z.infer<typeof InvoiceReportFiltersSchema>;

export const InvoiceReportSelectFilterKeySchema = z.enum([
  "client",
  "vessel",
  "status",
  "mode",
]);

export type InvoiceReportSelectFilterKey = z.infer<
  typeof InvoiceReportSelectFilterKeySchema
>;

export type InvoiceReportFilterOptions = Partial<
  Record<InvoiceReportSelectFilterKey, string[]>
>;

export type InvoiceReportFilterProps = {
  filters: InvoiceReportFilters;
  onChange: (filters: InvoiceReportFilters) => void;
  options?: InvoiceReportFilterOptions;
};

export const InvoiceReportRowSchema = z.object({
  invoiceNo: z.string(),
  invoiceDate: z.string(),
  status: z.string(),
  client: z.string(),
  clientPoNo: z.string(),
  vessel: z.string(),
  manifestNo: z.string(),
  mode: z.string(),
  origin: z.string(),
  destination: z.string(),
  departureDate: z.string(),
  arrivalDate: z.string(),
  totalAmount: z.number(),
  receivedAmount: z.number(),
  currency: z.string(),
  totalCost: z.number(),
  totalProfit: z.number(),
  specialCommission: z.number(),
  finalProfit: z.number(),
  finalProfitPercentage: z.number(),
});

export type InvoiceReportRow = z.infer<typeof InvoiceReportRowSchema>;

const uniqueValues = (values: string[]) =>
  [...new Set(values.filter(Boolean))].join(", ");

export const getInvoiceReportRows = (): InvoiceReportRow[] => {
  const saleRows = getSaleInvoiceRows().filter(
    ({ type, source }) => type === "main" && source === "saved",
  );
  const receipts = new Map(
    getClientReceiptRows().map((row) => [row.invoiceId, row.receivedAmount]),
  );

  return saleRows.map(({ preAlert, invoice }) => {
    const totalProfit = invoice.totalProfit;
    const specialCommission = invoice.specialCommission ?? 0;
    const finalProfit = totalProfit - specialCommission;
    const totalAmount = invoice.totalPrice;
    const subInvoices = invoice.subInvoices;
    const receivedAmount = receipts.get(invoice.invoiceId) ?? 0;
    const status = invoice.status === "Draft"
      ? "Draft"
      : totalAmount > 0 && receivedAmount >= totalAmount
        ? "Received"
        : receivedAmount > 0
          ? "Partially Received"
          : "Invoice Generated";

    return {
      invoiceNo: invoice.invoiceNo,
      invoiceDate: invoice.form.invoiceDate,
      status,
      client: invoice.form.recipient || preAlert.client || "",
      clientPoNo: invoice.form.clientPoNumber,
      vessel: uniqueValues([
        ...subInvoices.flatMap(({ vessels }) => vessels),
        preAlert.vessel ?? "",
      ]),
      manifestNo: uniqueValues([
        ...subInvoices.map(({ manifestNo }) => manifestNo),
        preAlert.manifestNumber,
      ]),
      mode: preAlert.mode ?? "",
      origin: uniqueValues(subInvoices.map(({ origin }) => origin)) || preAlert.origin,
      destination:
        uniqueValues(subInvoices.map(({ destination }) => destination)) ||
        preAlert.destination,
      departureDate:
        uniqueValues(subInvoices.map(({ etd }) => etd)) || preAlert.etd,
      arrivalDate:
        uniqueValues(subInvoices.map(({ eta }) => eta)) || preAlert.eta,
      totalAmount,
      receivedAmount,
      currency: invoice.form.invoiceCurrency || "AED",
      totalCost: invoice.totalCost,
      totalProfit,
      specialCommission,
      finalProfit,
      finalProfitPercentage: totalAmount ? (finalProfit / totalAmount) * 100 : 0,
    };
  });
};

export const DEFAULT_INVOICE_REPORT_FILTERS: InvoiceReportFilters = {
  client: "",
  vessel: "",
  status: "",
  manifestNo: "",
  invoiceNo: "",
  mode: "",
  dateFrom: "",
  dateTo: "",
};