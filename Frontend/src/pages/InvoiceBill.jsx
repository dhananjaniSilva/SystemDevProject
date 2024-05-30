import React, { useEffect, useState } from "react";
import "../stylings/pages/invoiceBill.css";
import InvoiceForm from "../components/invoiceBill/InvoiceForm";
import InvoiceTable from "./../components/invoiceBill/InvoiceTable";
import { Button } from "@mui/material";
import axios from "axios";

export default function InvoiceBill() {
  const [invoiceObject, setInvoiceObject] = useState({
    medicineData: [],
    invoiceId: "", // Initialize invoiceId as empty string
    paidAmount: 0 // Initialize paidAmount as 0
  });

  useEffect(()=>{
    console.log(invoiceObject)
  },[invoiceObject])
  // Function to add medicine data to the list
  const addMedicineData = (newMedicine) => {
    setInvoiceObject({
      ...invoiceObject,
      medicineData: [...invoiceObject.medicineData, newMedicine],
    });
  };

  // Function to handle creating a new invoice
  const handleCreateNew = async () => {
    try {
      // Send a request to the backend to create a new invoice
      const response = await axios.get(
        `http://localhost:8080/createNewInvoice`
      );
      const newInvoiceId = response.data;
      console.log("New Invoice ID:", newInvoiceId);
      setInvoiceObject({
        ...invoiceObject,
        invoiceId: newInvoiceId, // Set the retrieved invoice ID in the invoiceObject
      });
    } catch (error) {
      // Handle error response
      console.error(error);
    }
  };

  return (
    <>
      <div className="body">
        <div className="outer-div">
          <div className="top">
            <div className="left"></div>
            <div className="right">
              <h5>
                Invoice Id: {invoiceObject.invoiceId && invoiceObject.invoiceId}
              </h5>{" "}
              {/* Display the invoiceId */}
              <Button onClick={handleCreateNew}>Create new +</Button>
            </div>
          </div>
          <div className="bodypart-div">
            <div className="bodypart-left">
              <InvoiceForm addMedicineData={addMedicineData} />
            </div>
            <div className="bodypart-right">
              <InvoiceTable invoiceObject={invoiceObject} setInvoiceObject={setInvoiceObject} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
