import React, { useEffect } from "react";
import "../stylings/pages/dashboard.css";
import Stack from "react-bootstrap/Stack";
import DashbaordCardComponent from "../components/DashbaordCardComponent";
import HealthAndSafetyOutlinedIcon from '@mui/icons-material/HealthAndSafetyOutlined';
import AddCardOutlinedIcon from '@mui/icons-material/AddCardOutlined';
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate=useNavigate();
  
  return (
    <div className="body">
      <div className="outer-div">
        {/* //top row */}
        <div className="top">
          <div className="left">
            <div style={{paddingLeft:"20px",paddingRight:"20px"}}>
              <h3>Dashboard</h3>
            </div>
          </div>
          <div className="right"></div>
        </div>
        <div className="middle">
         
            <div className="upper-card"><DashbaordCardComponent bordercolor={"green"} headerbackgroundcolor={"#30ddae"} icon={HealthAndSafetyOutlinedIcon}/></div>
            <div className="upper-card"><DashbaordCardComponent bordercolor={"yellow"} headerbackgroundcolor={"#c8d74a"} icon={AddCardOutlinedIcon}/></div>
            <div className="upper-card"><DashbaordCardComponent bordercolor={"lightblue"} headerbackgroundcolor={"#B0A4FE"} icon={MedicalServicesOutlinedIcon}/></div>
            <div className="upper-card"><DashbaordCardComponent bordercolor={"red"} headerbackgroundcolor={"#FEA4C5"} icon={WarningAmberOutlinedIcon}/></div>
         
        </div>
        {/* table part */}
        <div className="bottompart">
          <Stack gap={3}>
            <div className="p-2">
              <Stack style={{ height: "100%" }} direction="horizontal" gap={3}>
                <div className="k-2">
                  <DashbaordCardComponent toogle={true} />
                </div>
                <div className="k-2">
                  <DashbaordCardComponent toogle={true}/>
                </div>
              </Stack>
            </div>
            <div className="p-2">
              <Stack style={{ height: "100%" }} direction="horizontal" gap={3}>
                <div className="k-2">
                  <DashbaordCardComponent toogle={true}/>
                </div>
                <div className="k-2">
                  <DashbaordCardComponent toogle={true}/>
                </div>
              </Stack>
            </div>
          </Stack>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
