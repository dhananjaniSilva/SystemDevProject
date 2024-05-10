import React from "react";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/esm/Button";
import "../stylings/pages/dashboard.css";
import IconBreadcrumbs from "../components/IconBreadcrumbs";
import FormTextExample from "../components/Inventory/TextField";
import { TextField } from "@mui/material";

function Dashboard() {
  console.log("object")
  const handleSearch =()=>{
    console.log("Fuck you")
  }
  return (
    <div className="body">

      <div className="inner-div" style={{border:"solid 2px green"}}>
      <TextField fullWidth id="outlined-basic" label="" variant="outlined" onChange={(e)=>handleSearch(e.target.value)}/>
      </div>
    </div>
  );
}

export default Dashboard;
