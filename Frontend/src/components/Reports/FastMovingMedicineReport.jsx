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
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

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

  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortField(field);
  };

  const compareValues = (a, b, field) => {
    const valueA = a[field];
    const valueB = b[field];

    if (valueA === valueB) return 0;

    const comparison = valueA > valueB ? 1 : -1;
    return sortOrder === "asc" ? comparison : -comparison;
  };

  const sortedData = () => {
    if (!sortField) return fastMovingData;

    return [...fastMovingData].sort((a, b) => compareValues(a, b, sortField));
  };

  return (
    <div className="body">
      <div className="outer-div">
        <div className="top">
          <div className="left">
            <div style={{ paddingRight: "20px" }}>
              <h3><span style={{ color: "grey" }}>Reports</span> &gt; Demand Analysing Report</h3>
            </div>
          </div>
        </div>
        <div style={{ height: "100vh", width: "100%", overflowY: "auto" }}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell onClick={() => handleSort("medicine_id")}>Medicine ID</TableCell>
                  <TableCell align="right" onClick={() => handleSort("medicine_brandname")}>Brand Name</TableCell>
                  <TableCell align="right" onClick={() => handleSort("medicine_genericname")}>Generic Name</TableCell>
                  <TableCell align="right" onClick={() => handleSort("total_sales")}>Total Sales</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedData().map((row) => (
                  <TableRow key={row.medicine_id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell component="th" scope="row">{row.medicine_id}</TableCell>
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
