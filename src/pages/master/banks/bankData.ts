import type { Bank } from "./types/bank.types";

export const DEMO_BANKS: Bank[] = [
  { id: 1, entity: "TTS", bank: "Emirates NBD", bankCode: "EBILAEAD", accountName: "TTS Logistics LLC", accountNumber: "1015-800-432710", currency: "AED", bankBalance: "245000.00", isActive: true },
  { id: 2, entity: "TTS", bank: "Emirates NBD", bankCode: "EBILAEAD", accountName: "TTS Logistics LLC", accountNumber: "1015-800-432711", currency: "USD", bankBalance: "87500.00", isActive: true },
  { id: 3, entity: "Fliq", bank: "Mashreq Bank", bankCode: "BOMLAEAD", accountName: "Fliq Technologies FZE", accountNumber: "0192-0000-4871", currency: "AED", bankBalance: "562300.00", isActive: true },
  { id: 4, entity: "Fliq", bank: "ADCB", bankCode: "ADCBAEAD", accountName: "Fliq Technologies FZE", accountNumber: "1100-8832-7654", currency: "USD", bankBalance: "134200.00", isActive: false },
  { id: 5, entity: "MFS", bank: "RAK Bank", bankCode: "NABORAKH", accountName: "MFS Services LLC", accountNumber: "0723-5541-9012", currency: "AED", bankBalance: "98750.00", isActive: true },
  { id: 6, entity: "Fliq LLP", bank: "HSBC", bankCode: "BBMEAEAD", accountName: "Fliq LLP Partners", accountNumber: "4400-1122-3344", currency: "GBP", bankBalance: "45000.00", isActive: true },
  { id: 7, entity: "TTS", bank: "FAB", bankCode: "NBADAEAD", accountName: "TTS Logistics LLC", accountNumber: "6677-8899-0011", currency: "EUR", bankBalance: "67200.00", isActive: false },
  { id: 8, entity: "MFS", bank: "DIB", bankCode: "DUIBAEAD", accountName: "MFS Services LLC", accountNumber: "2233-4455-6677", currency: "AED", bankBalance: "312000.00", isActive: true },
];
