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
    paidAmount: 0, // Initialize paidAmount as 0
  });

  useEffect(() => {
    const createNewInvoice = async () => {
      try {
        const response = await axios.get("http://localhost:8080/createNewInvoice");
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
    try {
      // Send a request to the backend to create a new invoice
      const response = await axios.get(
        `http://localhost:8080/createNewInvoice`
      );
      const newInvoiceId = response.data;
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
            <div className="left">
               {/* <IconBreadcrumbs /> */}
            <div style={{ paddingRight: "20px"}}>
              <h3>Invoice Bill</h3>
            </div>
            </div>
            <div className="right">
              <h5>
                Invoice Id: {invoiceObject.invoiceId && invoiceObject.invoiceId}
              </h5>{" "}
              {/* Display the invoiceId */}
              <Button onClick={handleCreateNew}>+ Create New</Button>
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
