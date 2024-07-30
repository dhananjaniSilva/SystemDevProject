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
import CashierSidebar from "./components/RoleBasedRender/Cashier/CashierSidebar";
import StaffSidebar from "./components/RoleBasedRender/Staff/StaffSidebar";
import ICInventoryListOfMedicine from "./components/RoleBasedRender/InventoryClerk/ICInventoryListofMedicine";
import ICMedicineGroups from "./components/RoleBasedRender/InventoryClerk/ICMedicineGroups";

// Function to parse JWT token
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
// State to hold current user role
  const [currentUser, setCurrentUser] = useState(''); 
// Get token from local storage
  const token = localStorage.getItem("token");

// Effect to decode token and set current user role
  useEffect(() => {
    if (token) {
      try {
        const decoded = parseJwt(token);
        setCurrentUser(decoded.userRole); // Set user role
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [token]);

  // routes for each tabs
  return (
    <Router>
      <AuthContextProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <AuthAdmin>
                <Sidebar />
                <Dashboard />
              </AuthAdmin>
            }
          />
          <Route path="/authorize" element={<AuthorizedPage />} />
          <Route path="/unauthorized" element={<UnAuthorizedPage />} />
          <Route
            path="/inventoryListofmedicine"
            element={
              <AuthAdmin>
                <Sidebar />
                <InventoryListOfMedicine />
              </AuthAdmin>
            }
          />
          <Route
            path="/grn"
            element={
              <AuthAdmin>
                <Sidebar />
                <GRN />
              </AuthAdmin>
            }
          />
          <Route
            path="/invoice"
            element={
              <AuthAdmin>
                <Sidebar />
                <Invoices />
              </AuthAdmin>
            }
          />
          <Route
            path="/medicinegroups"
            element={
              <AuthAdmin>
                <Sidebar />
                <MedicineGroups />
              </AuthAdmin>
            }
          />
          <Route path="/nav" element={<NavBar />} />
          <Route
            path="/invoicebill"
            element={
              <AuthAdmin>
                <Sidebar />
                <InvoiceBill />
              </AuthAdmin>
            }
          />
          <Route
            path="/requestOrder"
            element={
              <AuthAdmin>
                <Sidebar />
                <RequestOrder />
              </AuthAdmin>
            }
          />
          <Route
            path="/userManagement"
            element={
              <AuthAdmin>
                <Sidebar />
                <Users />
              </AuthAdmin>
            }
          />
          <Route
            path="/salesReport"
            element={
              <AuthAdmin>
                <Sidebar />
                <SalesReport />
              </AuthAdmin>
            }
          />
          <Route
            path="/fastmovingMedicineReport"
            element={
              <AuthAdmin>
                <Sidebar />
                <FastMovingMedicineReport />
              </AuthAdmin>
            }
          />

          <Route         // Routes based on user roles
            path="/PC-dashboard"
            element={
              <AuthPC>
                <Dashboard />
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

          <Route
            path="/IC-dashboard"
            element={
              <>
                <AuthIC>
                  <ICSidebar />
                  <Dashboard />
                </AuthIC>
              </>
            }
          />

          <Route
            path="/IC-inventorylistofmedicine"
            element={
              <>
                <AuthIC>
                  <ICSidebar />
                  <ICInventoryListOfMedicine />
                </AuthIC>
              </>
            }
          />
          <Route
            path="/IC-medicinegroups"
            element={
              <>
                <AuthIC>
                  <ICSidebar />
                  <ICMedicineGroups />
                </AuthIC>
              </>
            }
          />
          <Route
            path="/IC-grn"
            element={
              <>
                <AuthIC>
                  <ICSidebar />
                  <GRN />
                </AuthIC>
              </>
            }
          />

          <Route
            path="/C-dashboard"
            element={
              <>
                <AuthCashier>
                  <CashierSidebar />
                  <Dashboard />
                </AuthCashier>
              </>
            }
          />
          <Route
            path="/C-inventorylistofmedicine"
            element={
              <>
                <AuthCashier>
                  <CashierSidebar />
                  <PCInventoryListOfMedicine />
                </AuthCashier>
              </>
            }
          />
          <Route
            path="/C-medicinegroups"
            element={
              <>
                <AuthCashier>
                  <CashierSidebar />
                  <PCMedicineGroups />
                </AuthCashier>
              </>
            }
          />
          <Route
            path="/C-invoicebill"
            element={
              <>
                <AuthCashier>
                  <CashierSidebar />
                  <InvoiceBill />
                </AuthCashier>
              </>
            }
          />

          <Route
            path="/S-dashboard"
            element={
              <>
                <AuthStaff>
                  <Dashboard/>
                  <StaffSidebar />
                </AuthStaff>
              </>
            }
          />
          <Route
            path="/S-inventorylistofmedicine"
            element={
              <>
                <AuthStaff>
                  <PCInventoryListOfMedicine />
                  <StaffSidebar />
                </AuthStaff>
              </>
            }
          />
          <Route
            path="/S-medicinegroups"
            element={
              <>
                <AuthStaff>
                  <StaffSidebar />
                  <PCMedicineGroups />
                </AuthStaff>
              </>
            }
          />
        </Routes>
      </AuthContextProvider>
    </Router>
  );
}

// These are the protected routes for the User roles
// Users roles are checking by the decoded tokens 'roleID'
function AuthAdmin({ children }) {
  const token = localStorage.getItem("token");
  if (token) {
    const decoded = parseJwt(token);
    console.log("toke", decoded);
    if (decoded.role == 1) { // Check if role is Admin
      return children;
    }
  }
  return <Navigate to="/" />; // Redirect to login if not authorized
}

// Function to protect routes for Purchasing Clerk role
function AuthPC({ children }) {
  const token = localStorage.getItem("token");
  if (token) {
    const decoded = parseJwt(token);
    console.log("toke", decoded);
    if (decoded.role == 3) { // Check if role is Purchasing Clerk
      return children;
    }
  }
  return <Navigate to="/" />; // Redirect to login if not authorized
}

// Function to protect routes for Inventory Clerk role
function AuthIC({ children }) {
  const token = localStorage.getItem("token");
  if (token) {
    const decoded = parseJwt(token);
    if (decoded.role == 4) {
      return children;
    }
  }
  return <Navigate to="/" />;
}

// Function to protect routes for Cashier role
function AuthCashier({ children }) {
  const token = localStorage.getItem("token");
  if (token) {
    const decoded = parseJwt(token);
    if (decoded.role == 2) { 
      // Ensure you check `userRole` instead of `role`
      return children;
    }
  }
  return <Navigate to="/" />;
}

// Function to protect routes for Staff role
function AuthStaff({ children }) {
  const token = localStorage.getItem("token");
  if (token) {
    const decoded = parseJwt(token);
    if (decoded.role == 5) { 
      return children;
    }
  }
  return <Navigate to="/" />; // Redirect to login if not authorized
}
