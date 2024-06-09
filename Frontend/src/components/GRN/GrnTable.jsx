import React, { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import DeleteIcon from "@mui/icons-material/Delete";

function createData(data) {
  return {
    ...data,
    history: [
      {
        date: "2020-01-05",
        customerId: "11091700",
        amount: 3,
      },
      {
        date: "2020-01-02",
        customerId: "Anonymous",
        amount: 1,
      },
    ],
  };
}

function formatDateTime(dateTime) {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateTime).toLocaleDateString(undefined, options);
}

function formatDate(date) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(date).toLocaleDateString(undefined, options);
}

function Row(props) {
  const { row, onDelete } = props;
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    onDelete(row.sply_stockid);
  };

  // Calculate the expiration date for 3 months, 6 months, and 1 year
  const threeMonthsFromNow = new Date();
  threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);

  const sixMonthsFromNow = new Date();
  sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);

  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

  // Determine if the medicine will expire within the specified periods
  const willExpireWithinThreeMonths = new Date(row.sply_expiredate) <= threeMonthsFromNow;
  const willExpireWithinSixMonths = new Date(row.sply_expiredate) <= sixMonthsFromNow;
  const willExpireWithinOneYear = new Date(row.sply_expiredate) <= oneYearFromNow;

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset", backgroundColor: 
          willExpireWithinThreeMonths ? "lightyellow" :
          willExpireWithinSixMonths ? "lightgreen" :
          willExpireWithinOneYear ? "lightblue" : "inherit"
      } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.medicine_brandname}
        </TableCell>
        <TableCell align="right">{row.medicine_genericname}</TableCell>
        <TableCell align="right">{row.sply_unit_buying_price}</TableCell>
        <TableCell align="right">{row.sply_quantity}</TableCell>
        <TableCell align="right">{formatDateTime(row.sply_datetime)}</TableCell>
        <TableCell align="right">{formatDate(row.sply_expiredate)}</TableCell>
        <TableCell align="right">
          <IconButton aria-label="delete" onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Supplier Information
              </Typography>
              <Table size="small" aria-label="supplier-info">
                <TableHead>
                  <TableRow>
                    <TableCell>Supplier Name</TableCell>
                    <TableCell>Phone Number</TableCell>
                    <TableCell>Agent Name</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{row.sp_companyname}</TableCell>
                    <TableCell>{row.sp_pno}</TableCell>
                    <TableCell>{`${row.sp_fname} ${row.sp_lname}`}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}



Row.propTypes = {
  row: PropTypes.shape({
    medicine_brandname: PropTypes.string.isRequired,
    medicine_genericname: PropTypes.string.isRequired,
    sply_unit_buying_price: PropTypes.number.isRequired,
    sply_quantity: PropTypes.number.isRequired,
    sply_datetime: PropTypes.string.isRequired,
    sply_expiredate: PropTypes.string.isRequired,
    sp_companyname: PropTypes.string.isRequired,
    sp_pno: PropTypes.string.isRequired,
    sp_fname: PropTypes.string.isRequired,
    sp_lname: PropTypes.string.isRequired,
    history: PropTypes.arrayOf(
      PropTypes.shape({
        date: PropTypes.string.isRequired,
        customerId: PropTypes.string.isRequired,
        amount: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default function CollapsibleTable() {
  const [rows, setRows] = useState([]);
  const [selectedDateRange, setSelectedDateRange] = useState("3 months");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchData(selectedDateRange);
  }, [selectedDateRange]);

  const fetchData = (dateRange) => {
    const currentDate = new Date();
    const endDate = new Date();
    endDate.setMonth(
      currentDate.getMonth() +
        (dateRange === "3 months" ? 3 : dateRange === "6 months" ? 6 : 12)
    );
    axios
      .get(
        `http://localhost:8080/fetchSupplyData?endDate=${endDate.toISOString()}`
      )
      .then((response) => {
        const fetchedData = response.data.map((item) => createData(item));
        setRows(fetchedData);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  };

  const handleDelete = (sply_stockid) => {
    axios
      .delete(`http://localhost:8080/deleteSupply/${sply_stockid}`)
      .then(() => {
        setRows((prevRows) =>
          prevRows.filter((row) => row.sply_stockid !== sply_stockid)
        );
        console.log("Supply deleted successfully!");
      })
      .catch((error) => {
        console.error("Error deleting supply!", error);
      });
  };

  const handleDateRangeChange = (event) => {
    setSelectedDateRange(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredRows = rows.filter(
    (row) =>
      row.medicine_brandname
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      row.medicine_genericname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Box>
        <select value={selectedDateRange} onChange={handleDateRangeChange}>
          <option value="3 months">3 months</option>
          <option value="6 months">6 months</option>
          <option value="1 year">1 year</option>
        </select>
        <input
          type="text"
          placeholder="Search by Brand or Generic Name"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </Box>
      <TableContainer
        component={Paper}
        sx={{ borderRadius: 3, height: "80vh" }}
      >
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Brand Name</TableCell>
              <TableCell align="right">Generic Name</TableCell>
              <TableCell align="right">Buying Price</TableCell>
              <TableCell align="right">Received Qty.</TableCell>
              <TableCell align="right">Received Date</TableCell>
              <TableCell align="right">Expire Date</TableCell>
              <TableCell align="right">Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((row) => (
              <Row
                key={row.sply_stockid}
                row={row}
                onDelete={() => handleDelete(row.sply_stockid)}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
