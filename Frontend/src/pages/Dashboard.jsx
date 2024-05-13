import React from "react";
import "../stylings/pages/dashboard.css";
import DashbaordCardComponent from "../components/DashbaordCardComponent";
import Stack from "react-bootstrap/Stack";
import HealthAndSafetyOutlinedIcon from '@mui/icons-material/HealthAndSafetyOutlined';
import AddCardOutlinedIcon from '@mui/icons-material/AddCardOutlined';
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';

function Dashboard() {
  return (
    <div className="body">
      <div className="outer-div">
        {/* //top row */}
        <div className="top">
          <div className="left">
            <div style={{padding:"20px"}}>
              <h2>Dashboard</h2>
              <h6>A quick data overview of the inventory</h6>
            </div>
          </div>
          <div className="right"></div>
        </div>
        <div className="middle">
         
            <div className="upper-card"><DashbaordCardComponent bordercolor={"green"} headerbackgroundcolor={"green"} icon={HealthAndSafetyOutlinedIcon}/></div>
            <div className="upper-card"><DashbaordCardComponent bordercolor={"yellow"} headerbackgroundcolor={"yellow"} icon={AddCardOutlinedIcon}/></div>
            <div className="upper-card"><DashbaordCardComponent bordercolor={"lightblue"} headerbackgroundcolor={"lightblue"} icon={MedicalServicesOutlinedIcon}/></div>
            <div className="upper-card"><DashbaordCardComponent bordercolor={"red"} headerbackgroundcolor={"red"} icon={WarningAmberOutlinedIcon}/></div>
         
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
