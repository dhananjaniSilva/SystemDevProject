import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Paper,
  FormControl,
  FormHelperText,
} from "@mui/material";

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
  const [formErrors, setFormErrors] = useState({
    companyName: false,
    medicineId: false,
    sply_quantity: false,
    sply_datetime: false,
    sply_expiredate: false,
    sply_unit_buying_price: false,
  });

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
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          companyName: false,
        }));
      } else {
        setSupplierInfo(null);
        setStockObject((prevState) => ({
          ...prevState,
          supplierId: undefined,
        }));
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          companyName: true,
        }));
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
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        medicineId: false,
      }));
    } catch (error) {
      console.error("There was an error fetching the medicine data!", error);
      setMedicineInfo(null);
      setStockObject((prevState) => ({
        ...prevState,
        medicineId: undefined,
      }));
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        medicineId: true,
      }));
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
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [e.target.name]: false,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    const errors = {};
    if (!companyName) {
      errors.companyName = true;
    }
    if (!medicineId) {
      errors.medicineId = true;
    }
    if (!supplyDetails.sply_quantity) {
      errors.sply_quantity = true;
    }
    if (!supplyDetails.sply_datetime) {
      errors.sply_datetime = true;
    }
    if (!supplyDetails.sply_expiredate) {
      errors.sply_expiredate = true;
    }
    if (!supplyDetails.sply_unit_buying_price) {
      errors.sply_unit_buying_price = true;
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

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
        Enter Stock Details
      </Typography>
      <Grid container>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Supplier Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            error={formErrors.companyName}
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
          {formErrors.companyName && (
            <FormControl error>
              <FormHelperText>This field is required.</FormHelperText>
            </FormControl>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Medicine ID"
            value={medicineId}
            onChange={(e) => setMedicineId(e.target.value)}
            error={formErrors.medicineId}
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
          {formErrors.medicineId && (
            <FormControl error>
              <FormHelperText>This field is required.</FormHelperText>
            </FormControl>
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
              error={formErrors.sply_quantity}
            />
            {formErrors.sply_quantity && (
              <FormControl error>
                <FormHelperText>This field is required.</FormHelperText>
              </FormControl>
            )}
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
              error={formErrors.sply_datetime}
            />
            {formErrors.sply_datetime && (
              <FormControl error>
                <FormHelperText>This field is required.</FormHelperText>
              </FormControl>
            )}
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
              error={formErrors.sply_expiredate}
            />
            {formErrors.sply_expiredate && (
              <FormControl error>
                <FormHelperText>This field is required.</FormHelperText>
              </FormControl>
            )}
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
              error={formErrors.sply_unit_buying_price}
            />
            {formErrors.sply_unit_buying_price && (
              <FormControl error>
                <FormHelperText>This field is required.</FormHelperText>
              </FormControl>
            )}
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
