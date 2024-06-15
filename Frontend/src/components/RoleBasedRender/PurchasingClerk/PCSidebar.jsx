import { useState } from "react";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import "../../../stylings/pages/sidebar.css";
import logo from "../../../assets/logo.png";
import logowithtext from "../../../assets/logotext.png";
import SidebarBtn from "../../../components/SidebarBtn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import {
  faPager,
  faList,
  faFileInvoice,
  faDoorOpen,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import { Box } from "@mui/material";

function PCSidebar() {
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  const [show, setShow] = useState(true);
  const [isVisibleinv, setIsVisibleinv] = useState(false);
  const [isVisiblereports, setIsVisiblereports] = useState(false);
  const navigate = useNavigate();

  const handleVisibilityinv = () => {
    if (isVisiblereports && isVisibleinv === false) {
      setIsVisibleinv(!isVisibleinv);
      setIsVisiblereports(false);
    }
    setIsVisibleinv(!isVisibleinv);
  };

  const handleVisibilityreports = () => {
    if (isVisibleinv && isVisiblereports === false) {
      setIsVisiblereports(!isVisiblereports);
      setIsVisibleinv(false);
    }
    setIsVisiblereports(!isVisiblereports);
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <>
      <Offcanvas
        scroll={true}
        backdrop={false}
        show={show}
        onHide={() => setShow(false)}
        className="no-transition" // Apply the custom CSS class
        id="sidebar"
      >
        <Offcanvas.Header className="sidebar-header">
          <img src={logo} alt="logo" />
          <img src={logowithtext} alt="logowithtext" />
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
                onClick={() => setShow(!show)}
              >
                <FontAwesomeIcon icon={faEllipsisVertical} />
              </Button>
            </div>
          </div>
          <Box height={"80%"}>
            <SidebarBtn
              icon={faPager}
              text="Dashboard"
              onClick={() => handleNavigate("/PC-dashboard")}
            />
            <SidebarBtn
              icon={faList}
              text={"Inventory"}
              onClick={handleVisibilityinv}
            />
            {isVisibleinv && (
              <div className="button-group">
                <SidebarBtn
                  text={"List of Medicines"}
                  onClick={() => handleNavigate("/PC-inventoryListofmedicine")}
                />
                <SidebarBtn
                  text={"Medicine Categories"}
                  onClick={() => handleNavigate("/PC-medicineGroups")}
                />
              </div>
            )}
            <SidebarBtn
              icon={faFileInvoice}
              text={"Request Order"}
              onClick={() => handleNavigate("/PC-requestorder")}
            />
          </Box>
          <Box flexGrow={1} />
          <Box height={"10%"} width={"100%"}>
            <SidebarBtn
              icon={faDoorOpen}
              text="Log out"
              onClick={() => {
                handleNavigate("/");
                localStorage.setItem("token", "");
              }}
            />
          </Box>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default PCSidebar;
