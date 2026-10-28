import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Layout from "./components/Layout";
import DashboardPage from "./pages/dashboard/DashBoard";
import UsersIndex from "./pages/master/users/UsersIndex";
import ContactsIndex from "./pages/master/contact-list/ContactsIndex";
import VesselsIndex from "./pages/master/vessels/VesselsIndex";
import HubIndexPage from "./pages/master/hub/HubIndexPage";
import HubLocationsIndex from "./pages/master/hub-locations/HubLocationsIndex";
import VendorsIndex from "./pages/master/vendors/VendorsIndex";
import BanksIndex from "./pages/master/banks/BanksIndex";
import TariffMasterIndex from "./pages/master/tariff-master/TariffMasterIndex";
import AirportCodesIndex from "./pages/master/airport-codes/AirportCodesIndex";
import CurrenciesIndex from "./pages/master/currency/CurrenciesIndex";
import CargoIndex from "./pages/master/cargo/CargoIndex";
import CreateContactPage from "./pages/master/contact-list/ContactCreate";
import CreateStockPage from "./pages/stocks/CreateStockPage";
import StockListPage from "./pages/stocks/StockIndexPage";
import StockFollowUpPage from "./pages/stocks/StockFollowUpPage";
import StockHistoryPage from "./pages/stocks/StockHistoryPage";
import StockViewPage from "./pages/stocks/StockViewPage";
import StockEditPage from "./pages/stocks/StockEditPage";
import GLCodeSubChildrenIndex from "./pages/master/gl-code-subchildren/GLCodeSubChildrenIndex";
import GLCodeChildrenIndex from "./pages/master/gl-code-children/GLCodeChildrenIndex";
import GLCodeParentIndex from "./pages/master/gl-code-parent/GLCodeParentIndex";
import ContactEdit from "./pages/master/contact-list/ContactEdit";
import ContactView from "./pages/master/contact-list/ContactView";
import ClientIndex from "./pages/master/client/ClientIndexPage";

import ManifestIndexPage from "./pages/manifest/ManifestIndex";
import ManifestCreatePage from "./pages/manifest/ManifestCreate";
import ManifestEditPage from "./pages/manifest/ManifestEdit";
import ManifestViewPage from "./pages/manifest/ManifestView";

import PreAlertCreatePage from "./pages/jobs/PreAlertCreatePage";
import PreAlertViewPage from "./pages/jobs/PreAlertViewPage";
import PreAlertEdit from "./pages/jobs/PreAlertEdit";
import PreAlertStage1 from "./pages/jobs/PreAlertStage1";
import PreAlertStage2 from "./pages/jobs/PreAlertStage2";
import PreAlertStage3 from "./pages/jobs/PreAlertStage3";
import PreAlertStage3To4ConfirmationPage from "./pages/jobs/PreAlertStage3To4ConfirmationPage";
import PreAlertStage4 from "./pages/jobs/PreAlertStage4";
import PreAlertAllStage from "./pages/jobs/PreAlertAllStage";
import MainInvoiceCreate from "./pages/invoices/MainInvoiceCreate";
import ExtraInvoiceCreate from "./pages/invoices/ExtraInvoiceCreate";
import ExtraInvoiceEdit from "./pages/invoices/ExtraInvoiceEdit";
import ExtraInvoiceView from "./pages/invoices/ExtraInvoiceView";
import MainInvoiceEdit from "./pages/invoices/MainInvoiceEdit";
import MainInvoiceView from "./pages/invoices/MainInvoiceView";



function App() {

  return (
    <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<LoginPage />} />

                <Route element={<Layout />}>

                  <Route path="/dashboard" element={<DashboardPage />} />

                  <Route path="/master/users" element={<UsersIndex />} />

                  <Route path="/master/client" element={<ClientIndex />} />

                  <Route path="/master/contact-list" element={<ContactsIndex />} />
                  <Route path="/master/contact-list/contact-create" element={<CreateContactPage />} />
                  <Route path="/master/contact-list/contact-edit/:id" element={<ContactEdit />} />
                  <Route path="/master/contact-list/contact-view/:id" element={<ContactView />} />

                  <Route path="/master/vessels" element={<VesselsIndex />} />

                  <Route path="/master/vendors" element={<VendorsIndex />} />
                  <Route path="/master/banks" element={<BanksIndex />} />
                  <Route path="/master/tariff-master" element={<TariffMasterIndex />} />
                  <Route path="/master/airport-codes" element={<AirportCodesIndex />} />
                  <Route path="/master/currency" element={<CurrenciesIndex />} />
                  <Route path="/master/cargo" element={<CargoIndex />} />

                  <Route path="/master/hub" element={<HubIndexPage />} />
                  <Route path="/master/hub-locations" element={<HubLocationsIndex />} />

                  <Route path="/master/gl-code-parent" element={<GLCodeParentIndex />} />
                  <Route path="/master/gl-code-child" element={<GLCodeChildrenIndex />} />
                  <Route path="/master/gl-code-subchild" element={<GLCodeSubChildrenIndex />} />

                  <Route path="/stocks/create-stock" element={<CreateStockPage />} />
                  <Route path="/stocks/stock-list" element={<StockListPage />} />
                  <Route path="/stocks/follow-up" element={<StockFollowUpPage />} />
                  <Route path="/stocks/view/:id" element={<StockViewPage />} />
                  <Route path="/stocks/edit/:id" element={<StockEditPage />} />
                  <Route path="/stocks/history" element={<StockHistoryPage />} />

                  <Route path="/manifest/manifest-create" element={<ManifestCreatePage />} />
                  <Route path="/manifest/manifest-edit/:id" element={<ManifestEditPage />} />
                  <Route path="/manifest/manifest-view/:id" element={<ManifestViewPage />} />
                  <Route path="/manifest" element={<Navigate to="/manifest/manifest-create" replace />} />
                  <Route path="/manifest/manifest-index" element={<ManifestIndexPage />} />
                  
                  <Route path="/jobs/pre-alert-create" element={<PreAlertCreatePage />} />
                  <Route path="/jobs/pre-alert-view/:id" element={<PreAlertViewPage />} />
                  <Route path="/jobs/pre-alert-edit/:id" element={<PreAlertEdit />} />
                  <Route path="/jobs/pre-alert-stage-1" element={<PreAlertStage1 />} />
                  <Route path="/jobs/pre-alert-stage-2" element={<PreAlertStage2 />} />
                  <Route path="/jobs/pre-alert-stage-3" element={<PreAlertStage3 />} />
                  <Route path="/jobs/pre-alert-stage-3-to-4/:id" element={<PreAlertStage3To4ConfirmationPage />} />
                  <Route path="/jobs/pre-alert-stage-4" element={<PreAlertStage4 />} />
                  <Route path="/jobs/pre-alert-all-stages" element={<PreAlertAllStage />} />
                  
                  <Route path="/invoices/main-invoice-create" element={<MainInvoiceCreate />} />
                  <Route path="/invoices/main-invoice-edit" element={<MainInvoiceEdit />} />
                  <Route path="/invoices/main-invoice-view" element={<MainInvoiceView />} />
                  <Route path="/invoices/extra-invoice-create" element={<ExtraInvoiceCreate />} />
                  <Route path="/invoices/extra-invoice-edit" element={<ExtraInvoiceEdit />} />
                  <Route path="/invoices/extra-invoice-view" element={<ExtraInvoiceView />} />

                </Route>
            </Routes>
      </BrowserRouter>

  );
   
}

export default App
