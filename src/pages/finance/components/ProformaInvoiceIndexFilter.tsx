import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import { Box, InputAdornment, MenuItem, TextField, Typography } from "@mui/material";
import { useMemo, useState, type ReactNode } from "react";
import type { ProformaInvoice } from "../types/proformaInvoice.types";

type ProformaInvoiceIndexFilterProps = {
  invoices: ProformaInvoice[];
  children: (filteredInvoices: ProformaInvoice[], hasActiveFilters: boolean) => ReactNode;
};

const fieldSx = {
  minWidth: 0,
  "& .MuiOutlinedInput-root": {
    backgroundColor: "background.paper",
    borderRadius: 2,
  },
};

export default function ProformaInvoiceIndexFilter({
  invoices,
  children,
}: ProformaInvoiceIndexFilterProps) {
  const [search, setSearch] = useState("");
  const [client, setClient] = useState("");
  const [manifestNumber, setManifestNumber] = useState("");
  const [vessel, setVessel] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const clients = useMemo(
    () => [...new Set(invoices.map((invoice) => invoice.client).filter(Boolean))].sort(),
    [invoices],
  );
  const manifests = useMemo(
    () => [...new Set(invoices.map((invoice) => invoice.manifestNumber).filter(Boolean))].sort(),
    [invoices],
  );
  const vessels = useMemo(
    () => [...new Set(invoices.map((invoice) => invoice.vesselName).filter(Boolean))].sort(),
    [invoices],
  );

  const filteredInvoices = useMemo(
    () =>
      invoices.filter((invoice) => {
        const query = search.trim().toLowerCase();
        const matchesSearch =
          !query ||
          [
            invoice.id,
            invoice.client,
            invoice.clientPoNumber,
            invoice.vesselName,
            invoice.manifestNumber,
            invoice.invoiceDate,
            invoice.paymentTerms,
            invoice.currency,
          ].some((value) => value.toLowerCase().includes(query));
        const invoiceDate = invoice.invoiceDate.slice(0, 10);

        return (
          matchesSearch &&
          (!client || invoice.client === client) &&
          (!manifestNumber || invoice.manifestNumber === manifestNumber) &&
          (!vessel || invoice.vesselName === vessel) &&
          (!dateFrom || invoiceDate >= dateFrom) &&
          (!dateTo || invoiceDate <= dateTo)
        );
      }),
    [client, dateFrom, dateTo, invoices, manifestNumber, search, vessel],
  );

  const hasActiveFilters = Boolean(
    search.trim() || client || manifestNumber || vessel || dateFrom || dateTo,
  );

  return (
    <>
      <Box sx={{ py: 2, backgroundColor: "background.default" }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, minmax(0, 1fr))",
              md: "repeat(3, minmax(0, 1fr))",
              lg: "auto repeat(6, minmax(100px, 1fr))",
            },
            gap: 0.5,
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              whiteSpace: "nowrap",
              gridColumn: { xs: "span 2", md: "span 3", lg: "auto" },
            }}
          >
            <FilterListIcon sx={{ color: "text.secondary", fontSize: 20 }} />
            <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600 }}>
              Filters
            </Typography>
          </Box>
          <TextField
            placeholder="Search..."
            size="small"
            fullWidth
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
            sx={fieldSx}
          />
          <TextField
            select
            label="Client"
            size="small"
            fullWidth
            value={client}
            onChange={(event) => setClient(event.target.value)}
            sx={fieldSx}
          >
            <MenuItem value="">All</MenuItem>
            {clients.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Manifest No"
            size="small"
            fullWidth
            value={manifestNumber}
            onChange={(event) => setManifestNumber(event.target.value)}
            sx={fieldSx}
          >
            <MenuItem value="">All</MenuItem>
            {manifests.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Vessel"
            size="small"
            fullWidth
            value={vessel}
            onChange={(event) => setVessel(event.target.value)}
            sx={fieldSx}
          >
            <MenuItem value="">All</MenuItem>
            {vessels.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Date From"
            type="date"
            size="small"
            fullWidth
            value={dateFrom}
            onChange={(event) => setDateFrom(event.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={fieldSx}
          />
          <TextField
            label="Date To"
            type="date"
            size="small"
            fullWidth
            value={dateTo}
            onChange={(event) => setDateTo(event.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={fieldSx}
          />
        </Box>
      </Box>
      {children(filteredInvoices, hasActiveFilters)}
    </>
  );
}
