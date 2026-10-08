import { useState } from "react";
import {
  Stack,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Button
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

import UserIndexHeader from "./components/Header";
import UserIndexTable from "./components/Table";
import CreateUserDrawer from "./components/CreateUserDrawer";
import UserIndexFilter, { type UserFilters } from "./components/Filter";



import type { User } from "./types/user.types";
import { deleteUser } from "./services/user.service";

export default function UsersIndex() {
  const [createDrawerOpen, setCreateDrawerOpen] =
    useState(false);

  const [refreshKey, setRefreshKey] = useState(0);

  const [selectedUser, setSelectedUser] =
    useState<User | null>(null);

  const [selectedDeleteUser, setSelectedDeleteUser] =
    useState<User | null>(null);

  const [filters, setFilters] = useState<UserFilters>({
    search: "",
    status: "",
    role: "",
  });

  //* Create / Update success
  const handleUserCreated = () => {
    setRefreshKey((value) => value + 1);
  };

  //* Edit
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setCreateDrawerOpen(true);
  };

  //* Delete
  const handleDeleteUser = (user: User) => {
    setSelectedDeleteUser(user);
  };

  const handleConfirmDelete = async () => {
    if (!selectedDeleteUser) {
      return;
    }

    try {
      await deleteUser(selectedDeleteUser.id);

      // Close dialog
      setSelectedDeleteUser(null);

      // Refresh table
      setRefreshKey((value) => value + 1);
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  return (
    <Stack spacing={1}>

      <UserIndexHeader
        onCreate={() => {
          setCreateDrawerOpen(true);
          setSelectedUser(null);
        }}
      />

      <UserIndexFilter
        filters={filters}
        onFilterChange={setFilters}
      />

      <UserIndexTable
        key={refreshKey}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        filters={filters}
      />

      <CreateUserDrawer
        open={
          createDrawerOpen ||
          selectedUser !== null
        }
        user={selectedUser}
        onClose={() => {
          setCreateDrawerOpen(false);
          setSelectedUser(null);
        }}
        onCreated={handleUserCreated}
      />
      <Dialog
        open={selectedDeleteUser !== null}
        onClose={() => setSelectedDeleteUser(null)}
        aria-labelledby="delete-user-title"
        aria-describedby="delete-user-description"
        fullWidth
        maxWidth="xs"
        slotProps={{ paper: { sx: { borderRadius: 3, p: 1, boxShadow: (theme) => theme.shadows[10] } } }}
      >
        <DialogTitle
          id="delete-user-title"
          component="div"
          sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, pt: 3, pb: 1 }}
        >
          <Box sx={(theme) => ({ width: 64, height: 64, borderRadius: "50%", display: "grid", placeItems: "center", bgcolor: alpha(theme.palette.error.main, 0.12), color: "error.main", boxShadow: `0 0 0 8px ${alpha(theme.palette.error.main, 0.06)}` })}>
            <DeleteOutlinedIcon sx={{ fontSize: 32 }} />
          </Box>
          <Typography variant="h6" component="h2" fontWeight={700}>
            Delete user?
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ textAlign: "center", pb: 1 }}>
          <Typography id="delete-user-description" variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
            Are you sure you want to delete{" "}
            {selectedDeleteUser?.name ? (
              <Box component="span" sx={{ fontWeight: 600, color: "text.primary" }}>
                “{selectedDeleteUser.name}”
              </Box>
            ) : "this user"}?
            {" "}This action cannot be undone.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pt: 2, pb: 3, gap: 1.5 }}>
          <Button
            onClick={() => setSelectedDeleteUser(null)}
            variant="outlined"
            color="inherit"
            fullWidth
            sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2, borderColor: "divider" }}
          >
            Cancel
          </Button>

          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            fullWidth
            autoFocus
            disableElevation
            sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

    </Stack>
  );
}
