import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import '../stylings/pages/sidebar.css'
import logo from '../assets/logo.png'
import logowithtext from '../assets/logotext.png'

function Sidebar() {
  const [show, setShow] = useState(true);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Launch
      </Button>

      <Offcanvas show={show}  id="sidebar">
        <Offcanvas.Header className='sidebar-header'>
          <img src={logo}/>
          <img src={logowithtext}/>
        </Offcanvas.Header>
        <Offcanvas.Body>
         
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default Sidebar;