import { useState } from "react";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
	Box,
	Button,
	Checkbox,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	Paper,
	Switch,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
	Tooltip,
	Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

export default function ClientIndexTable({ clients = [], onDelete, onEdit, onView, onStatusChange, filters = {} }) {
	const [selected, setSelected] = useState([]);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [deleteTarget, setDeleteTarget] = useState(null);

	const handleConfirmDelete = () => {
		if (!deleteTarget) return;
		onDelete?.(deleteTarget);
		setSelected((previous) => previous.filter((id) => id !== deleteTarget.id));
		setDeleteTarget(null);
	};

	const search = filters.search?.trim().toLowerCase() ?? "";
	const filteredClients = clients.filter((client) => {
		const countryMatch = !filters.country || client.country === filters.country;
		const managerMatch = !filters.keyAccountManager || client.keyAccountManager === filters.keyAccountManager;
		const isActive = client.status ?? true;
		const statusMatch = !filters.status || isActive === (filters.status === "active");
		const searchMatch = !search || [client.companyName, client.email, client.phone, client.country, client.keyAccountManager]
			.some((value) => value?.toLowerCase().includes(search));
		return countryMatch && managerMatch && statusMatch && searchMatch;
	});
	const pageCount = Math.ceil(filteredClients.length / rowsPerPage);
	const safePage = Math.max(0, Math.min(page, pageCount - 1));
	const paginatedClients = filteredClients.slice(safePage * rowsPerPage, safePage * rowsPerPage + rowsPerPage);

	const allClientsSelected = filteredClients.length > 0 && filteredClients.every((client) => selected.includes(client.id));
	const someClientsSelected = filteredClients.some((client) => selected.includes(client.id)) && !allClientsSelected;

	const handleSelectAll = () => {
		if (allClientsSelected) {
			setSelected((previous) => previous.filter((id) => !filteredClients.some((client) => client.id === id)));
		} else {
			setSelected((previous) => [...new Set([...previous, ...filteredClients.map((client) => client.id)])]);
		}
	};

	const handleExport = () => {
		window.alert(`Exporting ${selected.length} items (Placeholder)`);
	};

	return (
		<Box>
			{selected.length > 0 && (
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						px: 2,
						py: 1,
						mb: 1,
						bgcolor: "action.hover",
						borderRadius: 2,
						border: "1px solid",
						borderColor: "divider",
					}}
				>
					<Typography variant="body2" color="primary.main" sx={{ fontWeight: 600 }}>
						{selected.length} items selected
					</Typography>
					<Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "flex-end" }}>
						<Button
							variant="contained"
							size="small"
							color="success"
							startIcon={<FileDownloadOutlinedIcon />}
							onClick={handleExport}
						>
							Export Excel
						</Button>
						<Button
							variant="contained"
							size="small"
							color="secondary"
							startIcon={<FileDownloadOutlinedIcon />}
							onClick={handleExport}
						>
							Export PDF
						</Button>
					</Box>
				</Box>
			)}

			<TableContainer
				component={Paper}
				elevation={3}
				sx={{ border: "1px solid", borderColor: "divider", overflowX: "auto", overflowY: "hidden", mt: 2 }}
			>
				<Table size="small" sx={{ minWidth: { xs: 1200, sm: "100%" } }}>
					<TableHead>
						<TableRow>
							<TableCell padding="checkbox">
								<Checkbox
									size="small"
									checked={allClientsSelected}
									indeterminate={someClientsSelected}
									onChange={handleSelectAll}
								/>
							</TableCell>
							<TableCell sx={{ whiteSpace: "nowrap" }}>Contact Code</TableCell>
							<TableCell sx={{ whiteSpace: "nowrap" }}>Client Name</TableCell>
							<TableCell sx={{ whiteSpace: "nowrap" }}>Station Code</TableCell>
							<TableCell sx={{ whiteSpace: "nowrap" }}>Email</TableCell>
							<TableCell sx={{ whiteSpace: "nowrap" }}>Phone</TableCell>
							<TableCell sx={{ whiteSpace: "nowrap" }}>Country</TableCell>
							<TableCell sx={{ whiteSpace: "nowrap" }}>Key Account Manager</TableCell>
							<TableCell sx={{ whiteSpace: "nowrap" }}>Status</TableCell>
							<TableCell align="right" sx={{ whiteSpace: "nowrap" }}>Actions</TableCell>
						</TableRow>
					</TableHead>

					<TableBody>
						{filteredClients.length === 0 ? (
							<TableRow>
								<TableCell colSpan={10} sx={{ textAlign: "center", py: 5 }}>
									<Typography variant="body2" color="text.secondary">
										{clients.length === 0 ? "No clients found." : "No clients match these filters."}
									</Typography>
								</TableCell>
							</TableRow>
						) : (
							paginatedClients.map((client) => {
								const isSelected = selected.includes(client.id);
								const isActive = client.status ?? true;

								return (
									<TableRow key={client.id} selected={isSelected} hover>
										<TableCell padding="checkbox">
											<Checkbox
												size="small"
												checked={isSelected}
												onChange={() => setSelected((previous) => (
													isSelected
														? previous.filter((id) => id !== client.id)
														: [...previous, client.id]
												))}
											/>
										</TableCell>
										<TableCell sx={{ color: "text.secondary", fontFamily: "monospace" }}>
											{String(client.id).padStart(5, "0")}
										</TableCell>
										<TableCell sx={{ fontWeight: 500 }}>{client.companyName || "—"}</TableCell>
										<TableCell sx={{ color: "text.secondary" }}>{client.stationCode || "—"}</TableCell>
										<TableCell sx={{ color: "text.secondary" }}>{client.email || client.coordinatorInCharge?.email || "—"}</TableCell>
										<TableCell sx={{ color: "text.secondary" }}>{client.phone || client.coordinatorInCharge?.phone || "—"}</TableCell>
										<TableCell sx={{ color: "text.secondary" }}>{client.country || "—"}</TableCell>
										<TableCell sx={{ color: "text.secondary" }}>{client.keyAccountManager || "—"}</TableCell>
										<TableCell>
											<Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
												<Switch
													size="small"
													checked={isActive}
													onChange={(event) => onStatusChange?.(client, event.target.checked)}
													inputProps={{ "aria-label": `Set ${client.companyName} ${isActive ? "inactive" : "active"}` }}
												/>
												<Typography variant="caption" color={isActive ? "success.main" : "text.secondary"}>
													{isActive ? "Active" : "Inactive"}
												</Typography>
											</Box>
										</TableCell>
										<TableCell align="right">
											<Box sx={{ display: "flex", gap: 0.25, justifyContent: "flex-end" }}>
												<Tooltip title="View" arrow>
													<IconButton
														size="small"
														color="primary"
														onClick={() => onView?.(client)}
													>
														<VisibilityIcon sx={{ fontSize: "1rem" }} />
													</IconButton>
												</Tooltip>
												<Tooltip title="Edit" arrow>
													<IconButton
														size="small"
														color="primary"
														onClick={() => onEdit?.(client)}
													>
														<EditIcon sx={{ fontSize: "1rem" }} />
													</IconButton>
												</Tooltip>
												<Tooltip title="Delete" arrow>
										<IconButton size="small" color="error" onClick={() => setDeleteTarget(client)}>
														<DeleteIcon sx={{ fontSize: "1rem" }} />
													</IconButton>
												</Tooltip>
												<Tooltip title="More" arrow>
													<IconButton size="small" color="default">
														<MoreVertIcon sx={{ fontSize: "1rem" }} />
													</IconButton>
												</Tooltip>
											</Box>
										</TableCell>
									</TableRow>
								);
							})
						)}
					</TableBody>
				</Table>
				<TablePagination
					component="div"
					count={filteredClients.length}
					page={safePage}
					rowsPerPage={rowsPerPage}
					rowsPerPageOptions={[5, 10, 25]}
					onPageChange={(_, nextPage) => setPage(nextPage)}
					onRowsPerPageChange={(event) => {
						setRowsPerPage(Number.parseInt(event.target.value, 10));
						setPage(0);
					}}
					sx={{ borderTop: "1px solid", borderColor: "divider", "& .MuiTablePagination-toolbar": { px: { xs: 1, sm: 2 }, flexWrap: { xs: "wrap", sm: "nowrap" }, justifyContent: { xs: "center", sm: "flex-end" } }, "& .MuiTablePagination-selectLabel": { display: { xs: "none", sm: "block" } } }}
				/>
			</TableContainer>
			<Dialog
				open={deleteTarget !== null}
				onClose={() => setDeleteTarget(null)}
				aria-labelledby="delete-client-title"
				aria-describedby="delete-client-description"
				fullWidth
				maxWidth="xs"
				slotProps={{ paper: { sx: { borderRadius: 3, p: 1, boxShadow: (theme) => theme.shadows[10] } } }}
			>
				<DialogTitle
					id="delete-client-title"
					component="div"
					sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, pt: 3, pb: 1 }}
				>
					<Box
						sx={(theme) => ({
							width: 64,
							height: 64,
							borderRadius: "50%",
							display: "grid",
							placeItems: "center",
							bgcolor: alpha(theme.palette.error.main, 0.12),
							color: "error.main",
							boxShadow: `0 0 0 8px ${alpha(theme.palette.error.main, 0.06)}`,
						})}
					>
						<DeleteOutlinedIcon sx={{ fontSize: 32 }} />
					</Box>
					<Typography variant="h6" component="h2" fontWeight={700}>Delete client?</Typography>
				</DialogTitle>
				<DialogContent sx={{ textAlign: "center", pb: 1 }}>
					<Typography id="delete-client-description" variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
						Are you sure you want to delete{" "}
						{deleteTarget?.companyName ? (
							<Box component="span" sx={{ fontWeight: 600, color: "text.primary" }}>
								“{deleteTarget.companyName}”
							</Box>
						) : (
							"this client"
						)}
						? This action cannot be undone.
					</Typography>
				</DialogContent>
				<DialogActions sx={{ px: 3, pt: 2, pb: 3, gap: 1.5 }}>
					<Button onClick={() => setDeleteTarget(null)} variant="outlined" color="inherit" fullWidth sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2, borderColor: "divider" }}>
						Cancel
					</Button>
					<Button onClick={handleConfirmDelete} color="error" variant="contained" fullWidth autoFocus disableElevation sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}>
						Delete
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}
