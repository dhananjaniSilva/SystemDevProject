import React, { useState } from "react";
import axios from "axios";
import { Box, Button, TextField, Typography, Grid, Paper } from "@mui/material";

const SupplyForm = () => {
  const [companyName, setCompanyName] = useState("");
  const [medicineId, setMedicineId] = useState("");
  const [supplierInfo, setSupplierInfo] = useState(null);
  const [medicineInfo, setMedicineInfo] = useState(null);
  const [supplyDetails, setSupplyDetails] = useState({
    sply_quantity: "",
    sply_datetime: "",
    sply_expiredate: "",
    sply_unit_buying_price: "",
  });
  const [stockObject, setStockObject] = useState({});

  const handleSearchSupplier = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/searchSupplierbyCompanyname/${companyName}`
      );

      const suppliers = response.data;

      if (Array.isArray(suppliers) && suppliers.length > 0) {
        const supplierInfo = suppliers[0];

        setSupplierInfo(supplierInfo);
        setStockObject((prevState) => ({
          ...prevState,
          supplierId: supplierInfo.sp_id,
        }));
      } else {
        console.log("No suppliers found.");
      }
    } catch (error) {
      console.error("There was an error fetching the supplier data!", error);
    }
  };

  const handleSearchMedicine = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/searchMedicinebyId/${medicineId}`
      );
      const medicine = response.data;
      setMedicineInfo(medicine);
      setStockObject((prevState) => ({
        ...prevState,
        medicineId: medicine.medicine_id,
      }));
    } catch (error) {
      console.error("There was an error fetching the medicine data!", error);
    }
  };

  const handleChange = (e) => {
    setSupplyDetails({
      ...supplyDetails,
      [e.target.name]: e.target.value,
    });
    setStockObject((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add validation logic here
    if (
      !companyName ||
      !medicineId ||
      !supplyDetails.sply_quantity ||
      !supplyDetails.sply_datetime ||
      !supplyDetails.sply_expiredate ||
      !supplyDetails.sply_unit_buying_price
    ) {
      alert("Please fill in all fields");
      return;
    }
    console.log("Stock Object:", stockObject);
    try {
      const response = await axios.post(
        "http://localhost:8080/supplyDetailsCreate",
        stockObject
      );
      console.log(response.data);
      alert("Supply details submitted successfully!");
    } catch (error) {
      console.error("There was an error submitting the supply details!", error);
    }
  };

  return (
    <Box sx={{ p: 2, borderRadius: 3 }} component={Paper}>
      <Typography variant="h4" gutterBottom>
        Enter Supply Details
      </Typography>
      <Grid container>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Supplier Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            sx={{ width: "200px" }}
          />
          <Button
            variant="contained"
            onClick={handleSearchSupplier}
            sx={{ mt: 2 }}
          >
            Search Supplier
          </Button>
          {supplierInfo && (
            <Box sx={{ mt: 2 }}>
              <Typography>
                Supplier Name: {supplierInfo.sp_companyname}
              </Typography>
              <Typography>Phone Number: {supplierInfo.sp_pno}</Typography>
              <Typography>
                Agent Name: {supplierInfo.sp_fname} {supplierInfo.sp_lname}
              </Typography>
            </Box>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Medicine ID"
            value={medicineId}
            onChange={(e) => setMedicineId(e.target.value)}
            sx={{ width: "200px" }}
          />
          <Button
            variant="contained"
            onClick={handleSearchMedicine}
            sx={{ mt: 2 }}
          >
            Search Medicine
          </Button>
          {medicineInfo && (
            <Box sx={{ mt: 2 }}>
              <Typography>
                Brand Name: {medicineInfo.medicine_brandname}
              </Typography>
              <Typography>
                Generic Name: {medicineInfo.medicine_genericname}
              </Typography>
              <Typography>
                Unit Price: {medicineInfo.medicine_unitprice}
              </Typography>
              <Typography>
                Pack Size: {medicineInfo.medicine_packsize}
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>
      <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Received Quantity"
              name="sply_quantity"
              value={supplyDetails.sply_quantity}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Received Date and Time"
              name="sply_datetime"
              type="datetime-local"
              value={supplyDetails.sply_datetime}
              onChange={handleChange}
              fullWidth
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Expire Date"
              name="sply_expiredate"
              type="date"
              value={supplyDetails.sply_expiredate}
              onChange={handleChange}
              fullWidth
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Unit Buying Price"
              name="sply_unit_buying_price"
              type="number"
              value={supplyDetails.sply_unit_buying_price}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
        </Grid>
        <Button variant="contained" type="submit" sx={{ mt: 3 }}>
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default SupplyForm;
