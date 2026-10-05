import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Checkbox,
    CircularProgress,
    FormControlLabel,
    MenuItem,
    Paper,
    Snackbar,
    Alert,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { createContact } from "./services/contact.service";


const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export default function CreateContactPage() {
    const navigate = useNavigate();

    // UI state
    const [isSaving, setIsSaving] = useState(false);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({ open: false, message: "", severity: "success" });
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);

    // Group / description
    const [groupId, setGroupId] = useState("");
    const [description, setDescription] = useState("");

    //*common
    const [companyName, setCompanyName] = useState("");
    const [stationCode, setStationCode] = useState("");
    const [eoriUiseNo, setEoriUiseNo] = useState("");
    const [notifyParty, setNotifyParty] = useState("");
    const [airportCode, setAirportCode] = useState("");
    const [initial, setInitial] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [faxNo, setFaxNo] = useState("");
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [vatNo, setVatNo] = useState("");

    //*Person Incharge
    const [personInchargeName, setPersonInchargeName] = useState("");
    const [personInchargeEmail, setPersonInchargeEmail] = useState("");
    const [personInchargePhone, setPersonInchargePhone] = useState("");
    const [personInchargeFaxNo, setPersonInchargeFaxNo] = useState("");

    //*AccountingDetails
    const [AccountingDetailsName, setAccountingDetailsName] = useState("");
    const [AccountingDetailsEmail, setAccountingDetailsEmail] = useState("");
    const [AccountingDetailsCountry, setAccountingDetailsCountry] = useState("");
    const [AccountingDetailsCreditLimit, setAccountingDetailsCreditLimit] = useState("");
    const [AccountingDetailsUseBillingCurrency, setAccountingDetailsUseBillingCurrency] = useState("");
    const [AccountingDetailsPaymentTerms, setAccountingDetailsPaymentTerms] = useState("");
    const [AccountingDetailsCurrency, setAccountingDetailsCurrency] = useState("");
    const [AccountingDetailsBillingAddress, setAccountingDetailsBillingAddress] = useState("");
    const [AccountingDetailsSpecialInstructions, setAccountingDetailsSpecialInstructions] = useState("");

    //*Multiple Email
    const [multipleEmail, setMultipleEmail] = useState("");
    //*Key Account Manager
    const [oppManager, setOppManager] = useState("");
    //*Bank Detail
    const [bankDetails, setBankDetails] = useState("");
    //*Client Hubs
    const [clientHubs, setClientHubs] = useState("");

    // ─── Save handler ──────────────────────────────────────────────────
    const handleSubmit = async () => {
        if (!groupId || !companyName || !email || !phone) {
            setSnackbar({ open: true, message: "Please fill in all required fields (Group, Company Name, Email, Phone).", severity: "error" });
            return;
        }

        setIsSaving(true);
        try {
            await createContact(
                {
                    groupId,
                    description,
                    companyName,
                    initial,
                    email,
                    phone,
                    faxNo,
                    address,
                    city,
                    country,
                    postalCode,
                    vatNo,
                    stationCode,
                    eoriUiseNo,
                    notifyParty,
                    airportCode,
                    multipleEmail,
                    oppManager,
                    bankDetails,
                    clientHubs,
                    coordinatorIncharge: {
                        name: personInchargeName,
                        email: personInchargeEmail,
                        phone: personInchargePhone,
                        faxNo: personInchargeFaxNo,
                    },
                    accountingDetails: {
                        name: AccountingDetailsName,
                        email: AccountingDetailsEmail,
                        country: AccountingDetailsCountry,
                        creditLimit: AccountingDetailsCreditLimit,
                        useBillingCurrency: AccountingDetailsUseBillingCurrency === "true",
                        paymentTerms: AccountingDetailsPaymentTerms,
                        currency: AccountingDetailsCurrency,
                        billingAddress: AccountingDetailsBillingAddress,
                        specialInstructions: AccountingDetailsSpecialInstructions,
                    },
                },
                uploadedFile,
            );
            setSnackbar({ open: true, message: "Contact saved successfully!", severity: "success" });
            setTimeout(() => navigate(-1), 1200);
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to save contact. Please try again.";
            setSnackbar({ open: true, message: msg, severity: "error" });
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => navigate(-1);

    return (
        <Stack spacing={2}>

            {/* Page Header */}
            <Typography
                variant="h5"
                sx={{ fontWeight: 600 }}
            >
                Create Contact
            </Typography>

            {/* Group Selection */}
            <Box sx={{
                display: "flex",
                flexDirection: "row",
                gap: 2,
                justifyContent: "space-between",
            }}>
                <Box sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 2,
                    alignItems: "center",
                }}>

                    <TextField
                        select
                        label="Group ID"
                        value={groupId}
                        onChange={(event) =>
                            setGroupId(event.target.value)
                        }
                        sx={{
                            width: 200,
                        }}
                    >
                        <MenuItem value="Client">
                            Client
                        </MenuItem>

                        <MenuItem value="Hub">
                            Hub
                        </MenuItem>

                        <MenuItem value="TTS Agent">
                            TTS Agent
                        </MenuItem>

                        <MenuItem value="Sub Agent">
                            Sub Agent
                        </MenuItem>

                        <MenuItem value="Sub Agent Onboard">
                            Sub Agent Onboard
                        </MenuItem>

                        <MenuItem value="Sub Agent Export">
                            Sub Agent Export
                        </MenuItem>

                        <MenuItem value="Owners Agent">
                            Owners Agent
                        </MenuItem>

                        <MenuItem value="Supplier">
                            Supplier
                        </MenuItem>

                    </TextField>
                    <TextField
                        label="Description"
                        value={description}
                        onChange={(event) =>
                            setDescription(event.target.value)
                        }
                    />
                </Box>
                {/*Buttons*/}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 2,
                        alignItems: "center",
                    }}
                >
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={handleCancel}
                        disabled={isSaving}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        disabled={isSaving}
                        startIcon={isSaving ? <CircularProgress size={16} color="inherit" /> : null}
                    >
                        {isSaving ? "Saving…" : "Save"}
                    </Button>
                </Box>
            </Box>

            {/* Dynamic Form */}
            {/* Client Form */}
            {groupId === "Client" && (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 3,
                        flexWrap: "wrap",
                    }}>
                    {/*Column-01*/}
                    {/*Contact Details*/}
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            flex: "1 1 330px",
                        }}
                    >
                        <Box
                            component={Paper}
                            sx={{
                                flex: 1,
                                py: 2,
                                px: 2,
                                gap: 1,
                                display: "flex",
                                flexDirection: "column",
                            }}>
                            <TextField
                                label="Company Name"
                                value={companyName}
                                onChange={(event) =>
                                    setCompanyName(event.target.value)
                                }
                                fullWidth
                                required
                            />
                            <Box
                                sx={{
                                    display: "flex",
                                    gap: 1,
                                }}>
                                <TextField
                                    label="Initial"
                                    type="text"
                                    value={initial}
                                    onChange={(event) =>
                                        setInitial(event.target.value)
                                    }
                                    required
                                    sx={{
                                        flex: 1,
                                    }}
                                />
                                <TextField
                                    label="Email"
                                    type="email"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                    required
                                    sx={{
                                        flex: 1,
                                    }}
                                />
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    gap: 1,
                                }}>
                                <TextField
                                    label="Phone"
                                    type="tel"
                                    value={phone}
                                    onChange={(event) =>
                                        setPhone(event.target.value)
                                    }
                                    fullWidth
                                    required
                                />
                                <TextField
                                    label="Fax No"
                                    type="fax_no"
                                    value={faxNo}
                                    onChange={(event) =>
                                        setFaxNo(event.target.value)
                                    }
                                    fullWidth
                                />
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    gap: 1,
                                }}>
                                <TextField
                                    label="City"
                                    value={city}
                                    onChange={(event) =>
                                        setCity(event.target.value)
                                    }
                                    fullWidth
                                    required
                                />
                                <TextField
                                    label="Country"
                                    value={country}
                                    onChange={(event) =>
                                        setCountry(event.target.value)
                                    }
                                    fullWidth
                                    required
                                />
                            </Box>
                            <TextField
                                label="Address"
                                value={address}
                                onChange={(event) =>
                                    setAddress(event.target.value)
                                }
                                fullWidth
                                required
                                multiline
                                rows={3}
                            />
                            <Box
                                sx={{
                                    display: "flex",
                                    gap: 1,
                                }}>
                                <TextField
                                    label="Postal Code"
                                    type="postal_code"
                                    value={postalCode}
                                    onChange={(event) =>
                                        setPostalCode(event.target.value)
                                    }
                                    fullWidth
                                />
                                <TextField
                                    label="Vat No"
                                    value={vatNo}
                                    onChange={(event) =>
                                        setVatNo(event.target.value)
                                    }
                                    fullWidth
                                />
                            </Box>
                            <Button
                                component="label"
                                role={undefined}
                                variant="contained"
                                tabIndex={-1}
                                startIcon={<CloudUploadIcon />}
                                accept="image/jpeg,image/png,application/pdf"
                            >
                                Upload files
                                <VisuallyHiddenInput
                                    type="file"
                                    onChange={(event) => setUploadedFile(event.target.files?.[0] ?? null)}
                                    multiple
                                />
                            </Button>

                        </Box>
                        {/*Person Incharge*/}
                        <Box
                            component={Paper}
                            sx={{
                                flex: 1,
                                py: 2,
                                px: 2,
                                gap: 1.5,
                                display: "flex",
                                flexDirection: "column",
                            }}>
                            <Box
                                sx={{
                                    py: 0.5,
                                    px: 2,
                                    display: "flex",
                                    alignItems: "center",
                                    backgroundColor: "#3B6E91",
                                    color: "white",
                                    borderRadius: 1,
                                }}>
                                <Typography variant="subtitle2">
                                    Person in charge
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    gap: 1,

                                }}>
                                <TextField
                                    label="Name"
                                    value={personInchargeName}
                                    onChange={(event) =>
                                        setPersonInchargeName(event.target.value)
                                    }
                                    fullWidth
                                    required
                                />
                                <TextField
                                    label="Email"
                                    value={personInchargeEmail}
                                    onChange={(event) =>
                                        setPersonInchargeEmail(event.target.value)
                                    }
                                    fullWidth
                                    required
                                />
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    gap: 1,

                                }}>
                                <TextField
                                    label="phone"
                                    value={personInchargePhone}
                                    onChange={(event) =>
                                        setPersonInchargePhone(event.target.value)
                                    }
                                    fullWidth
                                    required
                                />
                                <TextField
                                    label="Fax No"
                                    value={personInchargeFaxNo}
                                    onChange={(event) =>
                                        setPersonInchargeFaxNo(event.target.value)
                                    }
                                    fullWidth
                                />

                            </Box>

                        </Box>
                    </Box>
                    {/*Column-02*/}
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            flex: "1 1 330px",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                                flex: "1 1 330px",
                            }}
                        >
                            <Box
                                component={Paper}
                                sx={{
                                    flex: 1,
                                    py: 2,
                                    px: 2,
                                    gap: 1.5,
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                <Box
                                    sx={{
                                        py: 0.5,
                                        px: 2,
                                        display: "flex",
                                        flexDirection: "column",
                                        backgroundColor: "#3B6E91",
                                        color: "white",
                                        borderRadius: 1,
                                    }}
                                >
                                    <Typography variant="subtitle2">
                                        Accounting details
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,

                                    }}>
                                    <TextField
                                        label="Name"
                                        value={AccountingDetailsName}
                                        onChange={(event) =>
                                            setAccountingDetailsName(event.target.value)
                                        }
                                        fullWidth
                                        required
                                    />
                                    <TextField
                                        label="Email"
                                        value={AccountingDetailsEmail}
                                        onChange={(event) =>
                                            setAccountingDetailsEmail(event.target.value)
                                        }
                                        fullWidth
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,

                                    }}>
                                    <TextField
                                        label="phone"
                                        value={personInchargePhone}
                                        onChange={(event) =>
                                            setPersonInchargePhone(event.target.value)
                                        }
                                        fullWidth
                                        required
                                    />
                                    <TextField
                                        label="Fax No"
                                        value={personInchargeFaxNo}
                                        onChange={(event) =>
                                            setPersonInchargeFaxNo(event.target.value)
                                        }
                                        fullWidth
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,

                                    }}>
                                    <TextField
                                        label="Country"
                                        value={AccountingDetailsCountry}
                                        onChange={(event) =>
                                            setAccountingDetailsCountry(event.target.value)
                                        }
                                        fullWidth
                                    />
                                    <TextField
                                        label="Credit Limit"
                                        value={AccountingDetailsCreditLimit}
                                        onChange={(event) =>
                                            setAccountingDetailsCreditLimit(event.target.value)
                                        }
                                        fullWidth
                                        required
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,
                                        alignItems: "center",
                                    }}>
                                    <TextField
                                        size="small"
                                        label="Payment Terms"
                                        value={AccountingDetailsPaymentTerms}
                                        onChange={(event) =>
                                            setAccountingDetailsPaymentTerms(event.target.value)
                                        }
                                        fullWidth
                                        required
                                    />
                                    <TextField
                                        size="small"
                                        label="Currency"
                                        value={AccountingDetailsCurrency}
                                        onChange={(event) =>
                                            setAccountingDetailsCurrency(event.target.value)
                                        }
                                        fullWidth
                                        required
                                    />
                                </Box>
                                <TextField
                                    label="Billing Address"
                                    value={AccountingDetailsBillingAddress}
                                    onChange={(event) =>
                                        setAccountingDetailsBillingAddress(event.target.value)
                                    }
                                    fullWidth
                                    multiline
                                    rows={2}

                                />
                                <TextField
                                    label="Special Instructions "
                                    value={AccountingDetailsSpecialInstructions}
                                    onChange={(event) =>
                                        setAccountingDetailsSpecialInstructions(event.target.value)
                                    }
                                    fullWidth
                                    multiline
                                    rows={2}
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            size="small"
                                            checked={AccountingDetailsUseBillingCurrency === "true"}
                                            onChange={(event) =>
                                                setAccountingDetailsUseBillingCurrency(
                                                    event.target.checked ? "true" : "false"
                                                )
                                            }
                                        />
                                    }
                                    label="Use billing currency"
                                    sx={{ whiteSpace: "nowrap" }}
                                />
                                {/* Multiple Email */}
                                <Box
                                    component={Paper}
                                    sx={{
                                        flex: 1,
                                        py: 2,
                                        px: 2,
                                        gap: 1.5,
                                        display: "flex",
                                        flexDirection: "column",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            py: 0.5,
                                            px: 2,
                                            display: "flex",
                                            alignItems: "center",
                                            backgroundColor: "#3B6E91",
                                            color: "white",
                                            borderRadius: 1,
                                        }}>
                                        <Typography variant="subtitle2">
                                            Multiple Email
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            gap: 1,

                                        }}>
                                        <TextField
                                            label="Email"
                                            value={multipleEmail}
                                            onChange={(event) =>
                                                setMultipleEmail(event.target.value)
                                            }
                                            fullWidth
                                        />
                                    </Box>

                                </Box>


                            </Box>



                        </Box>

                    </Box>
                    {/*column-03*/}
                    <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        flex: "1 1 330px",
                    }}>
                        <Box
                            sx={{
                                display: "flex",
                                gap: 2,
                                flexDirection: "column",
                            }}
                        >
                            {/* Key account manager */}
                            <Box
                                component={Paper}
                                sx={{
                                    flex: 1,
                                    py: 2,
                                    px: 2,
                                    gap: 1.5,
                                    display: "flex",
                                    flexDirection: "column",
                                }}>
                                <Box
                                    sx={{
                                        py: 0.5,
                                        px: 2,
                                        display: "flex",
                                        alignItems: "center",
                                        backgroundColor: "#3B6E91",
                                        color: "white",
                                        borderRadius: 1,
                                    }}>
                                    <Typography variant="subtitle2">
                                        Key account manager
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,

                                    }}>
                                    <TextField
                                        label="Opp Manager"
                                        value={oppManager}
                                        onChange={(event) =>
                                            setOppManager(event.target.value)
                                        }
                                        fullWidth
                                        required
                                    />
                                </Box>

                            </Box>
                            {/* Bank detail */}
                            <Box
                                component={Paper}
                                sx={{
                                    flex: 1,
                                    py: 2,
                                    px: 2,
                                    gap: 1.5,
                                    display: "flex",
                                    flexDirection: "column",
                                }}>
                                <Box
                                    sx={{
                                        py: 0.5,
                                        px: 2,
                                        display: "flex",
                                        alignItems: "center",
                                        backgroundColor: "#3B6E91",
                                        color: "white",
                                        borderRadius: 1,
                                    }}>
                                    <Typography variant="subtitle2">
                                        Bank detail
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,

                                    }}>
                                    <TextField
                                        label="Bank Details"
                                        value={bankDetails}
                                        onChange={(event) =>
                                            setBankDetails(event.target.value)
                                        }
                                        fullWidth
                                        required
                                    />
                                </Box>

                            </Box>
                            {/* Client hubs */}
                            <Box
                                component={Paper}
                                sx={{
                                    flex: 1,
                                    py: 2,
                                    px: 2,
                                    gap: 1.5,
                                    display: "flex",
                                    flexDirection: "column",
                                }}>
                                <Box
                                    sx={{
                                        py: 0.5,
                                        px: 2,
                                        display: "flex",
                                        alignItems: "center",
                                        backgroundColor: "#3B6E91",
                                        color: "white",
                                        borderRadius: 1,
                                    }}>
                                    <Typography variant="subtitle2">
                                        Client hubs
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,

                                    }}>
                                    <TextField
                                        label="Client Hubs"
                                        value={clientHubs}
                                        onChange={(event) =>
                                            setClientHubs(event.target.value)
                                        }
                                        fullWidth
                                        required
                                    />
                                </Box>

                            </Box>
                        </Box>

                    </Box>

                </Box>
            )}
            {/*Hub Form*/}
            {
                groupId === "Hub" && (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            gap: 3,
                            flexWrap: "wrap",
                        }}>
                        {/*Column-01*/}
                        {/*Contact Details*/}
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                                flex: "1 1 330px",
                            }}
                        >
                            <Box
                                component={Paper}
                                sx={{
                                    flex: 1,
                                    py: 2,
                                    px: 2,
                                    gap: 1,
                                    display: "flex",
                                    flexDirection: "column",
                                }}>
                                <TextField
                                    label="Company Name"
                                    value={companyName}
                                    onChange={(event) =>
                                        setCompanyName(event.target.value)
                                    }
                                    fullWidth
                                    required
                                />
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,
                                    }}>
                                    <TextField
                                        label="Station Code"
                                        type="text"
                                        value={stationCode}
                                        onChange={(event) =>
                                            setStationCode(event.target.value)
                                        }
                                        required
                                        sx={{
                                            flex: 1,
                                        }}
                                    />
                                    <TextField
                                        label="Email"
                                        type="email"
                                        value={email}
                                        onChange={(event) =>
                                            setEmail(event.target.value)
                                        }
                                        required
                                        sx={{
                                            flex: 1,
                                        }}
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,
                                    }}>
                                    <TextField
                                        label="Phone"
                                        type="tel"
                                        value={phone}
                                        onChange={(event) =>
                                            setPhone(event.target.value)
                                        }
                                        fullWidth
                                        required
                                    />
                                    <TextField
                                        label="Fax No"
                                        type="fax_no"
                                        value={faxNo}
                                        onChange={(event) =>
                                            setFaxNo(event.target.value)
                                        }
                                        fullWidth
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,
                                    }}>
                                    <TextField
                                        label="EORI / UISE No."
                                        value={eoriUiseNo}
                                        onChange={(event) =>
                                            setEoriUiseNo(event.target.value)
                                        }
                                        fullWidth
                                    />
                                    <TextField
                                        label="Country"
                                        value={country}
                                        onChange={(event) =>
                                            setCountry(event.target.value)
                                        }
                                        fullWidth
                                        required
                                    />
                                    <TextField
                                        label="City"
                                        value={city}
                                        onChange={(event) =>
                                            setCity(event.target.value)
                                        }
                                        fullWidth
                                        required
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,
                                    }}>
                                    <TextField
                                        label="Notify Party"
                                        value={notifyParty}
                                        onChange={(event) =>
                                            setNotifyParty(event.target.value)
                                        }
                                        fullWidth
                                        required
                                        multiline
                                        rows={1}
                                    />
                                </Box>
                                <TextField
                                    label="Address"
                                    value={address}
                                    onChange={(event) =>
                                        setAddress(event.target.value)
                                    }
                                    fullWidth
                                    required
                                    multiline
                                    rows={3}
                                />
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,
                                    }}>
                                    <TextField
                                        label="Postal Code"
                                        type="postal_code"
                                        value={postalCode}
                                        onChange={(event) =>
                                            setPostalCode(event.target.value)
                                        }
                                        fullWidth
                                    />
                                    <TextField
                                        label="Vat No"
                                        value={vatNo}
                                        onChange={(event) =>
                                            setVatNo(event.target.value)
                                        }
                                        fullWidth
                                    />
                                </Box>
                                <Button
                                    component="label"
                                    role={undefined}
                                    variant="contained"
                                    tabIndex={-1}
                                    startIcon={<CloudUploadIcon />}
                                    accept="image/jpeg,image/png,application/pdf"
                                >
                                    Upload files
                                    <VisuallyHiddenInput
                                        type="file"
                                        onChange={(event) => setUploadedFile(event.target.files?.[0] ?? null)}
                                        multiple
                                    />
                                </Button>

                                {/*Person in charge*/}
                                <Box
                                    sx={{
                                        py: 0.5,
                                        px: 2,
                                        display: "flex",
                                        alignItems: "center",
                                        backgroundColor: "#3B6E91",
                                        color: "white",
                                        borderRadius: 1,
                                        marginTop: 2,
                                    }}>
                                    <Typography variant="subtitle2">
                                        Person in charge
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,

                                    }}>
                                    <TextField
                                        label="Name"
                                        value={personInchargeName}
                                        onChange={(event) =>
                                            setPersonInchargeName(event.target.value)
                                        }
                                        fullWidth
                                        required
                                    />
                                    <TextField
                                        label="Email"
                                        value={personInchargeEmail}
                                        onChange={(event) =>
                                            setPersonInchargeEmail(event.target.value)
                                        }
                                        fullWidth
                                        required
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,

                                    }}>
                                    <TextField
                                        label="phone"
                                        value={personInchargePhone}
                                        onChange={(event) =>
                                            setPersonInchargePhone(event.target.value)
                                        }
                                        fullWidth
                                        required
                                    />
                                    <TextField
                                        label="Fax No"
                                        value={personInchargeFaxNo}
                                        onChange={(event) =>
                                            setPersonInchargeFaxNo(event.target.value)
                                        }
                                        fullWidth
                                    />

                                </Box>


                            </Box>
                        </Box>
                        {/*Column-02*/}
                        {/* Accounting Details*/}
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                                flex: "1 1 330px",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 2,
                                    flex: "1 1 330px",
                                }}
                            >
                                <Box
                                    component={Paper}
                                    sx={{
                                        flex: 1,
                                        py: 2,
                                        px: 2,
                                        gap: 1.5,
                                        display: "flex",
                                        flexDirection: "column",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            py: 0.5,
                                            px: 2,
                                            display: "flex",
                                            flexDirection: "column",
                                            backgroundColor: "#3B6E91",
                                            color: "white",
                                            borderRadius: 1,
                                        }}
                                    >
                                        <Typography variant="subtitle2">
                                            Accounting details
                                        </Typography>
                                    </Box>

                                    <Box
                                        sx={{
                                            display: "flex",
                                            gap: 1,

                                        }}>
                                        <TextField
                                            label="Name"
                                            value={AccountingDetailsName}
                                            onChange={(event) =>
                                                setAccountingDetailsName(event.target.value)
                                            }
                                            fullWidth
                                            required
                                        />
                                        <TextField
                                            label="Email"
                                            value={AccountingDetailsEmail}
                                            onChange={(event) =>
                                                setAccountingDetailsEmail(event.target.value)
                                            }
                                            fullWidth
                                            required
                                        />
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            gap: 1,

                                        }}>
                                        <TextField
                                            label="phone"
                                            value={personInchargePhone}
                                            onChange={(event) =>
                                                setPersonInchargePhone(event.target.value)
                                            }
                                            fullWidth
                                            required
                                        />
                                        <TextField
                                            label="Fax No"
                                            value={personInchargeFaxNo}
                                            onChange={(event) =>
                                                setPersonInchargeFaxNo(event.target.value)
                                            }
                                            fullWidth
                                        />
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            gap: 1,

                                        }}>
                                        <TextField
                                            label="Country"
                                            value={AccountingDetailsCountry}
                                            onChange={(event) =>
                                                setAccountingDetailsCountry(event.target.value)
                                            }
                                            fullWidth
                                        />
                                        <TextField
                                            label="Payment Terms"
                                            value={AccountingDetailsPaymentTerms}
                                            onChange={(event) =>
                                                setAccountingDetailsPaymentTerms(event.target.value)
                                            }
                                            fullWidth
                                            required
                                        />
                                    </Box>
                                    <Box sx={{
                                        display: "flex",
                                        gap: 1,
                                        alignItems: "center",
                                    }}>
                                        <TextField
                                            size="small"
                                            label="Currency"
                                            value={AccountingDetailsCurrency}
                                            onChange={(event) =>
                                                setAccountingDetailsCurrency(event.target.value)
                                            }
                                            fullWidth
                                            required
                                        />
                                    </Box>
                                    <TextField
                                        label="Billing Address"
                                        value={AccountingDetailsBillingAddress}
                                        onChange={(event) =>
                                            setAccountingDetailsBillingAddress(event.target.value)
                                        }
                                        fullWidth
                                        multiline
                                        rows={2}

                                    />
                                    <TextField
                                        label="Special Instructions "
                                        value={AccountingDetailsSpecialInstructions}
                                        onChange={(event) =>
                                            setAccountingDetailsSpecialInstructions(event.target.value)
                                        }
                                        fullWidth
                                        multiline
                                        rows={2}
                                    />
                                    {/* Multiple Email */}
                                    <Box
                                        component={Paper}
                                        sx={{
                                            flex: 1,
                                            py: 2,
                                            px: 2,
                                            gap: 1.5,
                                            display: "flex",
                                            flexDirection: "column",
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                py: 0.5,
                                                px: 2,
                                                display: "flex",
                                                alignItems: "center",
                                                backgroundColor: "#3B6E91",
                                                color: "white",
                                                borderRadius: 1,
                                            }}>
                                            <Typography variant="subtitle2">
                                                Multiple Email
                                            </Typography>
                                        </Box>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                gap: 1,

                                            }}>
                                            <TextField
                                                label="Email"
                                                value={multipleEmail}
                                                onChange={(event) =>
                                                    setMultipleEmail(event.target.value)
                                                }
                                                fullWidth
                                            />
                                        </Box>

                                    </Box>


                                </Box>



                            </Box>

                        </Box>
                        {/*column-03*/}
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                                flex: "1 1 330px",
                            }}
                        >

                        </Box>
                    </Box>
                )
            }
            {/*TTS Agent Form*/}
            {
                groupId === "TTS Agent" && (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            gap: 3,
                            flexWrap: "wrap",
                        }}>
                        {/*Column-01*/}
                        {/*Contact Details*/}
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                                flex: "1 1 330px",
                            }}
                        >
                            <Box
                                component={Paper}
                                sx={{
                                    flex: 1,
                                    py: 2,
                                    px: 2,
                                    gap: 1,
                                    display: "flex",
                                    flexDirection: "column",
                                }}>
                                <TextField
                                    label="Company Name"
                                    value={companyName}
                                    onChange={(event) =>
                                        setCompanyName(event.target.value)
                                    }
                                    fullWidth
                                    required
                                />
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,
                                    }}>
                                    <TextField
                                        label="Station Code"
                                        type="text"
                                        value={stationCode}
                                        onChange={(event) =>
                                            setStationCode(event.target.value)
                                        }
                                        required
                                        sx={{
                                            flex: 1,
                                        }}
                                    />
                                    <TextField
                                        label="Email"
                                        type="email"
                                        value={email}
                                        onChange={(event) =>
                                            setEmail(event.target.value)
                                        }
                                        required
                                        sx={{
                                            flex: 1,
                                        }}
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,
                                    }}>
                                    <TextField
                                        label="Phone"
                                        type="tel"
                                        value={phone}
                                        onChange={(event) =>
                                            setPhone(event.target.value)
                                        }
                                        fullWidth
                                        required
                                    />
                                    <TextField
                                        label="Fax No"
                                        type="fax_no"
                                        value={faxNo}
                                        onChange={(event) =>
                                            setFaxNo(event.target.value)
                                        }
                                        fullWidth
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,
                                    }}>
                                    <TextField
                                        label="EORI / UISE No."
                                        value={eoriUiseNo}
                                        onChange={(event) =>
                                            setEoriUiseNo(event.target.value)
                                        }
                                        fullWidth
                                    />
                                    <TextField
                                        label="Country"
                                        value={country}
                                        onChange={(event) =>
                                            setCountry(event.target.value)
                                        }
                                        fullWidth
                                        required
                                    />
                                    <TextField
                                        label="City"
                                        value={city}
                                        onChange={(event) =>
                                            setCity(event.target.value)
                                        }
                                        fullWidth
                                        required
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,
                                    }}>
                                    <TextField
                                        label="Notify Party"
                                        value={notifyParty}
                                        onChange={(event) =>
                                            setNotifyParty(event.target.value)
                                        }
                                        fullWidth
                                        required
                                        multiline
                                        rows={1}
                                    />
                                    <TextField
                                        label="Airport Code"
                                        value={airportCode}
                                        onChange={(event) =>
                                            setAirportCode(event.target.value)
                                        }
                                        fullWidth
                                        required
                                    />
                                </Box>
                                <TextField
                                    label="Address"
                                    value={address}
                                    onChange={(event) =>
                                        setAddress(event.target.value)
                                    }
                                    fullWidth
                                    required
                                    multiline
                                    rows={3}
                                />
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,
                                    }}>
                                    <TextField
                                        label="Postal Code"
                                        type="postal_code"
                                        value={postalCode}
                                        onChange={(event) =>
                                            setPostalCode(event.target.value)
                                        }
                                        fullWidth
                                    />
                                    <TextField
                                        label="Vat No"
                                        value={vatNo}
                                        onChange={(event) =>
                                            setVatNo(event.target.value)
                                        }
                                        fullWidth
                                    />
                                </Box>
                                <Button
                                    component="label"
                                    role={undefined}
                                    variant="contained"
                                    tabIndex={-1}
                                    startIcon={<CloudUploadIcon />}
                                    accept="image/jpeg,image/png,application/pdf"
                                >
                                    Upload files
                                    <VisuallyHiddenInput
                                        type="file"
                                        onChange={(event) => setUploadedFile(event.target.files?.[0] ?? null)}
                                        multiple
                                    />
                                </Button>

                                {/*Person in charge*/}
                                <Box
                                    sx={{
                                        py: 0.5,
                                        px: 2,
                                        display: "flex",
                                        alignItems: "center",
                                        backgroundColor: "#3B6E91",
                                        color: "white",
                                        borderRadius: 1,
                                        marginTop: 2,
                                    }}>
                                    <Typography variant="subtitle2">
                                        Person in charge
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,

                                    }}>
                                    <TextField
                                        label="Name"
                                        value={personInchargeName}
                                        onChange={(event) =>
                                            setPersonInchargeName(event.target.value)
                                        }
                                        fullWidth
                                        required
                                    />
                                    <TextField
                                        label="Email"
                                        value={personInchargeEmail}
                                        onChange={(event) =>
                                            setPersonInchargeEmail(event.target.value)
                                        }
                                        fullWidth
                                        required
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,

                                    }}>
                                    <TextField
                                        label="phone"
                                        value={personInchargePhone}
                                        onChange={(event) =>
                                            setPersonInchargePhone(event.target.value)
                                        }
                                        fullWidth
                                        required
                                    />
                                    <TextField
                                        label="Fax No"
                                        value={personInchargeFaxNo}
                                        onChange={(event) =>
                                            setPersonInchargeFaxNo(event.target.value)
                                        }
                                        fullWidth
                                    />

                                </Box>


                            </Box>
                        </Box>
                        {/*Column-02*/}
                        {/* Accounting Details*/}
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                                flex: "1 1 330px",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 2,
                                    flex: "1 1 330px",
                                }}
                            >
                                <Box
                                    component={Paper}
                                    sx={{
                                        flex: 1,
                                        py: 2,
                                        px: 2,
                                        gap: 1.5,
                                        display: "flex",
                                        flexDirection: "column",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            py: 0.5,
                                            px: 2,
                                            display: "flex",
                                            flexDirection: "column",
                                            backgroundColor: "#3B6E91",
                                            color: "white",
                                            borderRadius: 1,
                                        }}
                                    >
                                        <Typography variant="subtitle2">
                                            Accounting details
                                        </Typography>
                                    </Box>

                                    <Box
                                        sx={{
                                            display: "flex",
                                            gap: 1,

                                        }}>
                                        <TextField
                                            label="Name"
                                            value={AccountingDetailsName}
                                            onChange={(event) =>
                                                setAccountingDetailsName(event.target.value)
                                            }
                                            fullWidth
                                            required
                                        />
                                        <TextField
                                            label="Email"
                                            value={AccountingDetailsEmail}
                                            onChange={(event) =>
                                                setAccountingDetailsEmail(event.target.value)
                                            }
                                            fullWidth
                                            required
                                        />
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            gap: 1,

                                        }}>
                                        <TextField
                                            label="phone"
                                            value={personInchargePhone}
                                            onChange={(event) =>
                                                setPersonInchargePhone(event.target.value)
                                            }
                                            fullWidth
                                            required
                                        />
                                        <TextField
                                            label="Fax No"
                                            value={personInchargeFaxNo}
                                            onChange={(event) =>
                                                setPersonInchargeFaxNo(event.target.value)
                                            }
                                            fullWidth
                                        />
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            gap: 1,

                                        }}>
                                        <TextField
                                            label="Country"
                                            value={AccountingDetailsCountry}
                                            onChange={(event) =>
                                                setAccountingDetailsCountry(event.target.value)
                                            }
                                            fullWidth
                                        />
                                        <TextField
                                            label="Payment Terms"
                                            value={AccountingDetailsPaymentTerms}
                                            onChange={(event) =>
                                                setAccountingDetailsPaymentTerms(event.target.value)
                                            }
                                            fullWidth
                                            required
                                        />
                                    </Box>
                                    <Box sx={{
                                        display: "flex",
                                        gap: 1,
                                        alignItems: "center",
                                    }}>
                                        <TextField
                                            size="small"
                                            label="Currency"
                                            value={AccountingDetailsCurrency}
                                            onChange={(event) =>
                                                setAccountingDetailsCurrency(event.target.value)
                                            }
                                            fullWidth
                                            required
                                        />
                                    </Box>
                                    <TextField
                                        label="Billing Address"
                                        value={AccountingDetailsBillingAddress}
                                        onChange={(event) =>
                                            setAccountingDetailsBillingAddress(event.target.value)
                                        }
                                        fullWidth
                                        multiline
                                        rows={2}

                                    />
                                    <TextField
                                        label="Special Instructions "
                                        value={AccountingDetailsSpecialInstructions}
                                        onChange={(event) =>
                                            setAccountingDetailsSpecialInstructions(event.target.value)
                                        }
                                        fullWidth
                                        multiline
                                        rows={2}
                                    />
                                    {/* Multiple Email */}
                                    <Box
                                        component={Paper}
                                        sx={{
                                            flex: 1,
                                            py: 2,
                                            px: 2,
                                            gap: 1.5,
                                            display: "flex",
                                            flexDirection: "column",
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                py: 0.5,
                                                px: 2,
                                                display: "flex",
                                                alignItems: "center",
                                                backgroundColor: "#3B6E91",
                                                color: "white",
                                                borderRadius: 1,
                                            }}>
                                            <Typography variant="subtitle2">
                                                Multiple Email
                                            </Typography>
                                        </Box>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                gap: 1,

                                            }}>
                                            <TextField
                                                label="Email"
                                                value={multipleEmail}
                                                onChange={(event) =>
                                                    setMultipleEmail(event.target.value)
                                                }
                                                fullWidth
                                            />
                                        </Box>

                                    </Box>


                                </Box>



                            </Box>

                        </Box>
                        {/*column-03*/}
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                                flex: "1 1 330px",
                            }}
                        >

                        </Box>
                    </Box>
                )
            }
            {/*Sub Agent Form*/}
            {
                groupId === "Sub Agent" && (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            gap: 3,
                            flexWrap: "wrap",
                        }}>
                        {/*Column-01*/}
                        {/*Contact Details*/}
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                                flex: "1 1 330px",
                            }}
                        >
                            <Box
                                component={Paper}
                                sx={{
                                    flex: 1,
                                    py: 2,
                                    px: 2,
                                    gap: 1,
                                    display: "flex",
                                    flexDirection: "column",
                                }}>
                                <TextField
                                    label="Company Name"
                                    value={companyName}
                                    onChange={(event) =>
                                        setCompanyName(event.target.value)
                                    }
                                    fullWidth
                                    required
                                />
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,
                                    }}>
                                    <TextField
                                        label="Station Code"
                                        type="text"
                                        value={stationCode}
                                        onChange={(event) =>
                                            setStationCode(event.target.value)
                                        }
                                        required
                                        sx={{
                                            flex: 1,
                                        }}
                                    />
                                    <TextField
                                        label="Email"
                                        type="email"
                                        value={email}
                                        onChange={(event) =>
                                            setEmail(event.target.value)
                                        }
                                        required
                                        sx={{
                                            flex: 1,
                                        }}
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,
                                    }}>
                                    <TextField
                                        label="Phone"
                                        type="tel"
                                        value={phone}
                                        onChange={(event) =>
                                            setPhone(event.target.value)
                                        }
                                        fullWidth
                                        required
                                    />
                                    <TextField
                                        label="Fax No"
                                        type="fax_no"
                                        value={faxNo}
                                        onChange={(event) =>
                                            setFaxNo(event.target.value)
                                        }
                                        fullWidth
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,
                                    }}>
                                    <TextField
                                        label="EORI / UISE No."
                                        value={eoriUiseNo}
                                        onChange={(event) =>
                                            setEoriUiseNo(event.target.value)
                                        }
                                        fullWidth
                                    />
                                    <TextField
                                        label="Country"
                                        value={country}
                                        onChange={(event) =>
                                            setCountry(event.target.value)
                                        }
                                        fullWidth
                                        required
                                    />
                                    <TextField
                                        label="City"
                                        value={city}
                                        onChange={(event) =>
                                            setCity(event.target.value)
                                        }
                                        fullWidth
                                        required
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,
                                    }}>
                                    <TextField
                                        label="Notify Party"
                                        value={notifyParty}
                                        onChange={(event) =>
                                            setNotifyParty(event.target.value)
                                        }
                                        fullWidth
                                        required
                                        multiline
                                        rows={1}
                                    />
                                    <TextField
                                        label="Airport Code"
                                        value={airportCode}
                                        onChange={(event) =>
                                            setAirportCode(event.target.value)
                                        }
                                        fullWidth
                                        required
                                    />
                                </Box>
                                <TextField
                                    label="Address"
                                    value={address}
                                    onChange={(event) =>
                                        setAddress(event.target.value)
                                    }
                                    fullWidth
                                    required
                                    multiline
                                    rows={3}
                                />
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,
                                    }}>
                                    <TextField
                                        label="Postal Code"
                                        type="postal_code"
                                        value={postalCode}
                                        onChange={(event) =>
                                            setPostalCode(event.target.value)
                                        }
                                        fullWidth
                                    />
                                    <TextField
                                        label="Vat No"
                                        value={vatNo}
                                        onChange={(event) =>
                                            setVatNo(event.target.value)
                                        }
                                        fullWidth
                                    />
                                </Box>

                                {/*Person in charge*/}
                                <Box
                                    sx={{
                                        py: 0.5,
                                        px: 2,
                                        display: "flex",
                                        alignItems: "center",
                                        backgroundColor: "#3B6E91",
                                        color: "white",
                                        borderRadius: 1,
                                        marginTop: 2,
                                    }}>
                                    <Typography variant="subtitle2">
                                        Person in charge
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,

                                    }}>
                                    <TextField
                                        label="Name"
                                        value={personInchargeName}
                                        onChange={(event) =>
                                            setPersonInchargeName(event.target.value)
                                        }
                                        fullWidth
                                        required
                                    />
                                    <TextField
                                        label="Email"
                                        value={personInchargeEmail}
                                        onChange={(event) =>
                                            setPersonInchargeEmail(event.target.value)
                                        }
                                        fullWidth
                                        required
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,

                                    }}>
                                    <TextField
                                        label="phone"
                                        value={personInchargePhone}
                                        onChange={(event) =>
                                            setPersonInchargePhone(event.target.value)
                                        }
                                        fullWidth
                                        required
                                    />
                                    <TextField
                                        label="Fax No"
                                        value={personInchargeFaxNo}
                                        onChange={(event) =>
                                            setPersonInchargeFaxNo(event.target.value)
                                        }
                                        fullWidth
                                    />

                                </Box>


                            </Box>
                        </Box>
                        {/*Column-02*/}
                        {/* Accounting Details*/}
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                                flex: "1 1 330px",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 2,
                                    flex: "1 1 330px",
                                }}
                            >
                                <Box
                                    component={Paper}
                                    sx={{
                                        flex: 1,
                                        py: 2,
                                        px: 2,
                                        gap: 1.5,
                                        display: "flex",
                                        flexDirection: "column",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            py: 0.5,
                                            px: 2,
                                            display: "flex",
                                            flexDirection: "column",
                                            backgroundColor: "#3B6E91",
                                            color: "white",
                                            borderRadius: 1,
                                        }}
                                    >
                                        <Typography variant="subtitle2">
                                            Accounting details
                                        </Typography>
                                    </Box>

                                    <Box
                                        sx={{
                                            display: "flex",
                                            gap: 1,

                                        }}>
                                        <TextField
                                            label="Name"
                                            value={AccountingDetailsName}
                                            onChange={(event) =>
                                                setAccountingDetailsName(event.target.value)
                                            }
                                            fullWidth
                                            required
                                        />
                                        <TextField
                                            label="Email"
                                            value={AccountingDetailsEmail}
                                            onChange={(event) =>
                                                setAccountingDetailsEmail(event.target.value)
                                            }
                                            fullWidth
                                            required
                                        />
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            gap: 1,

                                        }}>
                                        <TextField
                                            label="phone"
                                            value={personInchargePhone}
                                            onChange={(event) =>
                                                setPersonInchargePhone(event.target.value)
                                            }
                                            fullWidth
                                            required
                                        />
                                        <TextField
                                            label="Fax No"
                                            value={personInchargeFaxNo}
                                            onChange={(event) =>
                                                setPersonInchargeFaxNo(event.target.value)
                                            }
                                            fullWidth
                                        />
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            gap: 1,

                                        }}>
                                        <TextField
                                            label="Country"
                                            value={AccountingDetailsCountry}
                                            onChange={(event) =>
                                                setAccountingDetailsCountry(event.target.value)
                                            }
                                            fullWidth
                                        />
                                        <TextField
                                            label="Payment Terms"
                                            value={AccountingDetailsPaymentTerms}
                                            onChange={(event) =>
                                                setAccountingDetailsPaymentTerms(event.target.value)
                                            }
                                            fullWidth
                                            required
                                        />
                                    </Box>
                                    <Box sx={{
                                        display: "flex",
                                        gap: 1,
                                        alignItems: "center",
                                    }}>
                                        <TextField
                                            size="small"
                                            label="Currency"
                                            value={AccountingDetailsCurrency}
                                            onChange={(event) =>
                                                setAccountingDetailsCurrency(event.target.value)
                                            }
                                            fullWidth
                                            required
                                        />
                                    </Box>
                                    <TextField
                                        label="Billing Address"
                                        value={AccountingDetailsBillingAddress}
                                        onChange={(event) =>
                                            setAccountingDetailsBillingAddress(event.target.value)
                                        }
                                        fullWidth
                                        multiline
                                        rows={2}

                                    />
                                    <TextField
                                        label="Special Instructions "
                                        value={AccountingDetailsSpecialInstructions}
                                        onChange={(event) =>
                                            setAccountingDetailsSpecialInstructions(event.target.value)
                                        }
                                        fullWidth
                                        multiline
                                        rows={2}
                                    />
                                    {/* Multiple Email */}
                                    <Box
                                        component={Paper}
                                        sx={{
                                            flex: 1,
                                            py: 2,
                                            px: 2,
                                            gap: 1.5,
                                            display: "flex",
                                            flexDirection: "column",
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                py: 0.5,
                                                px: 2,
                                                display: "flex",
                                                alignItems: "center",
                                                backgroundColor: "#3B6E91",
                                                color: "white",
                                                borderRadius: 1,
                                            }}>
                                            <Typography variant="subtitle2">
                                                Multiple Email
                                            </Typography>
                                        </Box>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                gap: 1,

                                            }}>
                                            <TextField
                                                label="Email"
                                                value={multipleEmail}
                                                onChange={(event) =>
                                                    setMultipleEmail(event.target.value)
                                                }
                                                fullWidth
                                            />
                                        </Box>

                                    </Box>


                                </Box>



                            </Box>

                        </Box>
                        {/*column-03*/}
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                                flex: "1 1 330px",
                            }}
                        >

                        </Box>
                    </Box>
                )
            }
            {/*Sub Agent Onboard Form*/}
            {
                groupId === "Sub Agent Onboard" && (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            gap: 3,
                            flexWrap: "wrap",
                        }}>
                        {/*Column-01*/}
                        {/*Contact Details*/}
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                                flex: "1 1 330px",
                            }}
                        >
                            <Box
                                component={Paper}
                                sx={{
                                    flex: 1,
                                    py: 2,
                                    px: 2,
                                    gap: 1,
                                    display: "flex",
                                    flexDirection: "column",
                                }}>
                                <TextField
                                    label="Company Name"
                                    value={companyName}
                                    onChange={(event) =>
                                        setCompanyName(event.target.value)
                                    }
                                    fullWidth
                                    required
                                />
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,
                                    }}>
                                    <TextField
                                        label="Station Code"
                                        type="text"
                                        value={stationCode}
                                        onChange={(event) =>
                                            setStationCode(event.target.value)
                                        }
                                        required
                                        sx={{
                                            flex: 1,
                                        }}
                                    />
                                    <TextField
                                        label="Email"
                                        type="email"
                                        value={email}
                                        onChange={(event) =>
                                            setEmail(event.target.value)
                                        }
                                        required
                                        sx={{
                                            flex: 1,
                                        }}
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,
                                    }}>
                                    <TextField
                                        label="Phone"
                                        type="tel"
                                        value={phone}
                                        onChange={(event) =>
                                            setPhone(event.target.value)
                                        }
                                        fullWidth
                                        required
                                    />
                                    <TextField
                                        label="Fax No"
                                        type="fax_no"
                                        value={faxNo}
                                        onChange={(event) =>
                                            setFaxNo(event.target.value)
                                        }
                                        fullWidth
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,
                                    }}>
                                    <TextField
                                        label="EORI / UISE No."
                                        value={eoriUiseNo}
                                        onChange={(event) =>
                                            setEoriUiseNo(event.target.value)
                                        }
                                        fullWidth
                                    />
                                    <TextField
                                        label="Country"
                                        value={country}
                                        onChange={(event) =>
                                            setCountry(event.target.value)
                                        }
                                        fullWidth
                                        required
                                    />
                                    <TextField
                                        label="City"
                                        value={city}
                                        onChange={(event) =>
                                            setCity(event.target.value)
                                        }
                                        fullWidth
                                        required
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,
                                    }}>
                                    <TextField
                                        label="Notify Party"
                                        value={notifyParty}
                                        onChange={(event) =>
                                            setNotifyParty(event.target.value)
                                        }
                                        fullWidth
                                        required
                                        multiline
                                        rows={1}
                                    />
                                    <TextField
                                        label="Airport Code"
                                        value={airportCode}
                                        onChange={(event) =>
                                            setAirportCode(event.target.value)
                                        }
                                        fullWidth
                                        required
                                    />
                                </Box>
                                <TextField
                                    label="Address"
                                    value={address}
                                    onChange={(event) =>
                                        setAddress(event.target.value)
                                    }
                                    fullWidth
                                    required
                                    multiline
                                    rows={3}
                                />
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,
                                    }}>
                                    <TextField
                                        label="Postal Code"
                                        type="postal_code"
                                        value={postalCode}
                                        onChange={(event) =>
                                            setPostalCode(event.target.value)
                                        }
                                        fullWidth
                                    />
                                    <TextField
                                        label="Vat No"
                                        value={vatNo}
                                        onChange={(event) =>
                                            setVatNo(event.target.value)
                                        }
                                        fullWidth
                                    />
                                </Box>

                                {/*Person in charge*/}
                                <Box
                                    sx={{
                                        py: 0.5,
                                        px: 2,
                                        display: "flex",
                                        alignItems: "center",
                                        backgroundColor: "#3B6E91",
                                        color: "white",
                                        borderRadius: 1,
                                        marginTop: 2,
                                    }}>
                                    <Typography variant="subtitle2">
                                        Person in charge
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,

                                    }}>
                                    <TextField
                                        label="Name"
                                        value={personInchargeName}
                                        onChange={(event) =>
                                            setPersonInchargeName(event.target.value)
                                        }
                                        fullWidth
                                        required
                                    />
                                    <TextField
                                        label="Email"
                                        value={personInchargeEmail}
                                        onChange={(event) =>
                                            setPersonInchargeEmail(event.target.value)
                                        }
                                        fullWidth
                                        required
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,

                                    }}>
                                    <TextField
                                        label="phone"
                                        value={personInchargePhone}
                                        onChange={(event) =>
                                            setPersonInchargePhone(event.target.value)
                                        }
                                        fullWidth
                                        required
                                    />
                                    <TextField
                                        label="Fax No"
                                        value={personInchargeFaxNo}
                                        onChange={(event) =>
                                            setPersonInchargeFaxNo(event.target.value)
                                        }
                                        fullWidth
                                    />

                                </Box>


                            </Box>
                        </Box>
                        {/*Column-02*/}
                        {/* Accounting Details*/}
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                                flex: "1 1 330px",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 2,
                                    flex: "1 1 330px",
                                }}
                            >
                                <Box
                                    component={Paper}
                                    sx={{
                                        flex: 1,
                                        py: 2,
                                        px: 2,
                                        gap: 1.5,
                                        display: "flex",
                                        flexDirection: "column",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            py: 0.5,
                                            px: 2,
                                            display: "flex",
                                            flexDirection: "column",
                                            backgroundColor: "#3B6E91",
                                            color: "white",
                                            borderRadius: 1,
                                        }}
                                    >
                                        <Typography variant="subtitle2">
                                            Accounting details
                                        </Typography>
                                    </Box>

                                    <Box
                                        sx={{
                                            display: "flex",
                                            gap: 1,

                                        }}>
                                        <TextField
                                            label="Name"
                                            value={AccountingDetailsName}
                                            onChange={(event) =>
                                                setAccountingDetailsName(event.target.value)
                                            }
                                            fullWidth
                                            required
                                        />
                                        <TextField
                                            label="Email"
                                            value={AccountingDetailsEmail}
                                            onChange={(event) =>
                                                setAccountingDetailsEmail(event.target.value)
                                            }
                                            fullWidth
                                            required
                                        />
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            gap: 1,

                                        }}>
                                        <TextField
                                            label="phone"
                                            value={personInchargePhone}
                                            onChange={(event) =>
                                                setPersonInchargePhone(event.target.value)
                                            }
                                            fullWidth
                                            required
                                        />
                                        <TextField
                                            label="Fax No"
                                            value={personInchargeFaxNo}
                                            onChange={(event) =>
                                                setPersonInchargeFaxNo(event.target.value)
                                            }
                                            fullWidth
                                        />
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            gap: 1,

                                        }}>
                                        <TextField
                                            label="Country"
                                            value={AccountingDetailsCountry}
                                            onChange={(event) =>
                                                setAccountingDetailsCountry(event.target.value)
                                            }
                                            fullWidth
                                        />
                                        <TextField
                                            label="Payment Terms"
                                            value={AccountingDetailsPaymentTerms}
                                            onChange={(event) =>
                                                setAccountingDetailsPaymentTerms(event.target.value)
                                            }
                                            fullWidth
                                            required
                                        />
                                    </Box>
                                    <Box sx={{
                                        display: "flex",
                                        gap: 1,
                                        alignItems: "center",
                                    }}>
                                        <TextField
                                            size="small"
                                            label="Currency"
                                            value={AccountingDetailsCurrency}
                                            onChange={(event) =>
                                                setAccountingDetailsCurrency(event.target.value)
                                            }
                                            fullWidth
                                            required
                                        />
                                    </Box>
                                    <TextField
                                        label="Billing Address"
                                        value={AccountingDetailsBillingAddress}
                                        onChange={(event) =>
                                            setAccountingDetailsBillingAddress(event.target.value)
                                        }
                                        fullWidth
                                        multiline
                                        rows={2}

                                    />
                                    <TextField
                                        label="Special Instructions "
                                        value={AccountingDetailsSpecialInstructions}
                                        onChange={(event) =>
                                            setAccountingDetailsSpecialInstructions(event.target.value)
                                        }
                                        fullWidth
                                        multiline
                                        rows={2}
                                    />
                                    {/* Multiple Email */}
                                    <Box
                                        component={Paper}
                                        sx={{
                                            flex: 1,
                                            py: 2,
                                            px: 2,
                                            gap: 1.5,
                                            display: "flex",
                                            flexDirection: "column",
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                py: 0.5,
                                                px: 2,
                                                display: "flex",
                                                alignItems: "center",
                                                backgroundColor: "#3B6E91",
                                                color: "white",
                                                borderRadius: 1,
                                            }}>
                                            <Typography variant="subtitle2">
                                                Multiple Email
                                            </Typography>
                                        </Box>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                gap: 1,

                                            }}>
                                            <TextField
                                                label="Email"
                                                value={multipleEmail}
                                                onChange={(event) =>
                                                    setMultipleEmail(event.target.value)
                                                }
                                                fullWidth
                                            />
                                        </Box>

                                    </Box>


                                </Box>



                            </Box>

                        </Box>
                        {/*column-03*/}
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                                flex: "1 1 330px",
                            }}
                        >

                        </Box>
                    </Box>
                )
            }
            {/*Sub Agent Export Form*/}
            {
                groupId === "Sub Agent Export" && (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            gap: 3,
                            flexWrap: "wrap",
                        }}>
                        {/*Column-01*/}
                        {/*Contact Details*/}
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                                flex: "1 1 330px",
                            }}
                        >
                            <Box
                                component={Paper}
                                sx={{
                                    flex: 1,
                                    py: 2,
                                    px: 2,
                                    gap: 1,
                                    display: "flex",
                                    flexDirection: "column",
                                }}>
                                <TextField
                                    label="Company Name"
                                    value={companyName}
                                    onChange={(event) =>
                                        setCompanyName(event.target.value)
                                    }
                                    fullWidth
                                    required
                                />
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,
                                    }}>
                                    <TextField
                                        label="Station Code"
                                        type="text"
                                        value={stationCode}
                                        onChange={(event) =>
                                            setStationCode(event.target.value)
                                        }
                                        required
                                        sx={{
                                            flex: 1,
                                        }}
                                    />
                                    <TextField
                                        label="Email"
                                        type="email"
                                        value={email}
                                        onChange={(event) =>
                                            setEmail(event.target.value)
                                        }
                                        required
                                        sx={{
                                            flex: 1,
                                        }}
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,
                                    }}>
                                    <TextField
                                        label="Phone"
                                        type="tel"
                                        value={phone}
                                        onChange={(event) =>
                                            setPhone(event.target.value)
                                        }
                                        fullWidth
                                        required
                                    />
                                    <TextField
                                        label="Fax No"
                                        type="fax_no"
                                        value={faxNo}
                                        onChange={(event) =>
                                            setFaxNo(event.target.value)
                                        }
                                        fullWidth
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,
                                    }}>
                                    <TextField
                                        label="EORI / UISE No."
                                        value={eoriUiseNo}
                                        onChange={(event) =>
                                            setEoriUiseNo(event.target.value)
                                        }
                                        fullWidth
                                    />
                                    <TextField
                                        label="Country"
                                        value={country}
                                        onChange={(event) =>
                                            setCountry(event.target.value)
                                        }
                                        fullWidth
                                        required
                                    />
                                    <TextField
                                        label="City"
                                        value={city}
                                        onChange={(event) =>
                                            setCity(event.target.value)
                                        }
                                        fullWidth
                                        required
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,
                                    }}>
                                    <TextField
                                        label="Notify Party"
                                        value={notifyParty}
                                        onChange={(event) =>
                                            setNotifyParty(event.target.value)
                                        }
                                        fullWidth
                                        required
                                        multiline
                                        rows={1}
                                    />
                                    <TextField
                                        label="Airport Code"
                                        value={airportCode}
                                        onChange={(event) =>
                                            setAirportCode(event.target.value)
                                        }
                                        fullWidth
                                        required
                                    />
                                </Box>
                                <TextField
                                    label="Address"
                                    value={address}
                                    onChange={(event) =>
                                        setAddress(event.target.value)
                                    }
                                    fullWidth
                                    required
                                    multiline
                                    rows={3}
                                />
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,
                                    }}>
                                    <TextField
                                        label="Postal Code"
                                        type="postal_code"
                                        value={postalCode}
                                        onChange={(event) =>
                                            setPostalCode(event.target.value)
                                        }
                                        fullWidth
                                    />
                                    <TextField
                                        label="Vat No"
                                        value={vatNo}
                                        onChange={(event) =>
                                            setVatNo(event.target.value)
                                        }
                                        fullWidth
                                    />
                                </Box>

                                {/*Person in charge*/}
                                <Box
                                    sx={{
                                        py: 0.5,
                                        px: 2,
                                        display: "flex",
                                        alignItems: "center",
                                        backgroundColor: "#3B6E91",
                                        color: "white",
                                        borderRadius: 1,
                                        marginTop: 2,
                                    }}>
                                    <Typography variant="subtitle2">
                                        Person in charge
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,

                                    }}>
                                    <TextField
                                        label="Name"
                                        value={personInchargeName}
                                        onChange={(event) =>
                                            setPersonInchargeName(event.target.value)
                                        }
                                        fullWidth
                                        required
                                    />
                                    <TextField
                                        label="Email"
                                        value={personInchargeEmail}
                                        onChange={(event) =>
                                            setPersonInchargeEmail(event.target.value)
                                        }
                                        fullWidth
                                        required
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,

                                    }}>
                                    <TextField
                                        label="phone"
                                        value={personInchargePhone}
                                        onChange={(event) =>
                                            setPersonInchargePhone(event.target.value)
                                        }
                                        fullWidth
                                        required
                                    />
                                    <TextField
                                        label="Fax No"
                                        value={personInchargeFaxNo}
                                        onChange={(event) =>
                                            setPersonInchargeFaxNo(event.target.value)
                                        }
                                        fullWidth
                                    />

                                </Box>


                            </Box>
                        </Box>
                        {/*Column-02*/}
                        {/* Accounting Details*/}
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                                flex: "1 1 330px",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 2,
                                    flex: "1 1 330px",
                                }}
                            >
                                <Box
                                    component={Paper}
                                    sx={{
                                        flex: 1,
                                        py: 2,
                                        px: 2,
                                        gap: 1.5,
                                        display: "flex",
                                        flexDirection: "column",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            py: 0.5,
                                            px: 2,
                                            display: "flex",
                                            flexDirection: "column",
                                            backgroundColor: "#3B6E91",
                                            color: "white",
                                            borderRadius: 1,
                                        }}
                                    >
                                        <Typography variant="subtitle2">
                                            Accounting details
                                        </Typography>
                                    </Box>

                                    <Box
                                        sx={{
                                            display: "flex",
                                            gap: 1,

                                        }}>
                                        <TextField
                                            label="Name"
                                            value={AccountingDetailsName}
                                            onChange={(event) =>
                                                setAccountingDetailsName(event.target.value)
                                            }
                                            fullWidth
                                            required
                                        />
                                        <TextField
                                            label="Email"
                                            value={AccountingDetailsEmail}
                                            onChange={(event) =>
                                                setAccountingDetailsEmail(event.target.value)
                                            }
                                            fullWidth
                                            required
                                        />
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            gap: 1,

                                        }}>
                                        <TextField
                                            label="phone"
                                            value={personInchargePhone}
                                            onChange={(event) =>
                                                setPersonInchargePhone(event.target.value)
                                            }
                                            fullWidth
                                            required
                                        />
                                        <TextField
                                            label="Fax No"
                                            value={personInchargeFaxNo}
                                            onChange={(event) =>
                                                setPersonInchargeFaxNo(event.target.value)
                                            }
                                            fullWidth
                                        />
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            gap: 1,

                                        }}>
                                        <TextField
                                            label="Country"
                                            value={AccountingDetailsCountry}
                                            onChange={(event) =>
                                                setAccountingDetailsCountry(event.target.value)
                                            }
                                            fullWidth
                                        />
                                        <TextField
                                            label="Payment Terms"
                                            value={AccountingDetailsPaymentTerms}
                                            onChange={(event) =>
                                                setAccountingDetailsPaymentTerms(event.target.value)
                                            }
                                            fullWidth
                                            required
                                        />
                                    </Box>
                                    <Box sx={{
                                        display: "flex",
                                        gap: 1,
                                        alignItems: "center",
                                    }}>
                                        <TextField
                                            size="small"
                                            label="Currency"
                                            value={AccountingDetailsCurrency}
                                            onChange={(event) =>
                                                setAccountingDetailsCurrency(event.target.value)
                                            }
                                            fullWidth
                                            required
                                        />
                                    </Box>
                                    <TextField
                                        label="Billing Address"
                                        value={AccountingDetailsBillingAddress}
                                        onChange={(event) =>
                                            setAccountingDetailsBillingAddress(event.target.value)
                                        }
                                        fullWidth
                                        multiline
                                        rows={2}

                                    />
                                    <TextField
                                        label="Special Instructions "
                                        value={AccountingDetailsSpecialInstructions}
                                        onChange={(event) =>
                                            setAccountingDetailsSpecialInstructions(event.target.value)
                                        }
                                        fullWidth
                                        multiline
                                        rows={2}
                                    />
                                    {/* Multiple Email */}
                                    <Box
                                        component={Paper}
                                        sx={{
                                            flex: 1,
                                            py: 2,
                                            px: 2,
                                            gap: 1.5,
                                            display: "flex",
                                            flexDirection: "column",
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                py: 0.5,
                                                px: 2,
                                                display: "flex",
                                                alignItems: "center",
                                                backgroundColor: "#3B6E91",
                                                color: "white",
                                                borderRadius: 1,
                                            }}>
                                            <Typography variant="subtitle2">
                                                Multiple Email
                                            </Typography>
                                        </Box>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                gap: 1,

                                            }}>
                                            <TextField
                                                label="Email"
                                                value={multipleEmail}
                                                onChange={(event) =>
                                                    setMultipleEmail(event.target.value)
                                                }
                                                fullWidth
                                                required
                                            />
                                        </Box>

                                    </Box>


                                </Box>



                            </Box>

                        </Box>
                        {/*column-03*/}
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                                flex: "1 1 330px",
                            }}
                        >

                        </Box>
                    </Box>
                )
            }
            {/*Owners Agent Form*/}
            {
                groupId === "Owners Agent" && (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            gap: 3,
                            flexWrap: "wrap",
                        }}>
                        {/*Column-01*/}
                        {/*Contact Details*/}
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                                flex: "1 1 330px",
                            }}
                        >
                            <Box
                                component={Paper}
                                sx={{
                                    flex: 1,
                                    py: 2,
                                    px: 2,
                                    gap: 1,
                                    display: "flex",
                                    flexDirection: "column",
                                }}>
                                <TextField
                                    label="Company Name"
                                    value={companyName}
                                    onChange={(event) =>
                                        setCompanyName(event.target.value)
                                    }
                                    fullWidth
                                    required
                                />
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,
                                    }}>

                                    <TextField
                                        label="Email"
                                        type="email"
                                        value={email}
                                        onChange={(event) =>
                                            setEmail(event.target.value)
                                        }
                                        required
                                        sx={{
                                            flex: 1,
                                        }}
                                    />
                                    <TextField
                                        label="Phone"
                                        type="tel"
                                        value={phone}
                                        onChange={(event) =>
                                            setPhone(event.target.value)
                                        }
                                        fullWidth
                                        required
                                        sx={{
                                            flex: 1,
                                        }}
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,
                                    }}>
                                    <TextField
                                        label="Fax No"
                                        type="fax_no"
                                        value={faxNo}
                                        onChange={(event) =>
                                            setFaxNo(event.target.value)
                                        }
                                        fullWidth
                                    />
                                    <TextField
                                        label="EORI / UISE No."
                                        value={eoriUiseNo}
                                        onChange={(event) =>
                                            setEoriUiseNo(event.target.value)
                                        }
                                        fullWidth
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,
                                    }}>

                                    <TextField
                                        label="Country"
                                        value={country}
                                        onChange={(event) =>
                                            setCountry(event.target.value)
                                        }
                                        fullWidth
                                        required
                                    />
                                    <TextField
                                        label="City"
                                        value={city}
                                        onChange={(event) =>
                                            setCity(event.target.value)
                                        }
                                        fullWidth
                                        required
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,
                                    }}>
                                    <TextField
                                        label="Notify Party"
                                        value={notifyParty}
                                        onChange={(event) =>
                                            setNotifyParty(event.target.value)
                                        }
                                        fullWidth
                                        required
                                        multiline
                                        rows={1}
                                    />
                                    <TextField
                                        label="Airport Code"
                                        value={airportCode}
                                        onChange={(event) =>
                                            setAirportCode(event.target.value)
                                        }
                                        fullWidth
                                        required
                                    />
                                </Box>
                                <TextField
                                    label="Address"
                                    value={address}
                                    onChange={(event) =>
                                        setAddress(event.target.value)
                                    }
                                    fullWidth
                                    required
                                    multiline
                                    rows={3}
                                />
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,
                                    }}>
                                    <TextField
                                        label="Postal Code"
                                        type="postal_code"
                                        value={postalCode}
                                        onChange={(event) =>
                                            setPostalCode(event.target.value)
                                        }
                                        fullWidth
                                    />
                                    <TextField
                                        label="Vat No"
                                        value={vatNo}
                                        onChange={(event) =>
                                            setVatNo(event.target.value)
                                        }
                                        fullWidth
                                    />
                                </Box>

                                {/*Person in charge*/}
                                <Box
                                    sx={{
                                        py: 0.5,
                                        px: 2,
                                        display: "flex",
                                        alignItems: "center",
                                        backgroundColor: "#3B6E91",
                                        color: "white",
                                        borderRadius: 1,
                                        marginTop: 2,
                                    }}>
                                    <Typography variant="subtitle2">
                                        Person in charge
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,

                                    }}>
                                    <TextField
                                        label="Name"
                                        value={personInchargeName}
                                        onChange={(event) =>
                                            setPersonInchargeName(event.target.value)
                                        }
                                        fullWidth
                                        required
                                    />
                                    <TextField
                                        label="Email"
                                        value={personInchargeEmail}
                                        onChange={(event) =>
                                            setPersonInchargeEmail(event.target.value)
                                        }
                                        fullWidth
                                        required
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,

                                    }}>
                                    <TextField
                                        label="phone"
                                        value={personInchargePhone}
                                        onChange={(event) =>
                                            setPersonInchargePhone(event.target.value)
                                        }
                                        fullWidth
                                        required
                                    />
                                    <TextField
                                        label="Fax No"
                                        value={personInchargeFaxNo}
                                        onChange={(event) =>
                                            setPersonInchargeFaxNo(event.target.value)
                                        }
                                        fullWidth
                                    />

                                </Box>


                            </Box>
                        </Box>
                        {/*Column-02*/}

                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                                flex: "1 1 330px",
                            }}
                        >
                            <Box
                                component={Paper}
                                sx={{
                                    py: 2,
                                    px: 2,
                                    gap: 1.5,
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >

                                {/* Multiple Email */}
                                <Box
                                    sx={{
                                        py: 0.5,
                                        px: 2,
                                        display: "flex",
                                        alignItems: "center",
                                        backgroundColor: "#3B6E91",
                                        color: "white",
                                        borderRadius: 1,
                                    }}>
                                    <Typography variant="subtitle2">
                                        Multiple Email
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,

                                    }}>
                                    <TextField
                                        label="Email"
                                        value={multipleEmail}
                                        onChange={(event) =>
                                            setMultipleEmail(event.target.value)
                                        }
                                        fullWidth
                                    />
                                </Box>



                            </Box>



                        </Box>


                        {/*column-03*/}
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                                flex: "1 1 330px",
                            }}
                        >

                        </Box>
                    </Box>
                )
            }
            {/*Owners Supplier*/}
            {
                groupId === "Supplier" && (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            gap: 3,
                            flexWrap: "wrap",
                        }}>
                        {/*Column-01*/}
                        {/*Contact Details*/}
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                                flex: "1 1 330px",
                            }}
                        >
                            <Box
                                component={Paper}
                                sx={{
                                    flex: 1,
                                    py: 2,
                                    px: 2,
                                    gap: 1,
                                    display: "flex",
                                    flexDirection: "column",
                                }}>
                                <TextField
                                    label="Company Name"
                                    value={companyName}
                                    onChange={(event) =>
                                        setCompanyName(event.target.value)
                                    }
                                    fullWidth
                                    required
                                />
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,
                                    }}>

                                    <TextField
                                        label="Email"
                                        type="email"
                                        value={email}
                                        onChange={(event) =>
                                            setEmail(event.target.value)
                                        }
                                        required
                                        sx={{
                                            flex: 1,
                                        }}
                                    />
                                    <TextField
                                        label="Phone"
                                        type="tel"
                                        value={phone}
                                        onChange={(event) =>
                                            setPhone(event.target.value)
                                        }
                                        fullWidth
                                        required
                                        sx={{
                                            flex: 1,
                                        }}
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,
                                    }}>
                                    <TextField
                                        label="Fax No"
                                        type="fax_no"
                                        value={faxNo}
                                        onChange={(event) =>
                                            setFaxNo(event.target.value)
                                        }
                                        fullWidth
                                    />
                                    <TextField
                                        label="EORI / UISE No."
                                        value={eoriUiseNo}
                                        onChange={(event) =>
                                            setEoriUiseNo(event.target.value)
                                        }
                                        fullWidth
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,
                                    }}>

                                    <TextField
                                        label="Country"
                                        value={country}
                                        onChange={(event) =>
                                            setCountry(event.target.value)
                                        }
                                        fullWidth
                                        required
                                    />
                                    <TextField
                                        label="City"
                                        value={city}
                                        onChange={(event) =>
                                            setCity(event.target.value)
                                        }
                                        fullWidth
                                        required
                                    />
                                </Box>
                                <TextField
                                    label="Address"
                                    value={address}
                                    onChange={(event) =>
                                        setAddress(event.target.value)
                                    }
                                    fullWidth
                                    required
                                    multiline
                                    rows={3}
                                />
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,
                                    }}>
                                    <TextField
                                        label="Postal Code"
                                        type="postal_code"
                                        value={postalCode}
                                        onChange={(event) =>
                                            setPostalCode(event.target.value)
                                        }
                                        fullWidth
                                    />
                                    <TextField
                                        label="Vat No"
                                        value={vatNo}
                                        onChange={(event) =>
                                            setVatNo(event.target.value)
                                        }
                                        fullWidth
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,
                                    }}>
                                    <TextField
                                        label="Notify Party"
                                        value={notifyParty}
                                        onChange={(event) =>
                                            setNotifyParty(event.target.value)
                                        }
                                        fullWidth
                                        required
                                        multiline
                                        rows={1}
                                    />
                                </Box>
                                <Button
                                    component="label"
                                    role={undefined}
                                    variant="contained"
                                    tabIndex={-1}
                                    startIcon={<CloudUploadIcon />}
                                    accept="image/jpeg,image/png,application/pdf"
                                >
                                    Upload files
                                    <VisuallyHiddenInput
                                        type="file"
                                        onChange={(event) => setUploadedFile(event.target.files?.[0] ?? null)}
                                        multiple
                                    />
                                </Button>

                                {/*Person in charge*/}
                                <Box
                                    sx={{
                                        py: 0.5,
                                        px: 2,
                                        display: "flex",
                                        alignItems: "center",
                                        backgroundColor: "#3B6E91",
                                        color: "white",
                                        borderRadius: 1,
                                        marginTop: 2,
                                    }}>
                                    <Typography variant="subtitle2">
                                        Person in charge
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,

                                    }}>
                                    <TextField
                                        label="Name"
                                        value={personInchargeName}
                                        onChange={(event) =>
                                            setPersonInchargeName(event.target.value)
                                        }
                                        fullWidth
                                        required
                                    />
                                    <TextField
                                        label="Email"
                                        value={personInchargeEmail}
                                        onChange={(event) =>
                                            setPersonInchargeEmail(event.target.value)
                                        }
                                        fullWidth
                                        required
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,

                                    }}>
                                    <TextField
                                        label="phone"
                                        value={personInchargePhone}
                                        onChange={(event) =>
                                            setPersonInchargePhone(event.target.value)
                                        }
                                        fullWidth
                                        required
                                    />
                                    <TextField
                                        label="Fax No"
                                        value={personInchargeFaxNo}
                                        onChange={(event) =>
                                            setPersonInchargeFaxNo(event.target.value)
                                        }
                                        fullWidth
                                    />

                                </Box>


                            </Box>
                        </Box>
                        {/*Column-02*/}

                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                                flex: "1 1 330px",
                            }}
                        >
                            <Box
                                component={Paper}
                                sx={{
                                    py: 2,
                                    px: 2,
                                    gap: 1.5,
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >

                                {/* Multiple Email */}
                                <Box
                                    sx={{
                                        py: 0.5,
                                        px: 2,
                                        display: "flex",
                                        alignItems: "center",
                                        backgroundColor: "#3B6E91",
                                        color: "white",
                                        borderRadius: 1,
                                    }}>
                                    <Typography variant="subtitle2">
                                        Multiple Email
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,

                                    }}>
                                    <TextField
                                        label="Email"
                                        value={multipleEmail}
                                        onChange={(event) =>
                                            setMultipleEmail(event.target.value)
                                        }
                                        fullWidth
                                    />
                                </Box>



                            </Box>



                        </Box>


                        {/*column-03*/}
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                                flex: "1 1 330px",
                            }}
                        >

                        </Box>
                    </Box>
                )
            }

            {/* Toast feedback */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>

        </Stack >
    );
}