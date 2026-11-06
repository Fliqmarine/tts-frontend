export interface ClientCoordinator {
	name: string;
	email: string;
	phone: string;
}

export interface ClientForm {
	companyName: string;
	city: string;
	country: string;
	address: string;
	postalCode: string;
	// vatNo: string;
	multipleEmail: string;
	coordinatorInCharge: ClientCoordinator;
	additionalCoordinators?: ClientCoordinator[];
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
	fob: string;
	sellingRate: string;
	rebate: string;
}

export interface ClientRecord extends Partial<Omit<ClientForm, "coordinatorInCharge" | "accountingDetails">> {
	coordinatorInCharge?: Partial<ClientForm["coordinatorInCharge"]>;
	additionalCoordinators?: ClientCoordinator[];
	accountingDetails?: Partial<ClientForm["accountingDetails"]>;
}

export interface ClientSavedData extends ClientForm {
	groupId: "Client";
}
