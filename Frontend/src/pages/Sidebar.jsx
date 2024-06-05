import { useState } from "react";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import "../stylings/pages/sidebar.css";
import logo from "../assets/logo.png";
import logowithtext from "../assets/logotext.png";
import SidebarBtn from "../components/SidebarBtn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from 'react-router-dom';
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
} from "@fortawesome/free-solid-svg-icons";

function Sidebar() {
  const [show, setShow] = useState(true);
  const [isVisibleinv, setIsVisibleinv] = useState(false);
  const [isVisiblereports, setIsVisiblereports] = useState(false);
  const navigate =useNavigate();

  // const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);
  const handleVisibilityinv = () => {
    if(isVisiblereports && isVisibleinv==false){
    setIsVisibleinv(!isVisibleinv)
      setIsVisiblereports(false)
    }
    setIsVisibleinv(!isVisibleinv)
  };
  const handleVisibilityreports = () => {
    if(isVisibleinv && isVisiblereports==false){
      setIsVisiblereports(!isVisiblereports)
        setIsVisibleinv(false)
      }
      setIsVisiblereports(!isVisiblereports)
   
  };
  const handleNavigate =(path)=>{
    navigate(path)
  }

  return (
    <>


      <Offcanvas name="Disable backdrop" scroll={true} backdrop={false} bsPrefix="offcanvas" show={show} onHide={()=>setShow(false)} id="sidebar" > 
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
              <Button style={{backgroundColor:"transparent" , border:"transparent solid 1px",width:"20px" }} onClick={()=>setShow(!show)}>
                <FontAwesomeIcon icon={faEllipsisVertical}/>
              </Button>
            </div>
          </div>
          <SidebarBtn icon={faPager} text="Dashboard" onClick={()=>handleNavigate('/dashboard')}/>
          <SidebarBtn
            icon={faList}
            text={"Inventory"}
            onClick={handleVisibilityinv}
          />
          
          {isVisibleinv && (
            <div className="button-group">
              <SidebarBtn text={"List of Medicines"} onClick={()=>handleNavigate('/inventoryListofmedicine')}/>
              <SidebarBtn text={"Medicine Categories"} onClick={()=>handleNavigate('/medicineGroups')}/>
            </div>
          )}
          <SidebarBtn icon={faNoteSticky} text="GRN" onClick={()=>handleNavigate('/grn')}/>
          <SidebarBtn icon={faArrowTrendUp} text={"Reports"} onClick={handleVisibilityreports}/>
          {isVisiblereports && (
            <div className="button-group">
              <SidebarBtn text={"Sales reports"} />
              <SidebarBtn text={"Demand reports"} />
            </div>
          )}
          <SidebarBtn icon={faBell} text={"Notifications"} />
          <SidebarBtn icon={faNewspaper} text={"Invoice Bill"} onClick={()=>handleNavigate('/invoicebill')}/>
          <SidebarBtn icon={faFileInvoice} text={"Request Order"} onClick={()=>handleNavigate('/requestOrder')}/>
          <SidebarBtn icon={faGear} text={"Application Settings"} />
          <SidebarBtn icon={faUserAstronaut} text={"User management"} onClick={()=>handleNavigate('/userManagement')} />
          
          
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default Sidebar;
