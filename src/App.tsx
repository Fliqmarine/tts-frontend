import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Layout from "./components/Layout";
import DashboardPage from "./pages/dashboard/DashBoard";
import UsersIndex from "./pages/master/users/UsersIndex";
import ContactsIndex from "./pages/master/contact-list/ContactsIndex";
import VesselsIndex from "./pages/master/vessels/VesselsIndex";
import VesselCreate from "./pages/master/vessels/VesselCreate";
import HubIndex from "./pages/master/hub/HubIndex";
import VendorsIndex from "./pages/master/vendors/VendorsIndex";
import BanksIndex from "./pages/master/banks/BanksIndex";
import TariffMasterIndex from "./pages/master/tariff-master/TariffMasterIndex";
import AirportCodesIndex from "./pages/master/airport-codes/AirportCodesIndex";
import CurrenciesIndex from "./pages/master/currency/CurrenciesIndex";
import CargoIndex from "./pages/master/cargo/CargoIndex";
import CreateContactPage from "./pages/master/contact-list/ContactCreate";
import CreateStockPage from "./pages/stocks/CreateStockPage";
import StockListPage from "./pages/stocks/StockListPage";
import FollowUpPage from "./pages/stocks/FollowUpPage";
import StockHistoryPage from "./pages/stocks/StockHistoryPage";
import GLCodeSubChildrenIndex from "./pages/master/finance-master/gl-code-subchildren/GLCodeSubChildrenIndex";
import GLCodeChildrenIndex from "./pages/master/finance-master/gl-code-children/GLCodeChildrenIndex";
import GLCodeParentIndex from "./pages/master/finance-master/gl-code-parent/GLCodeParentIndex";
import ContactEdit from "./pages/master/contact-list/ContactEdit";
import VesselEdit from "./pages/master/vessels/VesselEdit";



function App() {


  return (
    <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<LoginPage />} />

                <Route element={<Layout />}>
                    <Route path="/dashboard" element={<DashboardPage />} />

                    <Route path="/master/users" element={<UsersIndex />} />

                    <Route path="/master/contact-list" element={<ContactsIndex />} />
                    <Route path="/master/contact-list/contact-create" element={<CreateContactPage />} />
                    <Route path="/master/contact-list/contact-edit/:id" element={<ContactEdit />} />

                    <Route path="/master/vessels" element={<VesselsIndex />} />
                    <Route path="/master/vessels/vessel-create" element={<VesselCreate />} />
                    <Route path="/master/vessels/vessel-edit/:id" element={<VesselEdit />} />

                    <Route path="/master/vendors" element={<VendorsIndex />} />
                    <Route path="/master/banks" element={<BanksIndex />} />
                    <Route path="/master/tariff-master" element={<TariffMasterIndex />} />
                    <Route path="/master/airport-codes" element={<AirportCodesIndex />} />
                    <Route path="/master/currency" element={<CurrenciesIndex />} />
                    <Route path="/master/cargo" element={<CargoIndex />} />
                    

                    <Route path="/master/hub" element={<HubIndex />} />


                    <Route path="/master/finance-master/gl-code-parent" element={<GLCodeParentIndex />} />
                    <Route path="/master/finance-master/gl-code-child" element={<GLCodeChildrenIndex />} />
                    {/* <Route path="/master/finance-master/gl-code-children" element={<GLCodeChildrenIndex />} /> */}
                    <Route path="/master/finance-master/gl-code-subchild" element={<GLCodeSubChildrenIndex />} />
                    {/* <Route path="/master/finance-master/gl-code-subchildren" element={<GLCodeSubChildrenIndex />} /> */}




                    <Route path="/stocks/create-stock" element={<CreateStockPage />} />
                    <Route path="/stocks/stock-list" element={<StockListPage />} />
                    <Route path="/stocks/follow-up" element={<FollowUpPage />} />
                    <Route path="/stocks/history" element={<StockHistoryPage />} />
                </Route>
            </Routes>
      </BrowserRouter>

  );
   
}

export default App
