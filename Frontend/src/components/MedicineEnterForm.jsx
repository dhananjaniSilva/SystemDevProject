import { Box, Button, FormLabel, Stack } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Swal from "sweetalert2";

function MedicineEnterForm() {
  const [medicineCategoryCodesArray, setMedicineCategoryCodesArray] = useState(
    []
  );
  const [medicineUnitArray, setMedicineUnitArray] = useState([]);
  const [formData, setFormData] = useState({
    medicine_brandname: "",
    medicine_genericname: "",
    unit_id: 0,
    mdct_id: 0,
    medicine_packsize: 0,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryResponse = await axios.get(
          "http://localhost:8080/fetchListOfMedicineCategory"
        );
        const unitResponse = await axios.get(
          "http://localhost:8080/fetchListOfMedicineUnit"
        );

        setMedicineCategoryCodesArray(
          categoryResponse.data.map((item) => ({
            id: item.mdct_id,
            code: item.mdct_code,
          }))
        );
        setMedicineUnitArray(
          unitResponse.data.map((item) => ({
            unit_id: item.unit_id,
            unit_name: item.unit_name,
          }))
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.medicine_brandname.trim()) {
      newErrors.medicine_brandname = "Brand Name is required";
    }

    if (!formData.medicine_genericname.trim()) {
      newErrors.medicine_genericname = "Generic Name is required";
    }

    if (!formData.unit_id) {
      newErrors.unit_id = "Unit Name is required";
    }

    if (!formData.mdct_id) {
      newErrors.mdct_id = "Category Code is required";
    }

    if (!formData.medicine_packsize) {
      newErrors.medicine_packsize = "Pack Size is required";
    }

    if (
      newErrors.medicine_brandname ||
      newErrors.medicine_genericname ||
      newErrors.unit_id ||
      newErrors.mdct_id ||
      newErrors.medicine_packsize
    ) {
      setErrors(newErrors);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/createMedicine",
        formData
      );
      console.log("Form submitted:", formData);
      console.log("API response:", response.data);

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Your medicine has been saved",
        showConfirmButton: false,
        timer: 1500,
      });

      // Optionally, you can reset the form data here
      setFormData({
        medicine_brandname: "",
        medicine_genericname: "",
        unit_id: 0,
        mdct_id: 0,
        medicine_packsize: 0,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Convert to integer if applicable
    const intValue =
      name === "medicine_packsize" || name === "unit_id" || name === "mdct_id"
        ? parseInt(value)
        : value;

    setFormData({
      ...formData,
      [name]: intValue,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  return (
    <Box sx={{ m: 2 }}>
      <form onSubmit={handleSubmit}>
        <Stack gap={2}>
          <Form.Group className="mb-3" controlId="medicine_brandname">
            <FormLabel>Brand Name</FormLabel>
            <Form.Control
              type="text"
              name="medicine_brandname"
              value={formData.medicine_brandname}
              onChange={handleChange}
              isInvalid={!!errors.medicine_brandname}
            />
            <Form.Control.Feedback type="invalid">
              {errors.medicine_brandname}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="medicine_genericname">
            <FormLabel>Generic Name</FormLabel>
            <Form.Control
              type="text"
              name="medicine_genericname"
              value={formData.medicine_genericname}
              onChange={handleChange}
              isInvalid={!!errors.medicine_genericname}
            />
            <Form.Control.Feedback type="invalid">
              {errors.medicine_genericname}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="unit_id">
            <FormLabel>Unit Name</FormLabel>
            <Form.Select
              name="unit_id"
              value={formData.unit_id}
              onChange={handleChange}
              isInvalid={!!errors.unit_id}
            >
              <option>Select Unit Name</option>
              {medicineUnitArray.map((unit) => (
                <option key={unit.unit_id} value={unit.unit_id}>
                  {unit.unit_name}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.unit_id}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="mdct_id">
            <FormLabel>Category Code</FormLabel>
            <Form.Select
              name="mdct_id"
              value={formData.mdct_id}
              onChange={handleChange}
              isInvalid={!!errors.mdct_id}
            >
              <option>Select Category Code</option>
              {medicineCategoryCodesArray.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.code}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.mdct_id}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="medicine_packsize">
            <FormLabel>Pack Size</FormLabel>
            <Form.Control
              type="number"
              name="medicine_packsize"
              value={formData.medicine_packsize}
              onChange={handleChange}
              isInvalid={!!errors.medicine_packsize}
            />
            <Form.Control.Feedback type="invalid">
              {errors.medicine_packsize}
            </Form.Control.Feedback>
          </Form.Group>

          <Button type="submit" variant="contained">
            Submit
          </Button>
        </Stack>
      </form>
    </Box>
  );
}

export default MedicineEnterForm;
