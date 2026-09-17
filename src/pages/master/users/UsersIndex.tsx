import { useState } from "react";
import {
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button
} from "@mui/material";

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
      >
        <DialogTitle>
          Delete User
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete{" "}
            <strong>
              {selectedDeleteUser?.name}
            </strong>
            ?
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setSelectedDeleteUser(null)}
          >
            Cancel
          </Button>

          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

    </Stack>
  );
}
