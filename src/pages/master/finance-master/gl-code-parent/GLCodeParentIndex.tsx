import { Box } from "@mui/material";
import { useState } from "react";
import type { GLCodeParent } from "./types/glCodeParent.types";
import GLCodeParentIndexHeader from "./components/Header";
import GLCodeParentIndexTable from "./components/Table";
import { GLCodeParentDialog } from "./components";

export default function GLCodeParentIndex() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editGLCode, setEditGLCode] = useState<GLCodeParent | null>(null);

    const handleCreate = () => {
        setDialogOpen(true);
        setEditGLCode(null);
    };

    const handleEdit = (glCode: GLCodeParent) => {
        setDialogOpen(true);
        setEditGLCode(glCode);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setEditGLCode(null);
    };

    const handleDialogSubmit = (data: GLCodeParent) => {
        console.log("Dialog submitted:", data);
        setDialogOpen(false);
        setEditGLCode(null);
    };

    return (
        <Box sx={{ p: 2 }}>
            <GLCodeParentIndexHeader onCreate={handleCreate} />
            <GLCodeParentIndexTable onEdit={handleEdit} />
            <GLCodeParentDialog
                open={dialogOpen}
                onClose={handleDialogClose}
                glCode={editGLCode}
                onSubmit={handleDialogSubmit}
            />
        </Box>
    );
}
