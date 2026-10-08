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

export default function HubIndexTable({ hubs = [], onDelete, onEdit, onView, onStatusChange, filters = {} }) {
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
	const filteredHubs = hubs.filter((hub) => {
		const countryMatch = !filters.country || hub.country === filters.country;
		const managerMatch = !filters.keyAccountManager || hub.keyAccountManager === filters.keyAccountManager;
		const isActive = hub.status ?? true;
		const statusMatch = !filters.status || isActive === (filters.status === "active");
		const searchMatch = !search || [hub.companyName, hub.email, hub.phone, hub.country, hub.keyAccountManager]
			.some((value) => value?.toLowerCase().includes(search));
		return countryMatch && managerMatch && statusMatch && searchMatch;
	});
	const pageCount = Math.ceil(filteredHubs.length / rowsPerPage);
	const safePage = Math.max(0, Math.min(page, pageCount - 1));
	const paginatedHubs = filteredHubs.slice(safePage * rowsPerPage, safePage * rowsPerPage + rowsPerPage);

	const allHubsSelected = filteredHubs.length > 0 && filteredHubs.every((hub) => selected.includes(hub.id));
	const someHubsSelected = filteredHubs.some((hub) => selected.includes(hub.id)) && !allHubsSelected;

	const handleSelectAll = () => {
		if (allHubsSelected) {
			setSelected((previous) => previous.filter((id) => !filteredHubs.some((hub) => hub.id === id)));
		} else {
			setSelected((previous) => [...new Set([...previous, ...filteredHubs.map((hub) => hub.id)])]);
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
									checked={allHubsSelected}
									indeterminate={someHubsSelected}
									onChange={handleSelectAll}
								/>
							</TableCell>
							<TableCell sx={{ whiteSpace: "nowrap" }}>Contact Code</TableCell>
							<TableCell sx={{ whiteSpace: "nowrap" }}>Hub Name</TableCell>
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
						{filteredHubs.length === 0 ? (
							<TableRow>
								<TableCell colSpan={10} sx={{ textAlign: "center", py: 5 }}>
									<Typography variant="body2" color="text.secondary">
										{filteredHubs.length === 0 ? "No hubs found." : "No hubs match these filters."}
									</Typography>
								</TableCell>
							</TableRow>
						) : (
							paginatedHubs.map((hub) => {
								const isSelected = selected.includes(hub.id);
								const isActive = hub.status ?? true;

								return (
									<TableRow key={hub.id} selected={isSelected} hover>
										<TableCell padding="checkbox">
											<Checkbox
												size="small"
												checked={isSelected}
												onChange={() => setSelected((previous) => (
													isSelected
														? previous.filter((id) => id !== hub.id)
														: [...previous, hub.id]
												))}
											/>
										</TableCell>
										<TableCell sx={{ color: "text.secondary", fontFamily: "monospace" }}>
											{String(hub.id).padStart(5, "0")}
										</TableCell>
										<TableCell sx={{ fontWeight: 500 }}>{hub.companyName || "—"}</TableCell>
										<TableCell sx={{ color: "text.secondary" }}>{hub.stationCode || "—"}</TableCell>
										<TableCell sx={{ color: "text.secondary" }}>{hub.email || hub.coordinatorInCharge?.email || "—"}</TableCell>
										<TableCell sx={{ color: "text.secondary" }}>{hub.phone || hub.coordinatorInCharge?.phone || "—"}</TableCell>
										<TableCell sx={{ color: "text.secondary" }}>{hub.country || "—"}</TableCell>
										<TableCell sx={{ color: "text.secondary" }}>{hub.keyAccountManager || "—"}</TableCell>
										<TableCell>
											<Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
												<Switch
													size="small"
													checked={isActive}
													onChange={(event) => onStatusChange?.(hub, event.target.checked)}
													inputProps={{ "aria-label": `Set ${hub.companyName} ${isActive ? "inactive" : "active"}` }}
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
														onClick={() => onView?.(hub)}
													>
														<VisibilityIcon sx={{ fontSize: "1rem" }} />
													</IconButton>
												</Tooltip>
												<Tooltip title="Edit" arrow>
													<IconButton
														size="small"
														color="primary"
														onClick={() => onEdit?.(hub)}
													>
														<EditIcon sx={{ fontSize: "1rem" }} />
													</IconButton>
												</Tooltip>
								<Tooltip title="Delete" arrow>
									<IconButton size="small" color="error" onClick={() => setDeleteTarget(hub)}>
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
					count={filteredHubs.length}
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
				aria-labelledby="delete-hub-title"
				aria-describedby="delete-hub-description"
				fullWidth
				maxWidth="xs"
				slotProps={{ paper: { sx: { borderRadius: 3, p: 1, boxShadow: (theme) => theme.shadows[10] } } }}
			>
				<DialogTitle
					id="delete-hub-title"
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
					<Typography variant="h6" component="h2" fontWeight={700}>Delete hub?</Typography>
				</DialogTitle>
				<DialogContent sx={{ textAlign: "center", pb: 1 }}>
					<Typography id="delete-hub-description" variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
						Are you sure you want to delete{" "}
						{deleteTarget?.companyName ? (
							<Box component="span" sx={{ fontWeight: 600, color: "text.primary" }}>
								“{deleteTarget.companyName}”
							</Box>
						) : (
							"this hub"
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
