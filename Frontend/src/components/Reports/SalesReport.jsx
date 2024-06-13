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

function SalesReport() {
  const [salesData, setSalesData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/sales-report"
      );
      const data = response.data;
      if (data.success) {
        setSalesData(data.data);
        setOriginalData(data.data); // Store original unfiltered data
      } else {
        console.error("Failed to fetch sales report data");
      }
    } catch (error) {
      console.error("Error occurred while fetching sales report data:", error);
    }
  };

  const formattedDate = (datetime) => {
    return new Date(datetime).toLocaleString();
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
    filterData(event.target.value, endDate);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
    filterData(startDate, event.target.value);
  };

  const handleClearFilters = () => {
    setStartDate("");
    setEndDate("");
    setSortField(null);
    setSortOrder("asc");
    setSalesData(originalData);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const filterData = (start, end) => {
    // Filter data based on selected date range from the original unfiltered data
    const filteredData = originalData.filter((row) => {
      const rowDate = new Date(row.inv_datetime);
      const startDate = new Date(start);
      const endDate = new Date(end);
      return (!start || rowDate >= startDate) && (!end || rowDate <= endDate);
    });
    setSalesData(filteredData);
  };

  const compareValues = (a, b) => {
    const valueA =
      typeof a[sortField] === "string"
        ? a[sortField].toUpperCase()
        : a[sortField];
    const valueB =
      typeof b[sortField] === "string"
        ? b[sortField].toUpperCase()
        : b[sortField];

    let comparison = 0;
    if (valueA > valueB) {
      comparison = 1;
    } else if (valueA < valueB) {
      comparison = -1;
    }
    return sortOrder === "desc" ? comparison * -1 : comparison;
  };

  const sortedData = () => {
    if (!sortField) return salesData;

    return [...salesData].sort(compareValues);
  };

  // Calculate total sales
  const totalSales = sortedData().reduce(
    (total, row) => total + parseInt(row.totalPrice),
    0
  );

  return (
    <div className="body">
      <div className="outer-div">
        <div className="top">
          <div className="left">
            {/* <IconBreadcrumbs /> */}
            <div style={{ paddingRight: "20px"}}>
              <h3><span style={{ color: "grey" }}>Reports</span> &gt; Sales Report</h3>
            </div>        
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "420px" }}>
            <input
              type="datetime-local"
              value={startDate}
              onChange={handleStartDateChange}
              placeholder="Start Date"
              style={{ width: "200px", height: "50px", borderRadius: "5px", border: "none" }}
            />
            <span style={{ margin: "0 10px", fontSize: "18px" }}>to</span>
            <input
              type="datetime-local"
              value={endDate}
              onChange={handleEndDateChange}
              placeholder="End Date"
              style={{ width: "200px", height: "50px", borderRadius: "5px", border: "none" }}
            />
          </div>
            <Button
              variant="contained"
              onClick={handleClearFilters}
              style={{ marginLeft: "10px" ,width:"200px" }}
            >
              Clear Filters
            </Button>
          </div>
          <div className="right">
            <Button
              sx={{ width: "200px", backgroundColor: "#dd0b81" }}
              variant="contained"
              onClick={() => handleSort("inv_id")}
            >
              Sort by Invoice ID
            </Button>
            <Button
              sx={{ width: "200px", backgroundColor: "#dd0b81" }}
              variant="contained"
              onClick={() => handleSort("totalPrice")}
            >
              Sort by Cost
            </Button>
            <Button
              sx={{ width: "200px", backgroundColor: "#dd0b81" }}
              variant="contained"
              onClick={() => handleSort("inv_datetime")}
            >
              Sort by Date Time
            </Button>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            height: "65vh",
            width: "100%",
            flexDirection: "column",
          }}
        >
          <div style={{ flex: "1 1 auto", overflowY: "auto" }}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Invoice ID</TableCell>
                    <TableCell align="right">Date & Time</TableCell>
                    <TableCell align="right">Paid Amount</TableCell>
                    <TableCell align="right">User Name</TableCell>
                    <TableCell align="right">Total Price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedData().map((row) => (
                    <TableRow
                      key={row.inv_id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.inv_id}
                      </TableCell>

                      <TableCell align="right">
                        {formattedDate(row.inv_datetime)}
                      </TableCell>
                      <TableCell align="right">{row.inv_paidamount}</TableCell>
                      <TableCell align="right">
                        {row.user_fname} {row.user_lname}
                      </TableCell>
                      <TableCell align="right">{row.totalPrice}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <div
            style={{
              height: "100px",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
             
            }}
          >
            {/* Display Total Sales */}
            <div
              style={{
                height: "100%",
                width: "400px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center", // Center the text within the div
              }}
            >
              <div
                style={{
                  border: "2px solid #43434a", // Add border with desired color
                  borderRadius: "5px", // Optional: add border radius
                  padding: "10px", // Optional: add padding for better appearance
                }}
              >
                <Typography variant="h5" color={"#43434a"}>
                  <strong>Total Sales: {totalSales.toFixed(2)}</strong>
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SalesReport;
