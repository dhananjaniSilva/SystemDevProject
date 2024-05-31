import React from "react";
import '../stylings/pages/grn.css'
import GrnForm from "../components/GRN/GrnForm";
import GrnTable from "../components/GRN/GrnTable";
import { Button } from "@mui/material";
import GrnDetails from "../components/GRN/GrnDetails";
function GRN() {
  const handleAddStock = ()=>{
    console.log("pressed")
  }
  return (
    <div className="outer-div">
      <div className="top">
        <div className="left"></div>
        <div className="right"><Button variant="contained" onClick={handleAddStock}>+ Add stock</Button></div>
      </div>
      <div className="table">
        <GrnTable/>
        <GrnForm/>
      </div>
    </div>
  );
}

export default GRN;
