import { useState } from "react";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import "../../../stylings/pages/sidebar.css";
import logo from "../../../assets/logo.png";
import logowithtext from "../../../assets/logotext.png";
import SidebarBtn from "../../../components/SidebarBtn";
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

function CashierSidebar() {
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
          <SidebarBtn icon={faPager} text="Dashboard" onClick={()=>handleNavigate('/C-dashboard')}/>
          <SidebarBtn
            icon={faList}
            text={"Inventory"}
            onClick={handleVisibilityinv}
          />
          
          {isVisibleinv && (
            <div className="button-group">
              <SidebarBtn text={"List of Medicines"} onClick={()=>handleNavigate('/C-inventoryListofmedicine')}/>
              <SidebarBtn text={"Medicine Categories"} onClick={()=>handleNavigate('/C-medicineGroups')}/>
            </div>
          )}
                   <SidebarBtn icon={faNewspaper} text={"Invoice Bill"} onClick={()=>handleNavigate('/C-invoicebill')}/>

          
        
          
          
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default CashierSidebar;
