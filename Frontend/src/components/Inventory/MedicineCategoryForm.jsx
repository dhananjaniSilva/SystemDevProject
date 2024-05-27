import { Box, Button } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import Form from "react-bootstrap/Form";

export default function MedicineCategoryForm() {
  const [formData, setFormData] = useState({
    categoryName: "",
    categoryCode: "",
  });

  const [errors, setErrors] = useState({
    categoryName: "",
    categoryCode: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (name === "categoryCode") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        categoryCode: "",
      }));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/fetchListOfMedicineCategory"
        );

        // Extract mdct_code values from the response data
        const mdctCodes = response.data.map((item) => item.mdct_code);

        // Check if the entered category code exists in mdctCodes array
        if (mdctCodes.includes(formData.categoryCode.trim())) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            categoryCode: "Category Code already exists",
          }));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [formData.categoryCode]); // Trigger the effect whenever categoryCode changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { categoryName, categoryCode } = formData;

    // Validation logic
    let errors = {};

    if (!categoryName.trim()) {
      errors.categoryName = "Category Name is required";
    }

    if (!categoryCode.trim()) {
      errors.categoryCode = "Category Code is required";
    } else {
      if (!/^[D]/.test(categoryCode.trim())) {
        errors.categoryCode = "Category Code must start with 'D'";
      }
      if (!/^[A-Z]{2,3}$/.test(categoryCode.trim())) {
        errors.categoryCode =
          "Category Code must have a minimum of 2 and a maximum of 3 characters";
      }
      if (!/^[A-Z]/.test(categoryCode.trim())) {
        errors.categoryCode = "Category Code must be in uppercase";
      }
    }

    if (Object.keys(errors).length === 0) {
      try {
        // Send POST request
        const response = await axios.post(
          "http://localhost:8080/createMedicineCategory",
          {
            categoryName: formData.categoryName,
            categoryCode: formData.categoryCode,
          }
        );
        console.log(response);
        // Form submission successful, reset form and errors
        console.log("Form submitted:", formData);
        setFormData({
          categoryName: "",
          categoryCode: "",
        });
        setErrors({
          categoryName: "",
          categoryCode: "",
        });

        // Remove focus from all text fields
        const formInputs = document.querySelectorAll("input");
        formInputs.forEach((input) => input.blur());
      } catch (error) {
        console.error("Error submitting form:", error);
        // Handle error if POST request fails
      }
    } else {
      // Update errors state
      setErrors(errors);
    }
  };

  return (
    <Box sx={{ m: 2 }}>
      <form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="categoryName">
          <Form.Label>Medicine Category Name</Form.Label>
          <Form.Control
            type="text"
            name="categoryName"
            placeholder="Enter category name"
            value={formData.categoryName}
            onChange={handleChange}
            isInvalid={!!errors.categoryName}
          />
          <Form.Control.Feedback type="invalid">
            {errors.categoryName}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="categoryCode">
          <Form.Label>Category Code</Form.Label>
          <Form.Control
            type="text"
            name="categoryCode"
            placeholder="Enter category code"
            value={formData.categoryCode}
            onChange={handleChange}
            isInvalid={!!errors.categoryCode}
          />
          <Form.Control.Feedback type="invalid">
            {errors.categoryCode}
          </Form.Control.Feedback>
        </Form.Group>
        <Button
          type="submit"
          variant="contained"
          disabled={!!errors.categoryCode}
        >
          Submit
        </Button>
      </form>
    </Box>
  );
}

export function MedicineCategoryUpdateForm({ medicineCategoryId }) {
  const [formData, setFormData] = useState({
    categoryName: "",
    categoryCode: "",
  });

  const [errors, setErrors] = useState({
    categoryName: "",
    categoryCode: "",
  });

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/fetchMedicineCategoryById/${medicineCategoryId}`
        );
        const categoryData = response.data;
        setFormData({
          categoryName: categoryData.mdct_name,
          categoryCode: categoryData.mdct_code,
        });
      } catch (error) {
        console.error("Error fetching category data:", error);
      }
    };

    if (medicineCategoryId) {
      fetchCategoryData();
    }
  }, [medicineCategoryId]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get(
  //         "http://localhost:8080/fetchListOfMedicineCategory"
  //       );
  //       const mdctCodes = response.data.map((item) => item.mdct_code);

  //       if (mdctCodes.includes(formData.categoryCode.trim())) {
  //         setErrors((prevErrors) => ({
  //           ...prevErrors,
  //           categoryCode: "Category Code already exists",
  //         }));
  //       }
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }

  //   };
  //   fetchData();
  // }, [formData.categoryCode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (name === "categoryCode") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        categoryCode: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { categoryName, categoryCode } = formData;

    let errors = {};

    if (!categoryName.trim()) {
      errors.categoryName = "Category Name is required";
    }

    if (!categoryCode.trim()) {
      errors.categoryCode = "Category Code is required";
    } else {
      if (!/^[D]/.test(categoryCode.trim())) {
        errors.categoryCode = "Category Code must start with 'D'";
      }
      if (!/^[A-Z]{2,3}$/.test(categoryCode.trim())) {
        errors.categoryCode =
          "Category Code must have a minimum of 2 and a maximum of 3 characters";
      }
      if (!/^[A-Z]/.test(categoryCode.trim())) {
        errors.categoryCode = "Category Code must be in uppercase";
      }
    }

    if (Object.keys(errors).length === 0) {
      try {
        const response = await axios.put(
          `http://localhost:8080/updateMedicineCategory/${medicineCategoryId}`,
          {
            mdct_name: categoryName,
            mdct_code: categoryCode,
          }
        );
        console.log(response.data);
        console.log(response);
        setFormData({
          categoryName: "",
          categoryCode: "",
        });
        setErrors({
          categoryName: "",
          categoryCode: "",
        });

        const formInputs = document.querySelectorAll("input");
        formInputs.forEach((input) => input.blur());
      } catch (error) {
        console.error("Error updating category:", error);
      }
    } else {
      setErrors(errors);
    }
  };

  return (
    <Box sx={{ m: 2 }}>
      <form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="categoryName">
          <Form.Label style={{fontSize:20}}>Medicine Category Form</Form.Label>
          <hr />

          <Form.Label style={{ fontSize: 14 }}>
            Medicine ID : {medicineCategoryId}
          </Form.Label>

          <Form.Control
            type="text"
            name="categoryName"
            placeholder="Enter category name"
            value={formData.categoryName}
            onChange={handleChange}
            isInvalid={!!errors.categoryName}
          />
          <Form.Control.Feedback type="invalid">
            {errors.categoryName}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="categoryCode">
          <Form.Label>Category Code</Form.Label>
          <Form.Control
            type="text"
            name="categoryCode"
            placeholder="Enter category code"
            value={formData.categoryCode}
            onChange={handleChange}
            isInvalid={!!errors.categoryCode}
          />
          <Form.Control.Feedback type="invalid">
            {errors.categoryCode}
          </Form.Control.Feedback>
        </Form.Group>
        <Button
          type="submit"
          variant="contained"
          disabled={!!errors.categoryCode}
        >
          Update
        </Button>
      </form>
    </Box>
  );
}
