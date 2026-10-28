import { Navigate, useLocation, useNavigate } from "react-router-dom";
import ManifestCreatePage from "./ManifestCreate";
import type { Manifest, ManifestFormValues, ManifestStockRow } from "./types/manifest.types";

type ManifestEditLocationState = {
  manifest?: Manifest;
  stocks?: ManifestStockRow[];
  initialValues?: Partial<ManifestFormValues>;
};

export default function ManifestEditPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as ManifestEditLocationState | null;
  const manifest = state?.manifest;

  if (!manifest) return <Navigate to="/manifest/manifest-index" replace />;

  const handleSubmit = (values: ManifestFormValues & { stocks: ManifestStockRow[] }) => {
    saveManifest({
      ...manifest,
      ...values,
      id: manifest.id,
      manifestNumber: values.manifestNumber || manifest.manifestNumber || String(manifest.id),
      stocks: values.stocks,
      updated_at: new Date().toISOString().slice(0, 10),
    });
    navigate("/manifest/manifest-index", { replace: true });
  };

  const initialValues: Partial<ManifestFormValues> = {
    manifestNumber: manifest.manifestNumber ?? String(manifest.id),
    client: manifest.client,
    vessel: manifest.vessel,
    stationCode: manifest.stationCode,
    mode: manifest.mode,
    activation: manifest.activation,
    deadline: manifest.deadline,
    originAirportCode: manifest.originAirportCode,
    customerPoRef: manifest.customerPoRef,
    stockOrigin: manifest.stockOrigin,
    consignee: manifest.consignee,
    country: manifest.country,
    destinationAirportCode: manifest.destinationAirportCode,
    email: manifest.email,
    telephone: manifest.telephone,
    consigneeAddress: manifest.consigneeAddress,
    notifyParty: manifest.notifyParty,
  };

  return <ManifestCreatePage title="Edit Manifest" initialValues={initialValues} onSubmit={handleSubmit} />;
}
