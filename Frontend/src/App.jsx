import { useState, useEffect } from "react";
import InputArea from "./components/InputArea";
import LoginPage from "./pages/LoginPage";
import AuthorizedPage from "./pages/AuthorizedPage";
import Dashboard from "./pages/Dashboard";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
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
import SalesReport from "./components/Reports/SalesReport";
import FastMovingMedicineReport from "./components/Reports/FastMovingMedicineReport";
import PCSidebar from "./components/RoleBasedRender/PurchasingClerk/PCSidebar";
import PCInventoryListOfMedicine from "./components/RoleBasedRender/PurchasingClerk/PCInventoryListofMedicine";
import PCMedicineGroups from "./components/RoleBasedRender/PurchasingClerk/PCMedicineGroups";
import ICSidebar from "./components/RoleBasedRender/InventoryClerk/ICSidebar";

function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

export default function App() {
  const [currentUser, setCurrentUser] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      try {
        const decoded = parseJwt(token);
        setCurrentUser(decoded.userRole);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [token]);

  return (
    <Router>
      <AuthContextProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Sidebar />
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/authorize" element={<AuthorizedPage />} />
          <Route path="/unauthorized" element={<UnAuthorizedPage />} />
          <Route
            path="/inventoryListofmedicine"
            element={
              <ProtectedRoute>
                <Sidebar />
                <InventoryListOfMedicine />
              </ProtectedRoute>
            }
          />
          <Route
            path="/grn"
            element={
              <ProtectedRoute>
                <Sidebar />
                <GRN />
              </ProtectedRoute>
            }
          />
          <Route
            path="/invoice"
            element={
              <ProtectedRoute>
                <Sidebar />
                <Invoices />
              </ProtectedRoute>
            }
          />
          <Route
            path="/medicinegroups"
            element={
              <ProtectedRoute>
                <Sidebar />
                <MedicineGroups />
              </ProtectedRoute>
            }
          />
          <Route path="/nav" element={<NavBar />} />
          <Route
            path="/invoicebill"
            element={
              <ProtectedRoute>
                <Sidebar />
                <InvoiceBill />
              </ProtectedRoute>
            }
          />
          <Route
            path="/requestOrder"
            element={
              <ProtectedRoute>
                <Sidebar />
                <RequestOrder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/userManagement"
            element={
              <ProtectedRoute>
                <Sidebar />
                <Users />
              </ProtectedRoute>
            }
          />
          <Route
            path="/salesReport"
            element={
              <ProtectedRoute>
                <Sidebar />
                <SalesReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/fastmovingMedicineReport"
            element={
              <ProtectedRoute>
                <Sidebar />
                <FastMovingMedicineReport />
              </ProtectedRoute>
            }
          />

          <Route
            path="/PC-dashboard"
            element={
              <AuthPC>
                <PCSidebar />
              </AuthPC>
            }
          />
          <Route
            path="/PC-inventorylistofmedicine"
            element={
              <AuthPC>
                <PCSidebar />
                <PCInventoryListOfMedicine />
              </AuthPC>
            }
          />
          <Route
            path="/PC-medicinegroups"
            element={
              <AuthPC>
                <PCSidebar />
                <PCMedicineGroups />
              </AuthPC>
            }
          />
          <Route
            path="/PC-requestorder"
            element={
              <AuthPC>
                <PCSidebar />
                <RequestOrder />
              </AuthPC>
            }
          />

          <Route path="/IC-dashboard" element={<ICSidebar />} />

          <Route
            path="/IC-inventorylistofmedicine"
            element={
              <>
                <ICSidebar />
                <PCInventoryListOfMedicine />
              </>
            }
          />
          <Route
            path="/IC-medicinegroups"
            element={
              <>
                <ICSidebar />
                <PCMedicineGroups />
              </>
            }
          />
          <Route
            path="/IC-grn"
            element={
              <>
                <ICSidebar />
                <GRN />
              </>
            }
          />
        </Routes>
      </AuthContextProvider>
    </Router>
  );
}

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/" />;
  }

  try {
    parseJwt(token); // Verify token is valid
    return children;
  } catch (error) {
    console.error("Invalid token:", error);
    return <Navigate to="/" />;
  }
}

function AuthPC({ children }) {
  const token = localStorage.getItem("token");
  if (token) {
    const decoded = parseJwt(token);
    console.log("toke", decoded);
    if (decoded.role == 3) {
      return children;
    }
  }
  return <Navigate to="/unauthorized" />;
}

function AuthIC({ children }) {
  const token = localStorage.getItem("token");
  if (token) {
    const decoded = parseJwt(token);
    if (decoded.userRole === "2") {
      return children;
    }
  }
  return <Navigate to="/unauthorized" />;
}

function AuthCashier({ children }) {
  const token = localStorage.getItem("token");
  if (token) {
    const decoded = parseJwt(token);
    if (decoded.userRole === "1") {
      return children;
    }
  }
  return <Navigate to="/unauthorized" />;
}

function AuthStaff({ children }) {
  const token = localStorage.getItem("token");
  if (token) {
    const decoded = parseJwt(token);
    if (decoded.userRole === "4") {
      return children;
    }
  }
  return <Navigate to="/unauthorized" />;
}
