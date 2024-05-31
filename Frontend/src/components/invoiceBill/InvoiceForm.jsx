import React, { useState } from "react";
import { Box, Button, Paper } from "@mui/material";
import Form from "react-bootstrap/Form";
import axios from "axios";

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

export default InvoiceForm;
