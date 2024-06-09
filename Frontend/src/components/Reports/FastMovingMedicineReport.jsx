import React, { useState, useEffect } from "react";
import "../../stylings/pages/dashboard.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { Button, Typography } from "@mui/material";

function FastMovingReport() {
  const [fastMovingData, setFastMovingData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/fastmoving-report"
      );
      const data = response.data;
      if (data.success) {
        setFastMovingData(data.data);
      } else {
        console.error("Failed to fetch fast moving report data");
      }
    } catch (error) {
      console.error("Error occurred while fetching fast moving report data:", error);
    }
  };

  return (
    <div className="body">
      <div className="outer-div">
      <div className="top">
      <div className="left">
        {/* <IconBreadcrumbs /> */}
          <div style={{ paddingRight: "20px"}}>
              <h3><span style={{ color: "grey" }}>Reports</span> &gt; Demand Analysing Report</h3>
            </div>
      </div>
      </div>
        <div style={{ height: "100vh", width: "100%", overflowY: "auto" }}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Medicine ID</TableCell>
                  <TableCell align="right">Brand Name</TableCell>
                  <TableCell align="right">Generic Name</TableCell>
                  <TableCell align="right">Total Sales</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fastMovingData.map((row) => (
                  <TableRow key={row.medicine_id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell component="th" scope="row">
                      {row.medicine_id}
                    </TableCell>
                    <TableCell align="right">{row.medicine_brandname}</TableCell>
                    <TableCell align="right">{row.medicine_genericname}</TableCell>
                    <TableCell align="right">{row.total_sales}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
}

export default FastMovingReport;
