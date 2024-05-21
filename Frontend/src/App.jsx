import { useState, useEffect } from "react";
import "./App.css";
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

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Router>
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
               <NavBar/>
              </>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
