import { z } from "zod";
import { getSaleInvoiceRows } from "./saleInvoice.types";

export const ClientReceiptStatusSchema = z.enum([
  "Received",
  "Partially Received",
  "Invoice Generated",
  "Overdue",
  "Reopen Request",
  "Reopened",
  "Paid",
]);
export type ClientReceiptStatus = z.infer<typeof ClientReceiptStatusSchema>;

export const ClientReceiptRowSchema = z.object({
  id: z.string(),
  invoiceId: z.string(),
  invoiceType: z.enum(["main", "extra"]),
  receiptNumber: z.string(),
  receiptDate: z.string(),
  invoiceNumber: z.string(),
  invoiceDate: z.string(),
  client: z.string(),
  clientPoNumber: z.string(),
  vessel: z.string(),
  manifestNumber: z.string(),
  mode: z.string(),
  origin: z.string(),
  destination: z.string(),
  departureDate: z.string(),
  arrivalDate: z.string(),
  totalAmount: z.number(),
  receivedAmount: z.number(),
  outstandingAmount: z.number(),
  finalProfit: z.number(),
  finalProfitPercentage: z.number(),
  bankRefNo: z.string(),
  clientBankRefNo: z.string(),
  referenceNumber: z.string(),
  amount: z.number(),
  currency: z.string(),
  status: ClientReceiptStatusSchema,
  documentName: z.string().optional(),
  documentDataUrl: z.string().optional(),
});
export type ClientReceiptRow = z.infer<typeof ClientReceiptRowSchema>;

export const ReceiptUpdateSchema = z.object({
  amountReceived: z.number().positive(),
  ourBankReference: z.string(),
  clientBankReference: z.string(),
  receivedDate: z.string(),
  removeDocument: z.boolean(),
  document: z.custom<File | null>(
    (value) => value === null || (typeof File !== "undefined" && value instanceof File),
  ),
});
export type ReceiptUpdate = z.infer<typeof ReceiptUpdateSchema>;

export const ClientReceiptFiltersSchema = z.object({
  search: z.string(),
  client: z.string(),
  status: z.string(),
  receiptNumber: z.string(),
  invoiceNumber: z.string(),
  fromDate: z.string(),
  toDate: z.string(),
});
export type ClientReceiptFilters = z.infer<typeof ClientReceiptFiltersSchema>;

export const ClientReceiptSelectFilterKeySchema = z.enum([
  "client",
  "status",
]);
export type ClientReceiptSelectFilterKey = z.infer<typeof ClientReceiptSelectFilterKeySchema>;

export const ClientReceiptPaymentSchema = z.object({
  receiptNumber: z.string(),
  amount: z.number().positive(),
  receivedDate: z.string(),
  ourBankReference: z.string(),
  clientBankReference: z.string(),
  documentName: z.string().optional(),
  documentDataUrl: z.string().optional(),
});
export type ClientReceiptPayment = z.infer<typeof ClientReceiptPaymentSchema>;

export const StoredClientReceiptSchema = z.object({
  invoiceId: z.string(),
  status: ClientReceiptStatusSchema,
  payments: z.array(ClientReceiptPaymentSchema),
});
export type StoredClientReceipt = z.infer<typeof StoredClientReceiptSchema>;

const CLIENT_RECEIPTS_STORAGE_KEY = "tts-client-receipts";

const readStoredClientReceipts = (): StoredClientReceipt[] => {
  const stored = localStorage.getItem(CLIENT_RECEIPTS_STORAGE_KEY);
  if (!stored) return [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(stored);
  } catch (error) {
    console.error("Could not read Client Receipt records.", error);
    throw new Error("Client Receipt records contain invalid JSON.", { cause: error });
  }

  const result = z.array(StoredClientReceiptSchema).safeParse(parsed);
  if (!result.success) {
    console.error("Client Receipt records have an invalid format.", result.error);
    throw new Error("Client Receipt records have an invalid format.");
  }
  return result.data;
};

const writeStoredClientReceipts = (receipts: StoredClientReceipt[]) => {
  const result = z.array(StoredClientReceiptSchema).safeParse(receipts);
  if (!result.success) {
    console.error("Could not save invalid Client Receipt records.", result.error);
    throw new Error("Client Receipt records failed validation.");
  }
  localStorage.setItem(CLIENT_RECEIPTS_STORAGE_KEY, JSON.stringify(result.data));
};

