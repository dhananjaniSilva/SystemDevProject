import React, { useEffect, useState } from "react";
import "../stylings/pages/invoiceBill.css";
// import InvoiceForm from "../components/invoiceBill/InvoiceForm";
// import InvoiceTable from "./../components/invoiceBill/InvoiceTable";
import {
  Box,
  Button,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import axios from "axios";
import Swal from "sweetalert2";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Form from "react-bootstrap/Form";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function InvoiceBill() {
  const [invoiceObject, setInvoiceObject] = useState({
    medicineData: [],
    invoiceId: "", // Initialize invoiceId as empty string
    paidAmount: 0, // Initialize paidAmount as 0
  });

  useEffect(() => {
    const createNewInvoice = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/createNewInvoice"
        );
        const newInvoiceId = response.data;
        console.log(newInvoiceId);
        setInvoiceObject((prev) => ({
          ...prev,
          invoiceId: newInvoiceId,
        }));
      } catch (error) {
        console.error("Error creating new invoice:", error);
      }
    };
    createNewInvoice();
  }, [setInvoiceObject]);

  // Function to add medicine data to the list
  const addMedicineData = (newMedicine) => {
    setInvoiceObject({
      ...invoiceObject,
      medicineData: [...invoiceObject.medicineData, newMedicine],
    });
  };

  // Function to handle creating a new invoice
  const handleCreateNew = async () => {
    // Show confirmation dialog using SweetAlert
    Swal.fire({
      title: "Are you sure?",
      text: "Your current progress will be lost. Do you want to continue?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, continue",
    }).then((result) => {
      if (result.isConfirmed) {
        // If user confirms, reload the page
        window.location.reload();
      }
    });
  };

  return (
    <>
      <div className="body">
        <div className="outer-div">
          <div className="top">
            <div className="left">
              {/* <IconBreadcrumbs /> */}
              <div style={{ paddingRight: "20px" }}>
                <h3>Invoice Bill</h3>
              </div>
            </div>
            <div className="right">
              <h5>
                Invoice Id: {invoiceObject.invoiceId && invoiceObject.invoiceId}
              </h5>{" "}
              {/* Display the invoiceId */}
              <Button variant="contained" onClick={handleCreateNew}>
                + Create New
              </Button>
            </div>
          </div>
          <div className="bodypart-div">
            <div className="bodypart-left">
              <InvoiceForm addMedicineData={addMedicineData} />
            </div>
            <div className="bodypart-right">
              <InvoiceTable
                invoiceObject={invoiceObject}
                setInvoiceObject={setInvoiceObject}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function ccyFormat(num) {
  const number = parseFloat(num);
  if (isNaN(number)) {
    return "0.00";
  }
  return `${number.toFixed(2)}`;
}

function subtotal(items) {
  return items
    .map(({ price }) => parseFloat(price) || 0)
    .reduce((sum, i) => sum + i, 0);
}

// Helper function to safely parse payment
function parsePayment(payment) {
  return payment.trim() === "" ? 0 : parseFloat(payment);
}

function InvoiceTable({ invoiceObject, setInvoiceObject }) {
  const [payment, setPayment] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [showBill, setShowBill] = useState(false);

  const handleChangePayment = (e) => {
    const value = e.target.value;
    setPayment(value);
    if (!value.trim()) {
      setPaymentError("Payment amount is required.");
    } else if (!/^\d*\.?\d*$/.test(value.trim())) {
      setPaymentError("Invalid payment amount.");
    } else {
      setPaymentError("");
    }
  };

  const handleRemoveMedicine = (index) => {
    // Display confirmation dialog before removing
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to remove this medicine from the invoice?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Remove the medicine from medicineData array
        const updatedMedicineData = invoiceObject.medicineData.filter(
          (_, i) => i !== index
        );

        // Update the state with the modified medicineData
        setInvoiceObject({
          ...invoiceObject,
          medicineData: updatedMedicineData,
        });

        // Show success message using SweetAlert
        Swal.fire(
          "Removed!",
          "The medicine has been removed from the invoice.",
          "success"
        );
      }
    });
  };

  const ccyFormat = (num) => {
    return `${parseFloat(num).toFixed(2)}`;
  };

  const subtotal = (items) => {
    return items
      .map(({ price }) => parseFloat(price) || 0)
      .reduce((sum, i) => sum + i, 0);
  };

  const handlePayInvoice = async () => {
    // Validate payment amount
    const parsedPayment = parseFloat(payment.trim());
    if (isNaN(parsedPayment) || parsedPayment <= 0) {
      setPaymentError("Invalid payment amount.");
      return;
    }
    
    // Check if payment is less than or equal to invoiceSubtotal
    const invoiceSubtotal = subtotal(
      invoiceObject.medicineData.map((medicine) => ({
        desc: ` ${medicine.medicineBrandName}`,
        qty: parseInt(medicine.medicineQuantity) || 0,
        unit: parseFloat(medicine.medicineUnitPrice) || 0,
        price:
          (parseInt(medicine.medicineQuantity) || 0) *
          (parseFloat(medicine.medicineUnitPrice) || 0),
      }))
    );
    
    if (parsedPayment <= invoiceSubtotal) {
      setPaymentError("Payment amount must be greater than the net amount.");
      return;
    }
    
    // Proceed with paying the invoice
    const currentDateTime = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    
    const updatedInvoiceObject = {
      ...invoiceObject,
      paidAmount: parsedPayment,
      invoiceDate: currentDateTime,
      userId: localStorage.getItem("userId"),
    };
  
    try {
      // Make the API call to complete the invoice using axios
      const response = await axios.post('http://localhost:8080/completeinvoice', updatedInvoiceObject);
  
      if (response.status !== 200) {
        throw new Error('Failed to complete the invoice');
      }
  
      // Show the bill dialog using Swal.fire
      Swal.fire({
        title: "View Invoice Bill?",
        text: "Do you want to view the invoice bill?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, view it!",
      }).then((result) => {
        if (result.isConfirmed) {
          // Update the state with the modified invoiceObject
          setInvoiceObject(updatedInvoiceObject);
  
          // Open the bill dialog
          setShowBill(true);
        }
  
        // Optionally, reload the page after the alert is closed
        // window.location.reload();
      });
    } catch (error) {
      console.error("Error completing the invoice:", error);
      // Handle error scenario here if needed
      Swal.fire("Error", "There was an error completing the invoice. Please try again.", "error");
    }
  };
  
  

  const balance =
    parseFloat(payment) -
    subtotal(
      invoiceObject.medicineData.map((medicine) => ({
        desc: ` ${medicine.medicineBrandName}`,
        qty: parseInt(medicine.medicineQuantity) || 0,
        unit: parseFloat(medicine.medicineUnitPrice) || 0,
        price:
          (parseInt(medicine.medicineQuantity) || 0) *
          (parseFloat(medicine.medicineUnitPrice) || 0),
      }))
    );

  const handleShowBill = () => {
    setShowBill(true);
  };

  const handleCloseBill = () => {
    setShowBill(false);
  };

  return (
    <>
      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 3 }}>
        <Table sx={{ minWidth: 700 }} aria-label="spanning table">
          <TableHead>
            <TableRow>
              <TableCell>Item no.</TableCell>
              <TableCell>Desc</TableCell>
              <TableCell align="right">Qty.</TableCell>
              <TableCell align="right">Unit Price</TableCell>
              <TableCell align="right">Sum</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoiceObject.medicineData.map((medicine, index) => (
              <TableRow
                key={index}
                onClick={() => handleRemoveMedicine(index)}
                sx={{
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "#B0A4FE" },
                }}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>{` ${medicine.medicineBrandName}`}</TableCell>
                <TableCell align="right">
                  {parseInt(medicine.medicineQuantity) || 0}
                </TableCell>
                <TableCell align="right">
                  {ccyFormat(parseFloat(medicine.medicineUnitPrice) || 0)}
                </TableCell>
                <TableCell align="right">
                  {ccyFormat(
                    (parseInt(medicine.medicineQuantity) || 0) *
                      (parseFloat(medicine.medicineUnitPrice) || 0)
                  )}
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell rowSpan={3} />
              <TableCell colSpan={3}>Net Amount</TableCell>
              <TableCell align="right">
                {ccyFormat(
                  subtotal(
                    invoiceObject.medicineData.map((medicine) => ({
                      desc: ` ${medicine.medicineBrandName}`,
                      qty: parseInt(medicine.medicineQuantity) || 0,
                      unit: parseFloat(medicine.medicineUnitPrice) || 0,
                      price:
                        (parseInt(medicine.medicineQuantity) || 0) *
                        (parseFloat(medicine.medicineUnitPrice) || 0),
                    }))
                  )
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3}>Paid Amount</TableCell>
              <TableCell align="right">
                <TextField
                  type="text"
                  value={payment}
                  onChange={handleChangePayment}
                  error={!!paymentError}
                  helperText={paymentError}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3}>Balance</TableCell>
              <TableCell align="right">{ccyFormat(balance)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={4} />
              <TableCell align="right">
                <Button variant="contained" onClick={handlePayInvoice}>
                  Pay Invoice
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Button onClick={handleShowBill}>Show bill</Button>
      </TableContainer>

      <Dialog open={showBill} onClose={handleCloseBill} maxWidth="md" fullWidth>
        <DialogTitle>Invoice Bill</DialogTitle>
        <DialogContent dividers>
          <Bill invoiceObject={invoiceObject} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBill} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
function InvoiceForm({ addMedicineData }) {
  // State variables
  const [idErrors, setIdErrors] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [medicineData, setMedicineData] = useState({
    medicineBrandName: "",
    medicineGenericName: "",
    medicineUnitPrice: 0,
  });
  const [medicineId, setMedicineId] = useState("");
  const [quantity, setQuantity] = useState("");

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};

    // Check if medicine data exists
    if (
      !medicineData.medicineBrandName ||
      !medicineData.medicineGenericName ||
      !medicineData.medicineUnitPrice
    ) {
      validationErrors.medicine =
        "Please search for a valid medicine ID first.";
    }
    if (!quantity.trim()) {
      validationErrors.quantity = "Quantity is required.";
    } else if (!/^\d+$/.test(quantity.trim())) {
      validationErrors.quantity = "Quantity should be a number.";
    } else if (
      parseInt(quantity.trim()) > medicineData.medicineInHandQuantity
    ) {
      validationErrors.quantity = "Quantity exceeds available quantity.";
    }

    setFormErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const newMedicineData = {
        ...medicineData,
        medicineQuantity: quantity,
      };

      addMedicineData(newMedicineData);

      // Reset the form fields
      setMedicineData({
        medicineBrandName: "",
        medicineGenericName: "",
        medicineUnitPrice: 0,
      });
      setMedicineId("");
      setQuantity("");
    }
  };

  // Function to handle medicine ID input change
  const handleChangeId = (e) => {
    setMedicineId(e.target.value);
  };

  // Function to handle quantity input change
  const handleChangeQuantity = (e) => {
    setQuantity(e.target.value);
  };

  // Function to handle medicine ID form submission
  const handleSubmitId = async (e) => {
    e.preventDefault();
    const validationErrors = {};

    // Regular expression to match the required pattern: 2-3 letters followed by up to 5 digits
    const idPattern = /^[A-Za-z]{2,3}\d{1,5}$/;

    if (!medicineId.trim()) {
      validationErrors.medicineId = "ID is required";
    } else if (!idPattern.test(medicineId.trim())) {
      validationErrors.medicineId =
        "ID should be 2-3 letters followed by up to 5 digits";
    }
    setIdErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const res = await axios.get(
          `http://localhost:8080/searchMedicinebyId/${medicineId}`
        );
        setMedicineData({
          medicineId: res.data.medicine_id,
          medicineBrandName: res.data.medicine_brandname,
          medicineGenericName: res.data.medicine_genericname,
          medicineUnitPrice: res.data.medicine_unitprice,
          medicineInHandQuantity: res.data.medicine_inhandquantity,
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div>
      <Box component={Paper} sx={{ p: 4, borderRadius: 3 }} elevation={4}>
        <form noValidate onSubmit={handleSubmitId}>
          <Form.Group className="mb-3" controlId="medicineid">
            <Form.Label>Medicine Id</Form.Label>
            <Form.Control
              type="text"
              name="medicineid"
              placeholder="Enter ID"
              onChange={handleChangeId}
              value={medicineId}
              isInvalid={!!idErrors.medicineId}
            />
            <Form.Control.Feedback type="invalid">
              {idErrors.medicineId}
            </Form.Control.Feedback>
            <Button type="submit">Search</Button>
          </Form.Group>
        </form>

        <form noValidate onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="medicineGenericName">
            <Form.Label>Medicine Generic Name</Form.Label>
            <Form.Control
              type="text"
              name="medicineGenericName"
              disabled={true}
              value={medicineData.medicineGenericName}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="medicineBrandName">
            <Form.Label>Medicine Brand Name</Form.Label>
            <Form.Control
              type="text"
              name="medicineBrandName"
              value={medicineData.medicineBrandName}
              disabled={true}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="unitPrice">
            <Form.Label>Unit Price</Form.Label>
            <Form.Control
              type="text"
              name="unitPrice"
              disabled={true}
              value={medicineData.medicineUnitPrice}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="quantity">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="text"
              name="quantity"
              placeholder="Enter quantity"
              onChange={handleChangeQuantity}
              value={quantity}
              isInvalid={!!formErrors.quantity}
            />
            <Form.Control.Feedback type="invalid">
              {formErrors.quantity}
            </Form.Control.Feedback>
            Remaining Stock : {medicineData.medicineInHandQuantity}
          </Form.Group>
          <Button type="submit" variant="contained">
            Submit
          </Button>
          {formErrors.medicine && (
            <div className="invalid-feedback d-block">
              {formErrors.medicine}
            </div>
          )}
        </form>
      </Box>
    </div>
  );
}
function Bill({ invoiceObject }) {
  const handleDownload = () => {
    const capture = document.querySelector(`.bill`);

    html2canvas(capture, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const doc = new jsPDF("p", "mm", "a4");
      const componentWidth = doc.internal.pageSize.getWidth();
      const componentHeight = (canvas.height * componentWidth) / canvas.width;
      doc.addImage(imgData, "PNG", 0, 0, componentWidth, componentHeight);
      doc.save(`Invoice Recipt.pdf`);
    });
  };

  // Calculate subtotal of the invoice
  const subtotal = invoiceObject.medicineData.reduce((sum, medicine) => {
    const price = parseFloat(medicine.medicineUnitPrice) || 0;
    const quantity = parseInt(medicine.medicineQuantity) || 0;
    return sum + price * quantity;
  }, 0);

  // Calculate balance
  const balance = parseFloat(invoiceObject.paidAmount) - subtotal;

  // Get current date and time
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString();
  const formattedTime = currentDate.toLocaleTimeString();

  return (
    <div className="bill">
      <Paper sx={{ p: 3 }}>
        <Typography
          sx={{
            p: 1,
            backgroundColor: "#b27fff",
            color: "white",
            width: "100%",
          }}
          variant="h4"
          align="center"
        >
          Wijaya Pharmacy
        </Typography>

        <Typography align="center" variant="h6">
          Invoice
        </Typography>
        <Typography>Invoice Id: {invoiceObject.invoiceId}</Typography>
        <Typography>Date: {formattedDate}</Typography>
        <Typography>Time: {formattedTime}</Typography>
        <br />
        <Typography>
          Cashier name : {localStorage.getItem("username")}
        </Typography>

        <TableContainer
          component={Paper}
          elevation={1}
          sx={{ borderRadius: 1, marginTop: 2 }}
        >
          <Table sx={{ minWidth: 700 }} aria-label="spanning table">
            <TableHead>
              <TableRow>
                <TableCell>Item no.</TableCell>
                <TableCell>Desc</TableCell>
                <TableCell align="right">Qty.</TableCell>
                <TableCell align="right">Unit Price</TableCell>
                <TableCell align="right">Sum</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoiceObject.medicineData.map((medicine, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{medicine.medicineBrandName}</TableCell>
                  <TableCell align="right">
                    {medicine.medicineQuantity}
                  </TableCell>
                  <TableCell align="right">
                    {ccyFormat(medicine.medicineUnitPrice)}
                  </TableCell>
                  <TableCell align="right">
                    {ccyFormat(
                      medicine.medicineQuantity * medicine.medicineUnitPrice
                    )}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell rowSpan={3} />
                <TableCell colSpan={3}>Net Amount</TableCell>
                <TableCell align="right">{ccyFormat(subtotal)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={3}>Paid Amount</TableCell>
                <TableCell align="right">
                  {ccyFormat(invoiceObject.paidAmount)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={3}>Balance</TableCell>
                <TableCell align="right">{ccyFormat(balance)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Button onClick={() => handleDownload()}>download</Button>
    </div>
  );
}
