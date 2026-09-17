import { useEffect, useState } from "react";
import { createUser, updateUser, } from "../services/user.service";
import { Box, Button, Drawer, IconButton, MenuItem, Stack, TextField, Typography, Avatar, Alert, FormControlLabel, Switch, Paper, InputAdornment } from "@mui/material";
import axios from "axios";
import type { User } from "../types/user.types";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

interface CreateUserDrawerProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
  onCreated: () => void;
}


export default function CreateUserDrawer({ open, onClose, onCreated, user }: CreateUserDrawerProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [initial, setInitial] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      setName("");
      setEmail("");
      setPassword("");
      setRole("");
      setIsActive(true);
      setInitial("");
      setAvatar(null);
      setAvatarPreview(null);

      return;
    }
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setIsActive(user.isActive);
    setInitial(user.initial ? user.initial.toUpperCase() : "");
    setAvatar(null);

    if (user.avatar) {
      setAvatarPreview(
        `http://localhost:3000/${user.avatar}`,
      );
    } else {
      setAvatarPreview(null);
    }
  }, [user]);

  const handleCancel = () => {
    setName("");
    setEmail("");
    setPassword("");
    setRole("");
    setIsActive(true);
    setInitial("");
    setAvatar(null);
    setAvatarPreview(null);
    setError("");
    onClose();
  };

  const handleSubmit = async (
    event: React.FormEvent,
  ) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      if (user) {
        await updateUser(
          user.id,
          {
            name,
            email,
            password,
            role: role as User["role"],
            isActive,
            initial,
          },
          avatar,
        );
      } else {
        await createUser(
          {
            name,
            email,
            password,
            role: role as User["role"],
            isActive,
            initial,
          },
          avatar,
        );
      }

      setName("");
      setEmail("");
      setPassword("");
      setRole("");
      setIsActive(true);
      setInitial("");

      onCreated();
      onClose();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;

        if (Array.isArray(message)) {
          setError(message.join(", "));
        } else if (message) {
          setError(message);
        } else {
          setError("Failed to create user");
        }
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
    >
      <Box
        sx={{
          width: {
            xs: "100vw",
            sm: 450,
          },
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}

        <Box
          sx={{
            px: 3,
            py: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: 1,
            borderColor: "divider",
            background:
              "linear-gradient(135deg, #C62828 0%, #EF5350 100%)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <PersonAddIcon sx={{ color: "#fff", fontSize: 26 }} />
            <Typography variant="h6" sx={{ color: "#fff", fontWeight: 600 }}>
              {user ? "Edit User" : "Create User"}
            </Typography>
          </Box>

          <IconButton onClick={handleCancel} sx={{ color: "#fff" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Form */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            mt: 6,
          }}
        >
          <Avatar
            src={avatarPreview ?? undefined}
            sx={{
              width: 108,
              height: 108,
            }}
          >
            {name
              ? name.charAt(0).toUpperCase()
              : <PersonIcon sx={{ fontSize: 80, opacity: 0.8 }} />}

          </Avatar>

          <Box>
            <Button
              variant="outlined"
              component="label"
            >
              Choose Avatar

              <input
                hidden
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file =
                    event.target.files?.[0];

                  if (!file) {
                    return;
                  }

                  setAvatar(file);

                  const previewUrl =
                    URL.createObjectURL(file);

                  setAvatarPreview(previewUrl);
                }}
              />
            </Button>
          </Box>
        </Box>

        <Box
          component="form"
          id="create-user-form"
          onSubmit={handleSubmit}
          sx={{
            p: 3,
            flex: 1,
            overflowY: "auto",
          }}
        >
          <Box
            component={Paper}
            sx={{ p: 3 }}
          >
            <Stack
              spacing={3}
              sx={{
                "& .MuiFormLabel-asterisk": {
                  color: "red",
                },
              }}
            >

              <TextField
                label="Name"
                variant="outlined"
                value={name}
                onChange={(event) => setName(event.target.value)}
                fullWidth
                required
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: "red" }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <TextField
                label="Email"
                variant="outlined"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                fullWidth
                required
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: "red" }} />
                      </InputAdornment>
                    ),
                  }
                }}
              />

              <TextField
                label="Password"
                variant="outlined"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                fullWidth
                required={!user}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: "red" }} />
                      </InputAdornment>
                    ),
                  }
                }}
                helperText={
                  user
                    ? "Leave blank to keep the current password"
                    : undefined
                }
              />

              <TextField
                select
                variant="outlined"
                label="Role"
                value={role}
                onChange={(event) =>
                  setRole(event.target.value)
                }
                fullWidth
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <AdminPanelSettingsIcon sx={{ color: "red" }} />
                      </InputAdornment>
                    ),
                  }
                }}
              >
                <MenuItem value="Vendor">
                  Client
                </MenuItem>

                <MenuItem value="Vendor">
                  Documentation
                </MenuItem>

                <MenuItem value="Employee">
                  Key Account Manager
                </MenuItem>

                <MenuItem value="Employee">
                  operations Manager
                </MenuItem>

                <MenuItem value="SuperAdmin">
                  Manager
                </MenuItem>

                <MenuItem value="Client">
                  Fiance Executive
                </MenuItem>

                <MenuItem value="Client">
                  Finance Manager
                </MenuItem>

              </TextField>

              <TextField
                label="Initial"
                variant="outlined"
                value={initial}
                onChange={(event) => setInitial(event.target.value.toUpperCase())}
                fullWidth
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: "red" }} />
                      </InputAdornment>
                    ),
                  }
                }}

              />



              <Box sx={{ ml: 1 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isActive}
                      onChange={(event) => setIsActive(event.target.checked)}
                      color="success"
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {isActive ? "Active User" : "Inactive User"}
                    </Typography>
                  }
                />
              </Box>

            </Stack>
          </Box>
          <br />
          {error && (
            <Alert severity="error">
              {error}
            </Alert>
          )}
        </Box>

        {/* Footer */}

        <Box
          sx={{
            px: 3,
            py: 2,
            borderTop: 1,
            borderColor: "divider",
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
          }}
        >
          <Button
            variant="outlined"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            form="create-user-form"
            variant="contained"
            disabled={loading}
          >
            {loading
              ? user
                ? "Updating..."
                : "Creating..."
              : user
                ? "Update User"
                : "Create User"
            }
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
