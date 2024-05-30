import React, { useEffect, useState } from "react";
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

function ccyFormat(num) {
  return `${num.toFixed(2)}`;
}

function subtotal(items) {
  return items.map(({ price }) => price).reduce((sum, i) => sum + i, 0);
}

export default function InvoiceTable({ invoiceObject, setInvoiceObject }) {
  const [payment, setPayment] = useState("");
  const [paymentError, setPaymentError] = useState("");

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





  const handlePayInvoice = async () => {
    // Get the current datetime in the format "YYYY-MM-DD HH:MM:SS"
    const currentDateTime = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
  
    // Create the updated invoiceObject with paidAmount, invoiceDate, and userId
    const updatedInvoiceObject = {
      ...invoiceObject,
      paidAmount: parseFloat(payment),
      invoiceDate: currentDateTime,
      userId: localStorage.getItem("userId"),
    };
  
    try {
      // Send the updated invoiceObject to the backend to complete the invoice
      const response = await axios.post(
        "http://localhost:8080/completeInvoice",
        updatedInvoiceObject
      );
      console.log("This is the response",response)
      // Handle the response if needed
      // console.log("Invoice completed successfully:", response.data);
    } catch (error) {
      // Handle error response
      console.error("Error completing the invoice:", error);
    }
  };





  const rows = invoiceObject.medicineData.map((medicine, index) => ({
    desc: ` ${medicine.medicineBrandName}`,
    qty: parseInt(medicine.medicineQuantity),
    unit: parseFloat(medicine.medicineUnitPrice),
    price:
      parseInt(medicine.medicineQuantity) *
      parseFloat(medicine.medicineUnitPrice),
  }));

  const invoiceSubtotal = subtotal(rows);
  const balance = invoiceSubtotal - parseFloat(payment);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="spanning table">
        <TableHead>
          <TableRow>
            <TableCell>Index</TableCell>
            <TableCell>Desc</TableCell>
            <TableCell align="right">Qty.</TableCell>
            <TableCell align="right">Unit Price</TableCell>
            <TableCell align="right">Sum</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{row.desc}</TableCell>
              <TableCell align="right">{row.qty}</TableCell>
              <TableCell align="right">{ccyFormat(row.unit)}</TableCell>
              <TableCell align="right">{ccyFormat(row.price)}</TableCell>
            </TableRow>
          ))}
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
