import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import { Autocomplete, Box, MenuItem, TextField, Typography } from "@mui/material";
import { getCountries } from "react-phone-number-input";
import en from "react-phone-number-input/locale/en.json";

const countries = getCountries().map((code) => ({
	code,
	label: en[code] || code,
}));

export default function HubIndexFilter({ filters, onFilterChange, keyAccountManagers = [] }) {
	const handleChange = (key, value) => {
		onFilterChange({ ...filters, [key]: value || "" });
	};

	const selectedCountry = countries.find(({ code }) => code === filters.country) ?? null;
	const selectedManager = keyAccountManagers.find((manager) => manager === filters.keyAccountManager) ?? null;

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: { xs: "column", sm: "row" },
				flexWrap: "wrap",
				gap: 2,
				alignItems: { sm: "center" },
			}}
		>
			<Box sx={{ display: "flex", alignItems: "center", gap: 1, mr: 1 }}>
				<FilterListIcon sx={{ color: "text.secondary", fontSize: 20 }} />
				<Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600, whiteSpace: "nowrap" }}>
					Filters
				</Typography>
			</Box>

			<Box sx={{ position: "relative", width: { xs: "100%", sm: 280 } }}>
				<TextField
					placeholder="Search hubs by name, email, or phone..."
					size="small"
					fullWidth
					value={filters.search ?? ""}
					onChange={(event) => handleChange("search", event.target.value)}
					sx={{
						"& .MuiOutlinedInput-root": { borderRadius: 2, pl: 1 },
						"& .MuiOutlinedInput-input": { pl: 4 },
					}}
				/>
				<SearchIcon
					sx={{
						position: "absolute",
						left: 12,
						top: "50%",
						transform: "translateY(-50%)",
						fontSize: 20,
						color: "text.disabled",
						pointerEvents: "none",
					}}
				/>
			</Box>

			<Autocomplete
				size="small"
				options={countries}
				getOptionLabel={(option) => option.label}
				value={selectedCountry}
				onChange={(_, option) => handleChange("country", option?.code ?? "")}
				renderInput={(params) => <TextField {...params} label="Country" />}
					sx={{ width: { xs: "100%", sm: 190 }, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
			/>

				<Autocomplete
					size="small"
					options={keyAccountManagers}
					value={selectedManager}
					onChange={(_, manager) => handleChange("keyAccountManager", manager)}
					renderInput={(params) => <TextField {...params} label="Key Account Manager" />}
					sx={{ width: { xs: "100%", sm: 220 }, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
				/>

				<TextField
					select
					size="small"
					label="Status"
					value={filters.status ?? ""}
					onChange={(event) => handleChange("status", event.target.value)}
					sx={{ width: { xs: "100%", sm: 160 }, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
				>
					<MenuItem value="">All statuses</MenuItem>
					<MenuItem value="active">Active</MenuItem>
					<MenuItem value="inactive">Inactive</MenuItem>
				</TextField>
		</Box>
	);
}
