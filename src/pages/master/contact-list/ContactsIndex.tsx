import { useState } from "react";
import { Stack } from "@mui/material";
import ContactsIndexHeader from "./components/Header";
import ContactsIndexFilter from "./components/Filter";
import ContactsIndexTable from "./components/Table";
import type { ContactFilters } from "./components/Table";
import type { Contact } from "./types/contact.types";

export default function ContactsIndex() {
  const [filters, setFilters] = useState<ContactFilters>({});

  const handleDelete = (contact: Contact) => {
    // TODO: open a confirmation dialog then call deleteContact(contact.id)
    console.log("Delete contact:", contact.id);
  };

  return (
    <Stack spacing={1}>
      <ContactsIndexHeader />

      <ContactsIndexFilter
        filters={filters}
        onFilterChange={setFilters}
      />

      <ContactsIndexTable
        filters={filters}
        onDelete={handleDelete}
      />
    </Stack>
  );
}