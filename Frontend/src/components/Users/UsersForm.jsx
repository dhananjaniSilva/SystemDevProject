import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Box, Paper } from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";

export default function UsersForm({ selectedUser, setUsers }) {
  const [currentForm, setCurrentForm] = useState("submit"); // 'submit' or 'update'

  const handleFormSwitch = (formType) => {
    setCurrentForm(formType);
  };

  return (
    <Box component={Paper} elevation={3} sx={{ borderRadius: 3, p: 2 }}>
      <Button onClick={() => handleFormSwitch("submit")}>
        Create New User
      </Button>
      <Button onClick={() => handleFormSwitch("update")}>Update Form</Button>
      {currentForm === "submit" ? (
        <SubmitUserForm setUsers={setUsers} />
      ) : (
        <UpdateUserForm selectedUser={selectedUser} setUsers={setUsers} />
      )}
    </Box>
  );
}

function SubmitUserForm({ setUsers }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/createUser",
        data
      );
      if (response.data.success) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "User added successfully",
          showConfirmButton: false,
          timer: 1500,
        });
        const updatedUsers = await axios.get("http://localhost:8080/getUsers");
        setUsers(updatedUsers.data);
        reset();
      } else {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Failed to add user",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error("Error in onSubmit:", error);
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "An error occurred",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group className="mb-3" controlId="user_fname">
        <Form.Label>First Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter first name"
          {...register("user_fname", {
            required: "First name is required",
            pattern: {
              value: /^[A-Za-z]+$/,
              message: "First name should contain letters only",
            },
          })}
        />
        {errors.user_fname && (
          <Form.Text className="text-danger">
            {errors.user_fname.message}
          </Form.Text>
        )}
      </Form.Group>
      <Form.Group className="mb-3" controlId="user_lname">
        <Form.Label>Last Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter last name"
          {...register("user_lname", {
            required: "Last name is required",
            pattern: {
              value: /^[A-Za-z]+$/,
              message: "Last name should contain letters only",
            },
          })}
        />
        {errors.user_lname && (
          <Form.Text className="text-danger">
            {errors.user_lname.message}
          </Form.Text>
        )}
      </Form.Group>
      <Form.Group className="mb-3" controlId="user_role_id">
        <Form.Label>Role ID</Form.Label>
        <Form.Select
          aria-label="Role ID"
          {...register("user_role_id", { required: "Role is required" })}
        >
          <option value="">Select Role</option>
          <option value={1}>Manager</option>
          <option value={2}>Cashier</option>
          <option value={3}>Purchasing Clerk</option>
          <option value={4}>Inventory Clerk</option>
          <option value={5}>Staff</option>
        </Form.Select>
        {errors.user_role_id && (
          <Form.Text className="text-danger">
            {errors.user_role_id.message}
          </Form.Text>
        )}
      </Form.Group>
      <Form.Group className="mb-3" controlId="user_nic">
        <Form.Label>NIC</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter NIC"
          {...register("user_nic", {
            required: "NIC is required",
            pattern: {
              value: /^(?:[0-9]{9}[VvXx]|[0-9]{12})$/,
              message: "Invalid NIC format",
            },
          })}
        />
        {errors.user_nic && (
          <Form.Text className="text-danger">
            {errors.user_nic.message}
          </Form.Text>
        )}
      </Form.Group>
      <Form.Group className="mb-3" controlId="user_pno">
        <Form.Label>Phone Number</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter phone number"
          {...register("user_pno", {
            required: "Phone number is required",
            pattern: {
              value: /^\+?[0-9]+$/,
              message: "Invalid phone number format",
            },
          })}
        />
        {errors.user_pno && (
          <Form.Text className="text-danger">
            {errors.user_pno.message}
          </Form.Text>
        )}
      </Form.Group>
      <Form.Group className="mb-3" controlId="user_password">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter password"
          {...register("user_password", {
            required: "Password is required",
            pattern: {
              value:
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d!@#$%^&*_-]{8,}$/,
              message:
                "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
            },
          })}
        />
        {errors.user_password && (
          <Form.Text className="text-danger">
            {errors.user_password.message}
          </Form.Text>
        )}
      </Form.Group>
      <Form.Group className="mb-3" controlId="user_username">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter username"
          {...register("user_username", {
            required: "Username is required",
            pattern: {
              value: /^[a-zA-Z][a-zA-Z0-9_.]+$/,
              message:
                "Username must start with a letter and contain only alphanumeric characters, underscores, and periods",
            },
          })}
        />
        {errors.user_username && (
          <Form.Text className="text-danger">
            {errors.user_username.message}
          </Form.Text>
        )}
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}

