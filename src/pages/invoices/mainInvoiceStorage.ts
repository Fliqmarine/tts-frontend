import type {
  InvoiceStatus,
  MainInvoiceForm,
  SubInvoiceRow,
} from "./types/mainInvoice.types";

const MAIN_INVOICES_STORAGE_KEY = "tts-demo-main-invoices";
const EXTRA_INVOICES_STORAGE_KEY = "tts-demo-extra-invoices";

export type SavedMainInvoice = {
  invoiceId: string;
  invoiceNo: string;
  form: MainInvoiceForm;
  status: InvoiceStatus;
  subInvoices: SubInvoiceRow[];
  amount: number;
  totalCost: number;
  totalPrice: number;
  totalProfit: number;
  savedAt: string;
};

type StoredMainInvoices = Record<string, SavedMainInvoice[]>;

function readStoredInvoices(storageKey: string): StoredMainInvoices {
  const stored = localStorage.getItem(storageKey);
  if (!stored) return {};

  try {
    const parsed: unknown = JSON.parse(stored);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as StoredMainInvoices;
    }
    console.error(`Saved invoices in "${storageKey}" have an invalid storage format.`);
  } catch (error) {
    console.error(`Could not read saved invoices from "${storageKey}".`, error);
  }

  return {};
}

function getInvoices(storageKey: string, preAlertId: string): SavedMainInvoice[] {
  const invoices = readStoredInvoices(storageKey)[preAlertId];
  return Array.isArray(invoices) ? invoices : [];
}

function saveInvoice(storageKey: string, preAlertId: string, invoice: SavedMainInvoice): void {
  const storedInvoices = readStoredInvoices(storageKey);
  const invoices = storedInvoices[preAlertId] ?? [];
  const existingIndex = invoices.findIndex((saved) => saved.invoiceId === invoice.invoiceId);

  if (existingIndex < 0) {
    invoices.push(invoice);
  } else {
    invoices[existingIndex] = invoice;
  }

  storedInvoices[preAlertId] = invoices;
  localStorage.setItem(storageKey, JSON.stringify(storedInvoices));
}

export const getMainInvoices = (preAlertId: string) => getInvoices(MAIN_INVOICES_STORAGE_KEY, preAlertId);
export const saveMainInvoice = (preAlertId: string, invoice: SavedMainInvoice) =>
  saveInvoice(MAIN_INVOICES_STORAGE_KEY, preAlertId, invoice);
export const getExtraInvoices = (preAlertId: string) => getInvoices(EXTRA_INVOICES_STORAGE_KEY, preAlertId);
export const saveExtraInvoice = (preAlertId: string, invoice: SavedMainInvoice) =>
  saveInvoice(EXTRA_INVOICES_STORAGE_KEY, preAlertId, invoice);
