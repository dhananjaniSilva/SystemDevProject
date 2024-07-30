import { useEffect, useState } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import "../stylings/pages/sidebar.css";
import logo from "../assets/logo.png";
import logowithtext from "../assets/logotext.png";
import SidebarBtn from "../components/SidebarBtn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";
import {
  faPager,
  faList,
  faArrowTrendUp,
  faBell,
  faGear,
  faEllipsisVertical,
  faIceCream,
  faNewspaper,
  faNoteSticky,
  faCodePullRequest,
  faFileInvoice,
  faUserAstronaut,
  faDoorOpen,
} from "@fortawesome/free-solid-svg-icons";

function Sidebar() {
  // Retrieve user information from local storage
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  // State management for sidebar visibility and section toggles
  const [show, setShow] = useState(true);
  const [isVisibleinv, setIsVisibleinv] = useState(false); // Inventory section visibility
  const [isVisiblereports, setIsVisiblereports] = useState(false); // Reports section visibility
  const navigate = useNavigate();

  // Function to toggle inventory section visibility
  const handleVisibilityinv = () => {
    if (isVisiblereports && !isVisibleinv) {
      setIsVisibleinv(!isVisibleinv);
      setIsVisiblereports(false);
    } else {
      setIsVisibleinv(!isVisibleinv);
    }
  };

  // Function to toggle reports section visibility
  const handleVisibilityreports = () => {
    if (isVisibleinv && !isVisiblereports) {
      setIsVisiblereports(!isVisiblereports);
      setIsVisibleinv(false);
    } else {
      setIsVisiblereports(!isVisiblereports);
    }
  };

  // Function to navigate to a different path
  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <>
      <Offcanvas
        name="Disable backdrop"
        scroll={true}
        backdrop={false}
        bsPrefix="offcanvas"
        show={show}
        onHide={() => setShow(false)}
        id="sidebar"
      >
        <Offcanvas.Header className="sidebar-header">
          {/* Display logos in the sidebar header */}
          <img src={logo} alt="Logo" />
          <img src={logowithtext} alt="Logo with text" />
        </Offcanvas.Header>
        <Offcanvas.Body className="sidebar-body">
          <div className="top">
            <div>
              <h5>{username}</h5>
              <p>{role}</p>
            </div>
            <div style={{ height: "40px" }}>
              <Button
                style={{
                  backgroundColor: "transparent",
                  border: "transparent solid 1px",
                  width: "20px",
                }}
                onClick={() => setShow(!show)} // Toggle sidebar visibility
              >
                <FontAwesomeIcon icon={faEllipsisVertical} />
              </Button>
            </div>
          </div>
          <Box height={"80%"}>
            {/* Sidebar buttons with icons and text */}
            <SidebarBtn
              icon={faPager}
              text="Dashboard"
              onClick={() => handleNavigate("/dashboard")}
            />
            <SidebarBtn
              icon={faList}
              text={"Inventory"}
              onClick={handleVisibilityinv}
            />

            {/* Conditional rendering of inventory buttons */}
            {isVisibleinv && (
              <div className="button-group">
                <SidebarBtn
                  text={"List of Medicines"}
                  onClick={() => handleNavigate("/inventoryListofmedicine")}
                />
                <SidebarBtn
                  text={"Medicine Categories"}
                  onClick={() => handleNavigate("/medicineGroups")}
                />
              </div>
            )}
            <SidebarBtn
              icon={faNoteSticky}
              text="GRN"
              onClick={() => handleNavigate("/grn")}
            />
            <SidebarBtn
              icon={faArrowTrendUp}
              text={"Reports"}
              onClick={handleVisibilityreports}
            />

            {/* Conditional rendering of report buttons */}
            {isVisiblereports && (
              <div className="button-group">
                <SidebarBtn
                  text={"Sales Report"}
                  onClick={() => handleNavigate("/salesReport")}
                />
                <SidebarBtn
                  text={"Demand Analysing Report"}
                  onClick={() => handleNavigate("/fastmovingMedicineReport")}
                />
              </div>
            )}

            <SidebarBtn
              icon={faNewspaper}
              text={"Invoice Bill"}
              onClick={() => handleNavigate("/invoicebill")}
            />
            <SidebarBtn
              icon={faFileInvoice}
              text={"Request Order"}
              onClick={() => handleNavigate("/requestOrder")}
            />
            <SidebarBtn
              icon={faUserAstronaut}
              text={"User Management"}
              onClick={() => handleNavigate("/userManagement")}
            />
          </Box>
          <Box flexGrow={1} />
          <Box height={"10%"} width={"100%"}>
            {/* Logout button */}
            <SidebarBtn
              icon={faDoorOpen}
              text="Log out"
              onClick={() => {
                handleNavigate("/");
                localStorage.setItem("token", ''); // Clear token on logout
              }}
            />
          </Box>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default Sidebar;
