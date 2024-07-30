import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Swal from "sweetalert2";
import { Box, Button, ButtonGroup, Typography } from "@mui/material";
import Form from 'react-bootstrap/Form';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import BrowserUpdatedIcon from '@mui/icons-material/BrowserUpdated';

// Columns definition for the table
const columns = [
  { label: "Medicine Id", dataKey: "medicine_id" },
  { label: "Brand Name", dataKey: "medicine_brandname" },
  { label: "Generic Name", dataKey: "medicine_genericname" },
  { label: "Unit Price", dataKey: "medicine_unitprice" },
  { label: "Pack Size", dataKey: "medicine_packsize" },
  { label: "In-hand Qty.", dataKey: "medicine_inhandquantity" },
];

export default function RequestOrderTable({ medicineArray }) {
  // State for search input value
  const [searchValue, setSearchValue] = useState("");
  // State for filtered medicine data based on search input
  const [filteredMedicines, setFilteredMedicines] = useState(medicineArray);
  // State for supplier information
  const [supplier, setSupplier] = useState({
    sp_companyname: " ",
    sp_fname: " ",
    sp_lname: " ",
    sp_pno: " ",
  });
  // State for medicines that have been passed for order
  const [passedMedicines, setPassedMedicines] = useState([]);
  // State for current date and time
  const [currentTime, setCurrentTime] = useState(new Date());

  // Effect to update filteredMedicines when medicineArray changes
  useEffect(() => {
    setFilteredMedicines(medicineArray);
  }, [medicineArray]);

  // Effect to update currentTime every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  // Function to handle passing a medicine for order
  const handlePass = async (row) => {
    const { value: quantity } = await Swal.fire({
      title: "Enter Order Qty.",
      input: "number",
      inputAttributes: {
        autocapitalize: "off",
        min: 1,
      },
      showCancelButton: true,
      confirmButtonText: "Submit",
      // Input validation
      inputValidator: (value) => {
        if (!value) {
          return "You need to enter a quantity";
        }
        if (isNaN(value)) {
          return "Please enter a valid number";
        }
      },
    });

    if (quantity) {
      // Check if the same medicine is already in passedMedicines array
      const existingMedicineIndex = passedMedicines.findIndex(
        (medicine) => medicine.medicine_id === row.medicine_id
      );

      if (existingMedicineIndex !== -1) {
        // Replace the previous entry with the new quantity
        const updatedPassedMedicines = [...passedMedicines];
        updatedPassedMedicines[existingMedicineIndex].medicineOrderQuantity =
          quantity;
        setPassedMedicines(updatedPassedMedicines);
      } else {
        // Add new medicine to the list
        row.medicineOrderQuantity = quantity;
        setPassedMedicines([...passedMedicines, row]);
      }
    }
  };

  // Function to handle search operation
  const handleSearch = async (searchValue) => {
    if (searchValue === "") {
      // Reset filtered data and supplier information when search value is empty
      setFilteredMedicines(medicineArray);
      setSupplier({
        sp_companyname: "",
        sp_fname: "",
        sp_lname: "",
        sp_pno: "",
      });
      return;
    }

    // Filter medicines based on supplier company name
    const filteredData = medicineArray.filter((medicine) =>
      medicine.sp_companyname.toLowerCase().includes(searchValue.toLowerCase())
    );

    if (filteredData.length > 0) {
      // Update filtered medicines and supplier information based on search result
      setFilteredMedicines(filteredData);
      setSupplier({
        sp_companyname: filteredData[0].sp_companyname,
        sp_fname: filteredData[0].sp_fname,
        sp_lname: filteredData[0].sp_lname,
        sp_pno: filteredData[0].sp_pno,
      });
    } else {
      // Clear filtered data and supplier information if no match is found
      setFilteredMedicines([]);
      setSupplier({
        sp_companyname: "",
        sp_fname: "",
        sp_lname: "",
        sp_pno: "",
      });
    }
  };

  // Function to get formatted date and time
  const getFormattedDate = () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();
    const formattedTime = currentDate.toLocaleTimeString();
    return `${formattedDate} ${formattedTime}`;
  };

  // Function to handle downloading the invoice as a PDF
  const handleDownload = () => {
    const capture = document.querySelector(`.orderInvoice`);

    html2canvas(capture, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const doc = new jsPDF("p", "mm", "a4");
      const componentWidth = doc.internal.pageSize.getWidth();
      const componentHeight = (canvas.height * componentWidth) / canvas.width;
      doc.addImage(imgData, "PNG", 0, 0, componentWidth, componentHeight);
      doc.save(`${supplier.sp_companyname}-OrderRecipt.pdf`);
    });
  };

  return (
    <>
      <Box display={"flex"}>
        <Box display={"flex"} gap={3}>
          {/* Main table for displaying medicines */}
          <Paper
            sx={{
              height: "100%",
              width: "60%",
              padding: "20px",
              borderRadius: "10px",
            }}
            elevation={4}
          >
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              {/* Search input and buttons */}
              <Form.Control
                type="text"
                placeholder="Enter Supplier Name"
                onChange={(e) => setSearchValue(e.target.value)}
                style={{ marginBottom: "20px", width: "60%", borderRadius: 10 }}
              />
              <ButtonGroup
                disableElevation
                variant="outlined"
                aria-label="Disabled button group"
              >
                <Button color="info" onClick={() => handleSearch(searchValue)}> 
                  Search
                </Button>
                <Button color="error" onClick={() => handleSearch("")}>
                  Clear
                </Button>
              </ButtonGroup>
            </Box>

            {/* TableContainer for displaying the filtered list of medicines */}
            <TableContainer component={Paper} sx={{ width: "100%", height: "58vh" }}>
              <Table
                sx={{
                  minWidth: 650,
                  tableLayout: "fixed",
                  width: "100%",
                }}
              >
                <TableHead>
                  <TableRow>
                    {/* Render table headers */}
                    {columns.map((column) => (
                      <TableCell
                        key={column.dataKey}
                        align="center"
                        style={{
                          width: column.width,
                          padding: "10px",
                          fontWeight: "bold",
                          boxSizing: "border-box",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* Render filtered medicine data */}
                  {filteredMedicines.map((row, index) => (
                    <TableRow
                      key={index}
                      onClick={() => handlePass(row)}
                      sx={{
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: "#B0A4FE",
                        },
                      }}
                    >
                      {columns.map((column) => (
                        <TableCell
                          key={column.dataKey}
                          align="center"
                          style={{
                            width: column.width,
                            padding: "10px",
                            boxSizing: "border-box",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {column.dataKey === "medicine_id"
                            ? `${row.mdct_code}${row[column.dataKey].toString().padStart(5, "0")}`
                            : row[column.dataKey]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Order invoice section */}
          <div
            className="orderInvoice"
            component={Paper}
            elevation={10}
            style={{ width: "35%", padding: "20px", backgroundColor: "white", borderRadius: "12px" }}
          >
            <Box sx={{ height: "200px" }}>
              <Typography variant="h5" align="center">
                <strong> Order Details</strong>
              </Typography>
              <Typography variant="body2" align="right">
                Date: {getFormattedDate()}
              </Typography>

              <SupplierDetails supplier={supplier} />
            </Box>
            {passedMedicines.length > 0 && (
              <TableContainer component={Paper}>
                <Table aria-label="spanning table">
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Order quantity</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* Render passed medicines for the order */}
                    {passedMedicines.map((medicine, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {medicine.mdct_code}
                          {medicine.medicine_id.toString().padStart(5, "0")}
                        </TableCell>
                        <TableCell>{medicine.medicine_brandname}</TableCell>
                        <TableCell>{medicine.medicineOrderQuantity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </div>
        </Box>

        {/* Button to download the invoice as PDF */}
        <Button sx={{ backgroundColor: "purple" }} onClick={handleDownload}>
          <BrowserUpdatedIcon sx={{ color: "white" }} />
        </Button>
      </Box>
    </>
  );
}

// Component to display supplier details
function SupplierDetails({ supplier }) {
  return (
    <Box sx={{ marginTop: 2, padding: 2, width: "100%" }}>
      <Typography variant="h6">
        <strong>Supplier Details</strong>
      </Typography>
      <Typography variant="body2">
        Supplier Name: {supplier.sp_companyname}
      </Typography>
      <Typography variant="body2">
        Agent Name: {supplier.sp_fname} {supplier.sp_lname}
      </Typography>
      <Typography variant="body2">Phone Number: {supplier.sp_pno}</Typography>
    </Box>
  );
}
