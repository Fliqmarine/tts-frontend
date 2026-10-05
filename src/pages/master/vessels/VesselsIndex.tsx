import { useMemo, useState } from "react";
import VesselIndexHeader from "./components/Header";
import VesselIndexFilter from "./components/Filter";
import VesselIndexTable, { DEMO_VESSELS, type Vessel } from "./components/Table";
import VesselDialog from "./components/VesselDialog";
import { INITIAL_VESSEL_STATE, type VesselFormState } from "./types/vessel.types";
import { Box } from "@mui/material";

export default function VesselsIndex() {
    const [activeOnly, setActiveOnly] = useState(false);
    const [search, setSearch] = useState("");
    const [vessels, setVessels] = useState<Vessel[]>(DEMO_VESSELS);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editingVessel, setEditingVessel] = useState<Vessel | null>(null);

    const handleVesselSaved = (form: VesselFormState) => {
        setVessels((current) => {
            if (editingVessel) {
                return current.map((vessel) =>
                    vessel.id === editingVessel.id
                        ? {
                              ...vessel,
                              vesselName: form.vesselName.trim(),
                              clientName: form.clientId.trim() || "—",
                              imoNo: form.imoNo.trim(),
                              picName: form.clientPic.name.trim(),
                              picEmail: form.clientPic.email.trim(),
                              formData: form,
                          }
                        : vessel,
                );
            }

            const id = Math.max(0, ...current.map((vessel) => vessel.id)) + 1;
            return [
                ...current,
                {
                    id,
                    vesselName: form.vesselName.trim(),
                    clientName: form.clientId.trim() || "—",
                    vesselCode: "—",
                    imoNo: form.imoNo.trim(),
                    picName: form.clientPic.name.trim(),
                    picEmail: form.clientPic.email.trim(),
                    isActive: true,
                    formData: form,
                },
            ];
        });
    };

    const handleEditVessel = (vessel: Vessel) => {
        setEditingVessel(vessel);
        setCreateDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setCreateDialogOpen(false);
        setEditingVessel(null);
    };

    const initialValues = useMemo(
        () =>
            editingVessel
                ? {
                      ...INITIAL_VESSEL_STATE,
                      ...editingVessel.formData,
                      vesselName: editingVessel.vesselName,
                      clientId: editingVessel.formData?.clientId ?? editingVessel.clientName,
                      imoNo: editingVessel.imoNo,
                      clientPic: {
                          ...INITIAL_VESSEL_STATE.clientPic,
                          ...editingVessel.formData?.clientPic,
                          name: editingVessel.formData?.clientPic.name ?? editingVessel.picName,
                          email: editingVessel.formData?.clientPic.email ?? editingVessel.picEmail,
                      },
                      supt: {
                          ...INITIAL_VESSEL_STATE.supt,
                          ...editingVessel.formData?.supt,
                      },
                  }
                : null,
        [editingVessel],
    );

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <VesselIndexHeader
                onCreate={() => {
                    setEditingVessel(null);
                    setCreateDialogOpen(true);
                }}
            />
            <VesselIndexFilter
                activeOnly={activeOnly}
                onActiveChange={setActiveOnly}
                search={search}
                onSearchChange={setSearch}
            />
            <VesselIndexTable
                vessels={vessels}
                setVessels={setVessels}
                onEdit={handleEditVessel}
                filters={{ search, active: activeOnly ? true : undefined }}
            />
            {createDialogOpen && (
                <VesselDialog
                    open={createDialogOpen}
                    onClose={handleCloseDialog}
                    onSaved={handleVesselSaved}
                    initialValues={initialValues}
                />
            )}
        </Box>
    );
}