export const getClientReceiptRows = (): ClientReceiptRow[] => {
  const receiptRecords = new Map(
    readStoredClientReceipts().map((receipt) => [receipt.invoiceId, receipt]),
  );

  return getSaleInvoiceRows().map(({ preAlert, invoice, type, source }) => {
    const savedReceipt = receiptRecords.get(invoice.invoiceId);
    const demoExtraPayment = source === "demo" && !savedReceipt && type === "extra"
      ? {
          receiptNumber: "CR-DEMO-EX-001",
          amount: invoice.totalPrice,
          receivedDate: "2026-10-28",
          ourBankReference: "TRX-EX-26028",
          clientBankReference: "NSM-EX-26028",
          documentName: "demo-extra-receipt.pdf",
          documentDataUrl: undefined,
        }
      : undefined;
    const payments = savedReceipt?.payments ?? (demoExtraPayment ? [demoExtraPayment] : []);
    const receivedAmount = payments.reduce((total, payment) => total + payment.amount, 0);
    const totalAmount = invoice.totalPrice;
    const outstandingAmount = Math.max(0, totalAmount - receivedAmount);
    const latestPayment = payments[payments.length - 1];
    const finalProfit = invoice.totalProfit - (invoice.specialCommission ?? 0);

    return ClientReceiptRowSchema.parse({
      id: invoice.invoiceId,
      invoiceId: invoice.invoiceId,
      invoiceType: type,
      receiptNumber: latestPayment?.receiptNumber ?? "",
      receiptDate: latestPayment?.receivedDate ?? "",
      invoiceNumber: invoice.invoiceNo,
      invoiceDate: invoice.form.invoiceDate,
      client: invoice.form.recipient || preAlert.client || "",
      clientPoNumber: invoice.form.clientPoNumber,
      vessel: [...new Set([
        ...invoice.subInvoices.flatMap(({ vessels }) => vessels),
        preAlert.vessel ?? "",
      ].filter(Boolean))].join(", "),
      manifestNumber: [...new Set([
        ...invoice.subInvoices.map(({ manifestNo }) => manifestNo),
        preAlert.manifestNumber,
      ].filter(Boolean))].join(", "),
      mode: preAlert.mode ?? "",
      origin: [...new Set(invoice.subInvoices.map(({ origin }) => origin).filter(Boolean))].join(", ") || preAlert.origin,
      destination: [...new Set(invoice.subInvoices.map(({ destination }) => destination).filter(Boolean))].join(", ") || preAlert.destination,
      departureDate: [...new Set(invoice.subInvoices.map(({ etd }) => etd).filter(Boolean))].join(", ") || preAlert.etd,
      arrivalDate: [...new Set(invoice.subInvoices.map(({ eta }) => eta).filter(Boolean))].join(", ") || preAlert.eta,
      totalAmount,
      receivedAmount,
      outstandingAmount,
      finalProfit,
      finalProfitPercentage: totalAmount ? (finalProfit / totalAmount) * 100 : 0,
      bankRefNo: latestPayment?.ourBankReference ?? "",
      clientBankRefNo: latestPayment?.clientBankReference ?? "",
      referenceNumber: latestPayment?.clientBankReference ?? "",
      amount: latestPayment?.amount ?? 0,
      currency: invoice.form.invoiceCurrency || "AED",
      status: savedReceipt?.status ?? (demoExtraPayment ? "Received" : "Invoice Generated"),
      documentName: latestPayment?.documentName,
      documentDataUrl: latestPayment?.documentDataUrl,
    });
  });
};

