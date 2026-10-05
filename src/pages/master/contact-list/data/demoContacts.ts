import type { Contact } from "../types/contact.types";

export const demoContacts: Contact[] = [
	{ id: 2101, groupId: "TTS Agent", companyName: "Meridian Cargo Group", stationCode: "DOH", city: "Doha", country: "QA", address: "West Bay, Al Corniche Street", postalCode: "20000", coordinatorInCharge: { name: "Layla Rahman", email: "layla.rahman@example.com", phone: "+97444123456" }, createdAt: "2026-01-12T09:00:00.000Z", updatedAt: "2026-02-08T11:30:00.000Z" },
	{ id: 2102, groupId: "Supplier", companyName: "Atlas Ground Services", stationCode: "DXB", city: "Dubai", country: "AE", address: "Dubai Airport Free Zone", postalCode: "54999", coordinatorInCharge: { name: "Omar Farouk", email: "omar.farouk@example.com", phone: "+97142234567" }, createdAt: "2026-01-18T08:15:00.000Z", updatedAt: "2026-02-11T10:00:00.000Z" },
	{ id: 2103, groupId: "Owners Agent", companyName: "Bluewater Maritime", stationCode: "SIN", city: "Singapore", country: "SG", address: "Marina View 12", postalCode: "018961", coordinatorInCharge: { name: "Chloe Tan", email: "chloe.tan@example.com", phone: "+6561234567" }, createdAt: "2026-02-02T07:45:00.000Z", updatedAt: "2026-02-19T13:20:00.000Z" },
	{ id: 2104, groupId: "Sub Agent", companyName: "Alpine Transit Partners", stationCode: "ZRH", city: "Zurich", country: "CH", address: "Bahnhofstrasse 21", postalCode: "8001", coordinatorInCharge: { name: "Jonas Keller", email: "jonas.keller@example.com", phone: "+41445551234" }, createdAt: "2026-02-06T12:00:00.000Z", updatedAt: "2026-02-22T09:10:00.000Z" },
];

const storageKey = "tts-demo-contacts";

export function loadDemoContacts(): Contact[] {
	try {
		const saved = window.localStorage.getItem(storageKey);
		if (!saved) return demoContacts;

		const parsed: unknown = JSON.parse(saved);
		return Array.isArray(parsed) ? parsed as Contact[] : demoContacts;
	} catch {
		return demoContacts;
	}
}

export function saveDemoContacts(contacts: Contact[]): void {
	window.localStorage.setItem(storageKey, JSON.stringify(contacts));
}