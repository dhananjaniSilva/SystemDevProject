import React from "react";
import "../stylings/pages/dashboard.css";
import DashbaordCardComponent from "../components/DashbaordCardComponent";
import Stack from "react-bootstrap/Stack";

function Dashboard() {
  return (
    <div className="body">
      <div className="outer-div">
        {/* //top row */}
        <div className="top">
          <div className="left">
            <div>
              <h2>Dashboard</h2>
              <h6>A quick data overview of the inventory</h6>
            </div>
          </div>
          <div className="right"></div>
        </div>
        {/* table part */}
        <div className="bottompart">
          <Stack gap={3}>
            <div className="p-2">
              <Stack style={{ height: "100%" }} direction="horizontal" gap={3}>
                <div className="k-2">
                  <DashbaordCardComponent />
                </div>
                <div className="k-2">
                  <DashbaordCardComponent />
                </div>
              </Stack>
            </div>
            <div className="p-2">
              <Stack style={{ height: "100%" }} direction="horizontal" gap={3}>
                <div className="k-2">
                  <DashbaordCardComponent />
                </div>
                <div className="k-2">
                  <DashbaordCardComponent />
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
