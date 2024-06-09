import React from "react";
import "../stylings/pages/grn.css";
import GrnForm from "../components/GRN/GrnForm";
import GrnTable from "../components/GRN/GrnTable";
import { Button } from "@mui/material";
import GrnDetails from "../components/GRN/GrnDetails";
function GRN() {
  const handleAddStock = () => {
    console.log("pressed");
  };
  return (
    <div className="body">
      <div className="outer-div">
        <div className="top">
          <div className="left"></div>
          <div className="right">
          
          </div>
        </div>
        <div className="table" style={{display:"flex",justifyContent:"space-evenly"}}>
          <div style={{width:"65%"}}>
            <GrnTable />
          </div>
          <div style={{width:"30%"}}>
            <GrnForm />
          </div>
        </div>
      </div>
    </div>
  );
}

export default GRN;
