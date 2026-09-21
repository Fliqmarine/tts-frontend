import { Box, Button, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import ContactsIcon from "@mui/icons-material/Contacts";


export default function ContactsIndexHeader() {
    const navigate = useNavigate();

    const handleAddContact = () => {
        navigate("/master/contact-list/contact-create");
    };

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                py: 1,
                px: 1,
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                    sx={(theme) => ({
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: theme.palette.primary.contrastText,
                    })}>
                    <ContactsIcon sx={{ fontSize: 26 }} />
                </Box>

                <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary" }}>
                            Contacts
                        </Typography>
                    </Box>
                </Box>
            </Box>
            <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={handleAddContact}
                sx={{
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                }}
            >
                Add Contact
            </Button>

        </Box>
    )
}