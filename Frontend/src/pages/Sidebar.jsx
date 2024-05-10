import { useState } from "react";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import "../stylings/pages/sidebar.css";
import logo from "../assets/logo.png";
import logowithtext from "../assets/logotext.png";
import SidebarBtn from "../components/SidebarBtn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPager,
  faList,
  faArrowTrendUp,
  faBell,
  faGear,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";

function Sidebar() {
  const [show, setShow] = useState(true);
  const [isVisibleinv, setIsVisibleinv] = useState(false);
  const [isVisiblereports, setIsVisiblereports] = useState(false);


  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleVisibilityinv = () => {
    setIsVisibleinv(!isVisibleinv);
    
  };
  const handleVisibilityreports = () => {
    setIsVisiblereports(!isVisiblereports);
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Launch
      </Button>

      <Offcanvas show={true} id="sidebar" backdropClassName="backdrop">
        <Offcanvas.Header className="sidebar-header">
          <img src={logo} />
          <img src={logowithtext} />
        </Offcanvas.Header>
        <Offcanvas.Body className="sidebar-body">
          <div className="top">
            <div>
            <h5>Umesha</h5>
            <p>Phamarmacy Manager</p>
            </div>
            <div style={{height:"40px" }}>
              <Button style={{backgroundColor:"transparent" , border:"transparent solid 1px" }}>
                <FontAwesomeIcon icon={faEllipsisVertical}/>
              </Button>
            </div>
          </div>
          <SidebarBtn icon={faPager} text="Dashboard" />
          <SidebarBtn
            icon={faList}
            text={"Inventory"}
            onClick={handleVisibilityinv}
          />
          {isVisibleinv && (
            <div className="button-group">
              <SidebarBtn text={"List of Medicines"} />
              <SidebarBtn text={"Medicine Groups"} />
            </div>
          )}

          <SidebarBtn icon={faArrowTrendUp} text={"Reports"} onClick={handleVisibilityreports}/>
          {isVisiblereports && (
            <div className="button-group">
              <SidebarBtn text={"Sales reports"} />
              <SidebarBtn text={"Payment reports"} />
            </div>
          )}
          <SidebarBtn icon={faBell} text={"Notifications"} />
          <SidebarBtn icon={faGear} text={"Application Settings"} />
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default Sidebar;
