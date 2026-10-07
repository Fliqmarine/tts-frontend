import { Box } from "@mui/material";
import { useState } from "react";
import type { GLCodeChildren } from "./types/glCodeChildren.types";
import GLCodeChildrenIndexHeader from "./components/Header";
import GLCodeChildrenIndexTable from "./components/Table";
import GLCodeChildrenDialog from "./components/GLCodeChildrenDialog";

export default function GLCodeChildrenIndex() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editGLCode, setEditGLCode] = useState<GLCodeChildren | null>(null);

    const handleCreate = () => {
        setDialogOpen(true);
        setEditGLCode(null);
    };

    const handleEdit = (glCode: GLCodeChildren) => {
        setDialogOpen(true);
        setEditGLCode(glCode);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setEditGLCode(null);
    };

    const handleDialogSubmit = (data: GLCodeChildren) => {
        console.log("Dialog submitted:", data);
        setDialogOpen(false);
        setEditGLCode(null);
    };

    return (
        <Box sx={{ p: 2 }}>
            <GLCodeChildrenIndexHeader onCreate={handleCreate} />
            <GLCodeChildrenIndexTable onEdit={handleEdit} />
            <GLCodeChildrenDialog
                open={dialogOpen}
                onClose={handleDialogClose}
                glCode={editGLCode}
                onSubmit={handleDialogSubmit}
            />
        </Box>
    );
}
