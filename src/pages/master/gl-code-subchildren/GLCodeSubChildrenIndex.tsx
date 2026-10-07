import { Box } from "@mui/material";
import { useState } from "react";
import type { GLCodeSubChildren } from "./types/glCodeSubChildren.types";
import GLCodeSubChildDialog from "./components/GLCodeSubChildDialog";
import GLCodeSubChildrenIndexHeader from "./components/Header";
import GLCodeSubChildrenIndexTable from "./components/Table";

export default function GLCodeSubChildrenIndex() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editGLCode, setEditGLCode] = useState<GLCodeSubChildren | null>(null);

    const handleCreate = () => {
        setDialogOpen(true);
        setEditGLCode(null);
    };

    const handleEdit = (glCode: GLCodeSubChildren) => {
        setDialogOpen(true);
        setEditGLCode(glCode);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setEditGLCode(null);
    };

    const handleDialogSubmit = (data: GLCodeSubChildren) => {
        console.log("Dialog submitted:", data);
        setDialogOpen(false);
        setEditGLCode(null);
    };

    return (
        <Box sx={{ p: 2 }}>
            <GLCodeSubChildrenIndexHeader onCreate={handleCreate} />
            <GLCodeSubChildrenIndexTable onEdit={handleEdit} />
            <GLCodeSubChildDialog
                open={dialogOpen}
                onClose={handleDialogClose}
                glCode={editGLCode}
                onSubmit={handleDialogSubmit}
            />
        </Box>
    );
}