import React from 'react';
import "../stylings/components/sidebarBtn.css";
import Button from 'react-bootstrap/esm/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


function SidebarBtn(props) {

  return (
    <div style={{gap:"20px"}}>
    <Button id='sidebarBtn' onClick={props.onClick} >
    <FontAwesomeIcon icon={props.icon} />
        {props.text}
    </Button>
    </div>
  )
}

export default SidebarBtn
