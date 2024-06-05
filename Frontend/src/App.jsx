import { useState, useEffect } from "react";
import InputArea from "./components/InputArea";
import LoginPage from "./pages/LoginPage";
import AuthorizedPage from "./pages/AuthorizedPage";
import Dashboard from "./pages/Dashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UnAuthorizedPage from "./pages/UnAuthorized";
import Sidebar from "./pages/Sidebar";
import InventoryListOfMedicine from "./pages/InventoryListOfMedicine";
import MedicineGroups from "./pages/MedicineGroups";
import NavBar from "./components/NavBar";
import Invoices from "./pages/Invoices";
import InvoiceBill from "./pages/InvoiceBill";
import AuthContextProvider from "./contexts/AuthContextProvider";
import GRN from "./pages/GRN";
import "./App.css";
import RequestOrder from "./pages/RequestOrder";
import Users from "./pages/Users";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Router>
        <AuthContextProvider>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={
                <>
                  <Dashboard />
                  <Sidebar />
                </>
              }
            />
            <Route path="/authorize" element={<AuthorizedPage />} />
            <Route path="/unauthorized" element={<UnAuthorizedPage />} />
            <Route
              path="/inventoryListofmedicine"
              element={
                <>
                  <InventoryListOfMedicine />
                  <Sidebar />
                </>
              }
            />

            <Route
              path="/grn"
              element={
                <>
                  <GRN />
                  <Sidebar />
                </>
              }
            />
            <Route
              path="/invoice"
              element={
                <>
                  <Invoices />
                  <Sidebar />
                </>
              }
            />
            <Route
              path="/medicinegroups"
              element={
                <>
                  <MedicineGroups />
                  <Sidebar />
                </>
              }
            />
            <Route
              path="/nav"
              element={
                <>
                  <NavBar />
                </>
              }
            />
            <Route
              path="/invoicebill"
              element={
                <>
                  <Sidebar />
                  <InvoiceBill />
                </>
              }
            />
            <Route
              path="/requestOrder"
              element={
                <>
                  <Sidebar />
                  <RequestOrder />
                </>
              }
            />
             <Route
              path="/userManagement"
              element={
                <>
                  <Sidebar />
                  <Users />
                </>
              }
            />
          </Routes>
        </AuthContextProvider>
      </Router>
    </>
  );
}

export default App;
