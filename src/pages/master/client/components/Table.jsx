import { useState } from "react";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
	Box,
	Button,
	Checkbox,
	IconButton,
	Paper,
	Switch,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableFooter,
	TableHead,
	TablePagination,
	TableRow,
	Tooltip,
	Typography,
} from "@mui/material";

export default function ClientIndexTable({ clients = [], onDelete, onEdit, onView, onStatusChange, filters = {} }) {
	const [selected, setSelected] = useState([]);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

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
					<Box sx={{ display: "flex", gap: 1 }}>
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
				sx={{ border: "1px solid", borderColor: "divider", overflow: "hidden" }}
			>
				<Table size="small">
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
													<IconButton size="small" color="error" onClick={() => onDelete?.(client)}>
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

					<TableFooter>
						<TableRow>
							<TablePagination
								colSpan={10}
								count={filteredClients.length}
								page={safePage}
								rowsPerPage={rowsPerPage}
								rowsPerPageOptions={[5, 10, 25]}
								onPageChange={(_, nextPage) => setPage(nextPage)}
								onRowsPerPageChange={(event) => {
									setRowsPerPage(Number.parseInt(event.target.value, 10));
									setPage(0);
								}}
							/>
						</TableRow>
					</TableFooter>
				</Table>
			</TableContainer>
		</Box>
	);
}