export const addClientReceiptPayment = async (
  row: ClientReceiptRow,
  update: ReceiptUpdate,
): Promise<ClientReceiptRow> => {
  const updateResult = ReceiptUpdateSchema.safeParse(update);
  if (!updateResult.success) {
    console.error("Client Receipt payment is invalid.", updateResult.error);
    throw new Error("Client Receipt payment failed validation.");
  }

  const receipts = readStoredClientReceipts();
  const existingIndex = receipts.findIndex((receipt) => receipt.invoiceId === row.invoiceId);
  const existing = existingIndex < 0
    ? { invoiceId: row.invoiceId, status: row.status, payments: [] }
    : receipts[existingIndex];
  const isEditingPayment = row.status === "Reopened";
  const existingPayments = existing.payments.length > 0
    ? existing.payments
    : isEditingPayment && row.amount > 0
      ? [{
          receiptNumber: row.receiptNumber,
          amount: row.amount,
          receivedDate: row.receiptDate,
          ourBankReference: row.bankRefNo,
          clientBankReference: row.clientBankRefNo,
          documentName: row.documentName,
          documentDataUrl: row.documentDataUrl,
        }]
      : [];
  const paymentBeingEdited = isEditingPayment
    ? existingPayments[existingPayments.length - 1]
    : undefined;
  const maximumAmount = row.outstandingAmount + (paymentBeingEdited?.amount ?? 0);
  if (updateResult.data.amountReceived > maximumAmount) {
    throw new Error("Amount received cannot exceed the outstanding amount.");
  }

  const documentDataUrl = updateResult.data.document
    ? await readFileAsDataUrl(updateResult.data.document)
    : updateResult.data.removeDocument
      ? undefined
      : paymentBeingEdited?.documentDataUrl;
  const paymentResult = ClientReceiptPaymentSchema.safeParse({
    receiptNumber: paymentBeingEdited?.receiptNumber ?? `CR-${Date.now()}`,
    amount: updateResult.data.amountReceived,
    receivedDate: updateResult.data.receivedDate,
    ourBankReference: updateResult.data.ourBankReference,
    clientBankReference: updateResult.data.clientBankReference,
    documentName: updateResult.data.document?.name
      ?? (updateResult.data.removeDocument ? undefined : paymentBeingEdited?.documentName),
    documentDataUrl,
  });
  if (!paymentResult.success) {
    console.error("Client Receipt payment record is invalid.", paymentResult.error);
    throw new Error("Client Receipt payment failed validation.");
  }

  const receivedAmount = row.receivedAmount
    - (paymentBeingEdited?.amount ?? 0)
    + paymentResult.data.amount;
  const outstandingAmount = Math.max(0, row.totalAmount - receivedAmount);
  const nextPayments = paymentBeingEdited
    ? existingPayments.map((payment, index) =>
        index === existingPayments.length - 1 ? paymentResult.data : payment,
      )
    : [...existingPayments, paymentResult.data];
  const updatedReceipt = StoredClientReceiptSchema.parse({
    ...existing,
    status: outstandingAmount === 0 ? "Paid" : "Partially Received",
    payments: nextPayments,
  });

  const nextReceipts = existingIndex < 0
    ? [...receipts, updatedReceipt]
    : receipts.map((receipt, index) => index === existingIndex ? updatedReceipt : receipt);
  writeStoredClientReceipts(nextReceipts);

  const latestPayment = updatedReceipt.payments[updatedReceipt.payments.length - 1];
  return ClientReceiptRowSchema.parse({
    ...row,
    receiptNumber: latestPayment.receiptNumber,
    receiptDate: latestPayment.receivedDate,
    receivedAmount,
    outstandingAmount,
    amount: latestPayment.amount,
    bankRefNo: latestPayment.ourBankReference,
    clientBankRefNo: latestPayment.clientBankReference,
    referenceNumber: latestPayment.clientBankReference,
    status: updatedReceipt.status,
    documentName: latestPayment.documentName,
    documentDataUrl: latestPayment.documentDataUrl,
  });
};

const readFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("Uploaded receipt document could not be read."));
        return;
      }
      resolve(reader.result);
    };
    reader.onerror = () => reject(reader.error ?? new Error("Uploaded receipt document could not be read."));
    reader.readAsDataURL(file);
  });

export const updateClientReceiptStatus = (
  invoiceId: string,
  status: ClientReceiptStatus,
): void => {
  const receipts = readStoredClientReceipts();
  const existingIndex = receipts.findIndex((receipt) => receipt.invoiceId === invoiceId);
  const existing = existingIndex < 0
    ? { invoiceId, status, payments: [] }
    : { ...receipts[existingIndex], status };
  const updated = StoredClientReceiptSchema.parse(existing);
  writeStoredClientReceipts(existingIndex < 0
    ? [...receipts, updated]
    : receipts.map((receipt, index) => index === existingIndex ? updated : receipt));
};