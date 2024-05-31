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
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateTime).toLocaleDateString(undefined, options);
}

function formatDate(date) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, options);
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
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
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Supplier Information
              </Typography>
              <Table size="small" aria-label="supplier-info">
                <TableHead>
                  <TableRow>
                    <TableCell>Company Name</TableCell>
                    <TableCell>Phone Number</TableCell>
                    <TableCell>Agent Name</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{row.sp_companyname}</TableCell>
                    <TableCell>{row.sp_pno}</TableCell>
                    <TableCell>
                      {`${row.sp_fname} ${row.sp_lname}`}
                    </TableCell>
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
};

export default function CollapsibleTable() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/fetchSupplyData")
      .then((response) => {
        console.log(response.data);
        const fetchedData = response.data.map((item) => createData(item));
        setRows(fetchedData);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Brand Name</TableCell>
            <TableCell align="right">Generic Name</TableCell>
            <TableCell align="right">Buying Price</TableCell>
            <TableCell align="right">Supplied Quantity</TableCell>
            <TableCell align="right">Stock Entered Date</TableCell>
            <TableCell align="right">Stock Expire Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row key={row.medicine_id} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
