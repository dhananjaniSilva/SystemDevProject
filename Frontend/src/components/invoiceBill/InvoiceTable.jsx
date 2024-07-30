import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";

// Helper function to format currency
function ccyFormat(num) {
  const number = parseFloat(num);
  if (isNaN(number)) {
    return "0.00";
  }
  return `${number.toFixed(2)}`;
}

// Helper function to calculate the subtotal of items
function subtotal(items) {
  return items
    .map(({ price }) => parseFloat(price) || 0)
    .reduce((sum, i) => sum + i, 0);
}

// Helper function to safely parse payment input
function parsePayment(payment) {
  return payment.trim() === "" ? 0 : parseFloat(payment);
}

function InvoiceTable({ invoiceObject, setInvoiceObject }) {
  // State to manage the payment amount and any errors
  const [payment, setPayment] = useState("");
  const [paymentError, setPaymentError] = useState("");

  // Handle changes in the payment input field
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

  // Handle the invoice payment process
  const handlePayInvoice = async () => {
    // Parse and validate the payment amount
    const parsedPayment = parsePayment(payment);
    if (isNaN(parsedPayment)) {
      setPaymentError("Payment amount must be a number.");
      return;
    }

    // Calculate the subtotal of the invoice
    const invoiceSubtotal = subtotal(invoiceObject.medicineData.map((medicine) => ({
      desc: ` ${medicine.medicineBrandName}`,
      qty: parseInt(medicine.medicineQuantity) || 0,
      unit: parseFloat(medicine.medicineUnitPrice) || 0,
      price:
        (parseInt(medicine.medicineQuantity) || 0) *
        (parseFloat(medicine.medicineUnitPrice) || 0),
    })));

    // Ensure the payment amount is greater than the subtotal
    if (parsedPayment <= invoiceSubtotal) {
      setPaymentError("Payment amount must be greater than the net amount.");
      return;
    }

    // Prepare the updated invoice object
    const currentDateTime = new Date().toISOString().slice(0, 19).replace("T", " ");
    const updatedInvoiceObject = {
      ...invoiceObject,
      paidAmount: parseFloat(payment),
      invoiceDate: currentDateTime,
      userId: localStorage.getItem("userId"),
    };

    try {
      // Send a request to complete the invoice
      const response = await axios.post("http://localhost:8080/completeInvoice", updatedInvoiceObject);
      // Update state with the new invoice data
      setInvoiceObject(updatedInvoiceObject);
      // Display a success message
      Swal.fire("Invoice paid successfully!", "", "success");
    } catch (error) {
      console.error("Error completing the invoice:", error);
    }
  };

  // Calculate the subtotal of the invoice
  const invoiceSubtotal = subtotal(invoiceObject.medicineData.map((medicine) => ({
    desc: ` ${medicine.medicineBrandName}`,
    qty: parseInt(medicine.medicineQuantity) || 0,
    unit: parseFloat(medicine.medicineUnitPrice) || 0,
    price:
      (parseInt(medicine.medicineQuantity) || 0) *
      (parseFloat(medicine.medicineUnitPrice) || 0),
  })));

  // Calculate the balance (remaining amount) after payment
  const balance = parsePayment(payment) - invoiceSubtotal;

  return (
    <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 3 }}>
      <Table sx={{ minWidth: 700 }} aria-label="spanning table">
        <TableHead>
          <TableRow>
            {/* Table headers */}
            <TableCell>Item no.</TableCell>
            <TableCell>Desc</TableCell>
            <TableCell align="right">Qty.</TableCell>
            <TableCell align="right">Unit Price</TableCell>
            <TableCell align="right">Sum</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Render each medicine item in the invoice */}
          {invoiceObject.medicineData.map((medicine, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{` ${medicine.medicineBrandName}`}</TableCell>
              <TableCell align="right">{parseInt(medicine.medicineQuantity) || 0}</TableCell>
              <TableCell align="right">{ccyFormat(parseFloat(medicine.medicineUnitPrice) || 0)}</TableCell>
              <TableCell align="right">{ccyFormat((parseInt(medicine.medicineQuantity) || 0) * (parseFloat(medicine.medicineUnitPrice) || 0))}</TableCell>
            </TableRow>
          ))}
          {/* Display the net amount, paid amount, and balance */}
          <TableRow>
            <TableCell rowSpan={3} />
            <TableCell colSpan={3}>Net Amount</TableCell>
            <TableCell align="right">{ccyFormat(invoiceSubtotal)}</TableCell>
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
    </TableContainer>
  );
}

export default InvoiceTable;