function UpdateUserForm({ selectedUser, setUsers }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  useEffect(() => {
    if (selectedUser) {
      setValue("user_fname", selectedUser.user_fname);
      setValue("user_lname", selectedUser.user_lname);
      setValue("user_role_id", selectedUser.user_role_id);
      setValue("user_nic", selectedUser.user_nic);
      setValue("user_pno", selectedUser.user_pno);
      setValue("user_username", selectedUser.user_username);
      setValue("user_id",selectedUser.user_id)
      // Add more fields if needed
    } else {
      reset();
    }
  }, [selectedUser, setValue, reset]);

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const response = await axios.put(
        `http://localhost:8080/updateUser/${selectedUser.user_id}`,
        data
      );

      if (response.data.success) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "User updated successfully",
          showConfirmButton: false,
          timer: 1500,
        });
        const updatedUsers = await axios.get("http://localhost:8080/getUsers");
        setUsers(updatedUsers.data);
        reset();
      } else {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Failed to update user",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error("Error in onSubmit:", error);
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "An error occurred",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group className="mb-3" controlId="user_fname">
        <Form.Label>First Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter first name"
          {...register("user_fname", {
            required: "First name is required",
            pattern: {
              value: /^[A-Za-z]+$/,
              message: "First name should contain letters only",
            },
          })}
        />
        {errors.user_fname && (
          <Form.Text className="text-danger">
            {errors.user_fname.message}
          </Form.Text>
        )}
      </Form.Group>
      <Form.Group className="mb-3" controlId="user_lname">
        <Form.Label>Last Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter last name"
          {...register("user_lname", {
            required: "Last name is required",
            pattern: {
              value: /^[A-Za-z]+$/,
              message: "Last name should contain letters only",
            },
          })}
        />
        {errors.user_lname && (
          <Form.Text className="text-danger">
            {errors.user_lname.message}
          </Form.Text>
        )}
      </Form.Group>
      <Form.Group className="mb-3" controlId="user_role_id">
        <Form.Label>Role ID</Form.Label>
        <Form.Select
          aria-label="Role ID"
          {...register("user_role_id", { required: "Role is required" })}
        >
          <option value="">Select Role</option>
          <option value={1}>Manager</option>
          <option value={2}>Cashier</option>
          <option value={3}>Purchasing Clerk</option>
          <option value={4}>Inventory Clerk</option>
          <option value={5}>Staff</option>
        </Form.Select>
        {errors.user_role_id && (
          <Form.Text className="text-danger">
            {errors.user_role_id.message}
          </Form.Text>
        )}
      </Form.Group>
      <Form.Group className="mb-3" controlId="user_nic">
        <Form.Label>NIC</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter NIC"
          {...register("user_nic", {
            required: "NIC is required",
            validate: (value) => {
              const nineDigitsAndV = /^[0-9]{9}[VvXx]$/;
              const twelveDigits = /^[0-9]{12}$/;
              return (
                nineDigitsAndV.test(value) ||
                twelveDigits.test(value) ||
                "Invalid NIC format"
              );
            },
          })}
        />
        {errors.user_nic && (
          <Form.Text className="text-danger">
            {errors.user_nic.message}
          </Form.Text>
        )}
      </Form.Group>
      <Form.Group className="mb-3" controlId="user_pno">
        <Form.Label>Phone Number</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter phone number"
          {...register("user_pno", {
            required: "Phone number is required",
            validate: (value) => {
              if (typeof value !== "string")
                return "Invalid phone number format";

              const cleanedValue = value.replace(/[-\s]/g, "").trim();
              const validFormatCheck1 = /^[1-9]\d{8}$/; // 10 digits starting with a non-zero digit
              const validFormatCheck2 = /^[0]\d{9}$/; // 10 digits starting with zero
              return (
                validFormatCheck1.test(cleanedValue) ||
                validFormatCheck2.test(cleanedValue) ||
                "Invalid phone number format"
              );
            },
          })}
        />
        {errors.user_pno && (
          <Form.Text className="text-danger">
            {errors.user_pno.message}
          </Form.Text>
        )}
      </Form.Group>
      <Form.Group className="mb-3" controlId="user_password">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter password"
          {...register("user_password", {
            required: "Password is required",
            pattern: {
              value:
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d!@#$%^&*_-]{8,}$/,
              message:
                "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
            },
          })}
        />
        {errors.user_password && (
          <Form.Text className="text-danger">
            {errors.user_password.message}
          </Form.Text>
        )}
      </Form.Group>
      <Form.Group className="mb-3" controlId="user_username">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter username"
          {...register("user_username", {
            required: "Username is required",
            pattern: {
              value: /^[a-zA-Z][a-zA-Z0-9_.]+$/,
              message:
                "Username must start with a letter and contain only alphanumeric characters, underscores, and periods",
            },
          })}
          disabled={true} // disable this field for updates
        />
        {errors.user_username && (
          <Form.Text className="text-danger">
            {errors.user_username.message}
          </Form.Text>
        )}
      </Form.Group>
      <Button variant="primary" type="submit">
        Update
      </Button>
    </Form>
  );
}
