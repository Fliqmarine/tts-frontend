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

                  z

                </Route>
            </Routes>
      </BrowserRouter>

  );
   
}

export default App
