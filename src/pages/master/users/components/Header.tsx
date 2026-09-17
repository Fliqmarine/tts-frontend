import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { Add } from "@mui/icons-material";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import { Box, Button, Typography } from "@mui/material";


interface UserIndexHeaderProps {
  onCreate: () => void;
}

function UserIndexHeader({onCreate,}: UserIndexHeaderProps) {
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
                    sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        background: "linear-gradient(135deg, #C62828 0%, #EF5350 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <PeopleAltOutlinedIcon sx={{ color: "#fff", fontSize: 26 }} />
                </Box>
                <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: "#0b0b0b" }}>
                            Users
                        </Typography>
                    </Box>
                </Box>
            </Box>
            <Button
                variant="contained"
                startIcon={<Add />}
                onClick={onCreate}
                sx={{
                    background: "linear-gradient(135deg, #C62828 0%, #EF5350 100%)",
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    boxShadow: "0 4px 14px rgba(198,40,40,0.4)",
                    "&:hover": {
                        background: "linear-gradient(135deg, #8E0000 0%, #C62828 100%)",
                        boxShadow: "0 6px 20px rgba(198,40,40,0.5)",
                    },
                }}
            >
                Add User
            </Button>
        </Box>
    );
}

export default UserIndexHeader;