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
const columns = [
  { label: "Medicine Id", dataKey: "medicine_id" },
  { label: "Brand Name", dataKey: "medicine_brandname" },
  { label: "Generic Name", dataKey: "medicine_genericname" },
  { label: "Unit Price", dataKey: "medicine_unitprice" },
  { label: "Pack Size", dataKey: "medicine_packsize" },
  { label: "In-hand Qty.", dataKey: "medicine_inhandquantity" },
];

export default function RequestOrderTable({ medicineArray }) {
  const [searchValue, setSearchValue] = useState("");
  const [filteredMedicines, setFilteredMedicines] = useState(medicineArray);
  const [supplier, setSupplier] = useState({
    sp_companyname: " ",
    sp_fname: " ",
    sp_lname: " ",
    sp_pno: " ",
  });
  const [passedMedicines, setPassedMedicines] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    setFilteredMedicines(medicineArray);
  }, [medicineArray]);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);
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
      // validation
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
        // Replace the previous entry with the new one
        const updatedPassedMedicines = [...passedMedicines];
        updatedPassedMedicines[existingMedicineIndex].medicineOrderQuantity =
          quantity;
        setPassedMedicines(updatedPassedMedicines);
      } else {
        // Add the new medicine
        row.medicineOrderQuantity = quantity;
        setPassedMedicines([...passedMedicines, row]);
      }
    }
  };

  const handleSearch = async (searchValue) => {
    if (searchValue === "") {
      setFilteredMedicines(medicineArray);
      setSupplier({
        sp_companyname: "",
        sp_fname: "",
        sp_lname: "",
        sp_pno: "",
      }); // Initialize supplier with empty strings
      return;
    }

    const filteredData = medicineArray.filter((medicine) =>
      medicine.sp_companyname.toLowerCase().includes(searchValue.toLowerCase())
    );

    if (filteredData.length > 0) {
      setFilteredMedicines(filteredData);
      setSupplier({
        sp_companyname: filteredData[0].sp_companyname,
        sp_fname: filteredData[0].sp_fname,
        sp_lname: filteredData[0].sp_lname,
        sp_pno: filteredData[0].sp_pno,
      });
    } else {
      setFilteredMedicines([]);
      setSupplier({
        sp_companyname: "",
        sp_fname: "",
        sp_lname: "",
        sp_pno: "",
      }); // Initialize supplier with empty strings
    }
  };

  const getFormattedDate = () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();
    const formattedTime = currentDate.toLocaleTimeString();
    return `${formattedDate} ${formattedTime}`;
  };

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
          sx={{backgroundColor:""}}
        >
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
            {/* search and clear buttons */}
            <Button color="info" onClick={() => handleSearch(searchValue)}> 
              Search
            </Button>
            <Button color="error" onClick={() => handleSearch("")}>
              Clear
            </Button>
          </ButtonGroup>
        </Box>

        <TableContainer component={Paper} sx={{ width: "100%",height:"58vh" }}>
          <Table
            sx={{
              minWidth: 650,
              tableLayout: "fixed",
              width: "100%",
              heigh: "500px",
            }}
          >
            <TableHead>
              <TableRow>
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
      {/* order invoice */}
      <div
        className="orderInvoice"
        component={Paper}
        elevation={10}
        style={{ width: "35%", padding: "20px", backgroundColor: "white", borderRadius: "12px" }}
        borderRadius={3}
      >
        <Box sx={{ height: "200px" }}>
          <Typography variant="h5" align="center">
            <strong> Order Details</strong>
          </Typography>
          <Typography variant="body2" align="right">
            Date :{getFormattedDate()}
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
      <Button sx={{backgroundColor:"purple"}} onClick={handleDownload}><BrowserUpdatedIcon sx={{color:"white"}}/></Button>
    </Box>
    </>
  );
}

function SupplierDetails({ supplier }) {
  return (
    <Box sx={{ marginTop: 2, padding: 2, width: "100%" }}>
      <Typography variant="h6">
        <strong>Supplier Details</strong>
      </Typography>
      <Typography variant="body2">
        Supplier Name : {supplier.sp_companyname}
      </Typography>
      <Typography variant="body2">
        Agent Name : {supplier.sp_fname} {supplier.sp_lname}
      </Typography>
      <Typography variant="body2">Phone Number : {supplier.sp_pno}</Typography>
    </Box>
  );
}
