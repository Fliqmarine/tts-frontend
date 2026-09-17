import { api } from "../../../../services/api";
import type { Contact, CreateContactRequest } from "../types/contact.types";
import { parseContact, parseContacts } from "../types/contact.types";

export const createContact = async (
    data: CreateContactRequest,
    files?: File[],
): Promise<Contact> => {
    const formData = new FormData();

    // Top-level fields
    formData.append("groupId", data.groupId);
    if (data.description) formData.append("description", data.description);
    formData.append("companyName", data.companyName);
    formData.append("email", data.email);
    formData.append("phone", data.phone);

    if (data.initial) formData.append("initial", data.initial);
    if (data.faxNo) formData.append("faxNo", data.faxNo);
    if (data.address) formData.append("address", data.address);
    if (data.city) formData.append("city", data.city);
    if (data.country) formData.append("country", data.country);
    if (data.postalCode) formData.append("postalCode", data.postalCode);
    if (data.vatNo) formData.append("vatNo", data.vatNo);
    if (data.stationCode) formData.append("stationCode", data.stationCode);
    if (data.eoriUiseNo) formData.append("eoriUiseNo", data.eoriUiseNo);
    if (data.notifyParty) formData.append("notifyParty", data.notifyParty);
    if (data.airportCode) formData.append("airportCode", data.airportCode);
    if (data.oppManager) formData.append("oppManager", data.oppManager);
    if (data.bankDetails) formData.append("bankDetails", data.bankDetails);
    if (data.clientHubs) formData.append("clientHubs", data.clientHubs);
    if (data.multipleEmail) formData.append("multipleEmail", data.multipleEmail);

    // Person in charge (serialize as JSON)
    if (data.personIncharge) {
        formData.append("personIncharge", JSON.stringify(data.personIncharge));
    }

    // Accounting details (serialize as JSON)
    if (data.accountingDetails) {
        formData.append("accountingDetails", JSON.stringify(data.accountingDetails));
    }

    // Optional file upload(s)
    if (files && files.length > 0) {
        files.forEach((f) => formData.append("files", f));
    }

    const response = await api.post<Contact>("/contacts", formData, {
        headers: {
            "Content-Type": undefined, // let browser set multipart boundary
        },
    });

    return parseContact(response.data);
};

export const getContacts = async (): Promise<Contact[]> => {
    const response = await api.get<Contact[]>("/contacts");
    return parseContacts(response.data);
};

export const getContact = async (id: number): Promise<Contact> => {
    const response = await api.get<Contact>(`/contacts/${id}`);
    return parseContact(response.data);
};

export const updateContact = async (
    id: number,
    data: Partial<CreateContactRequest>,
    files?: File[],
): Promise<Contact> => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && typeof value !== "object") {
            formData.append(key, String(value));
        }
    });

    if (data.personIncharge) {
        formData.append("personIncharge", JSON.stringify(data.personIncharge));
    }
    if (data.accountingDetails) {
        formData.append("accountingDetails", JSON.stringify(data.accountingDetails));
    }

    if (files && files.length > 0) {
        files.forEach((f) => formData.append("files", f));
    }

    const response = await api.patch<Contact>(`/contacts/${id}`, formData);
    return parseContact(response.data);
};

export const deleteContact = async (id: number): Promise<void> => {
    await api.delete(`/contacts/${id}`);
};
