export interface ClientForm {
	companyName: string;
	city: string;
	country: string;
	address: string;
	postalCode: string;
	vatNo: string;
	multipleEmail: string;
	coordinatorInCharge: { name: string; email: string; phone: string };
	accountingDetails: {
		name: string;
		email: string;
		phone: string;
		country: string;
		creditLimit: string;
		useBillingCurrency: boolean;
		paymentTerms: string;
		currency: string;
		billingAddress: string;
		specialInstructions: string;
	};
	keyAccountManager: string;
	bankDetails: string;
}

export interface ClientRecord extends Partial<Omit<ClientForm, "coordinatorInCharge" | "accountingDetails">> {
	coordinatorInCharge?: Partial<ClientForm["coordinatorInCharge"]>;
	accountingDetails?: Partial<ClientForm["accountingDetails"]>;
}

export interface ClientSavedData extends ClientForm {
	groupId: "Client";
}
