import React, { useState } from "react";
import "../stylings/pages/invoiceBill.css";
import InvoiceForm from "../components/invoiceBill/InvoiceForm";
import InvoiceTable from "./../components/invoiceBill/InvoiceTable";
import { Button } from "@mui/material";
import axios from "axios";

export default function InvoiceBill() {
  const [invoiceObject, setInvoiceObject] = useState({ medicineData: [] });

  // Function to add medicine data to the list
  const addMedicineData = (newMedicine) => {
    setInvoiceObject({ medicineData: [...invoiceObject.medicineData, newMedicine] });
  };

  const handleCreateNew = () => {
    // Send a request to the backend to create a new invoice
    axios.get(`http://localhost:8080/createNewInvoice`)
      .then(response => {
        // Handle success response
        console.log(response.data);
      })
      .catch(error => {
        // Handle error response
        console.error(error);
      });
  };

  return (
    <>
      <div className="body">
        <div className="outer-div">
          <div className="top">
            <div className="left"></div>
            <div className="right"><Button onClick={handleCreateNew}>Create new +</Button></div>
          </div>
          <div className="bodypart-div">
            <div className="bodypart-left">
              <InvoiceForm addMedicineData={addMedicineData} />
            </div>
            <div className="bodypart-right">
              <InvoiceTable medicineData={invoiceObject.medicineData} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
