import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { Add } from "@mui/icons-material";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import { Box, Button, Typography } from "@mui/material";


interface UserIndexHeaderProps {
    onCreate: () => void;
}

function UserIndexHeader({ onCreate, }: UserIndexHeaderProps) {
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
                    })}
                >
                    <PeopleAltOutlinedIcon sx={{ fontSize: 26 }} />
                </Box>
                <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary" }}>
                            Users
                        </Typography>
                    </Box>
                </Box>
            </Box>
            <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={onCreate}
                sx={{
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                }}
            >
                Add User
            </Button>
        </Box>
    );
}

export default UserIndexHeader;