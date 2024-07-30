import React, { useState } from "react";
import {
  Box,
  FormLabel,
  Paper,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import logo from "../assets/logo.png";
import logotext from "../assets/logotext.png";
import axios from "axios";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";


//  decodes a JWT token to extract the payload, which contains information like user roles.
function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

function LoginPage() {
  //These are the Login Form validations that has registered under names of the text fields
  const schema = yup.object().shape({
    username: yup.string().required().min(3).max(12),
    password: yup.string().min(8, "Password must be at least 8 characters, First letter of the password should be capital and password must contain a special character (@, $, !, &, etc).").required("Password is required"),
  });

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

// State for handling login errors
  const [loginError, setLoginError] = useState("");
 // Hook for navigation
  const navigate = useNavigate();
//Form submission function
  const submitForm = async (data) => {
    console.log("This is the submitted data ", data);
    const { username, password } = data;

   // Check if the password is not provided
   if (!password) {
    // Set an error message if the password is missing
    setLoginError("Password is required.");
    return;
}

    const requestUserObjects = { username, password };

    try {
      const res = await axios.get(`http://localhost:8080/loginValidate`, {
        params: requestUserObjects,
      });
      console.log("This is the response", res.data);
      if (res.data.auth === true) {
        localStorage.setItem("token", res.data.token);
        //retrieve the role id from the decoded payload of the token by passing the token to the 
        //above parseJWT function
        const payLoadRole = parseJwt(res.data.token).role;
        localStorage.setItem("userId", res.data.userId);
        localStorage.setItem("roleId", payLoadRole);
        console.log("This is the role ", payLoadRole);
        
          // Navigate based on user role
        if (payLoadRole == 1) {
          navigate("/dashboard");
          localStorage.setItem("role", "Pharmacy Manager");
        } else if (payLoadRole == 2) {
          navigate("/C-dashboard");
          localStorage.setItem("role", "Cashier");
        } else if (payLoadRole == 3) {
          navigate("/PC-dashboard");
          localStorage.setItem("role", "Purchasing Clerk");
        } else if (payLoadRole == 4) {
          navigate("/IC-dashboard");
          localStorage.setItem("role", "Inventory Clerk");
        } else if (payLoadRole == 5) {
          navigate("/S-dashboard");
          localStorage.setItem("role", "Staff");
        }
        localStorage.setItem("username", res.data.username);
        // navigate("/dashboard");
      } else {
        setLoginError("Invalid username or password. Please try again.");
      }
    } catch (error) {
      console.error("Login frontend error", error);
      setLoginError("An error occurred. Please try again later.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "60%",
          height: "100%",
          backgroundColor: "#283342",
        }}
      >
        {/*  logs the data, checks for a password, makes an API request to validate the login, and handles the response: */}
        <form noValidate onSubmit={handleSubmit(submitForm)}>
          <Paper
            elevation={10}
            sx={{
              height: "550px",
              width: "450px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-evenly",
              p: 8,
              borderRadius: 5,
              gap: 3,
            }}
          >
            <Box sx={{ width: "100%", height: "20%" }}>
              <h1>Login</h1>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "20%",
              }}
            >
              <FormLabel>Username</FormLabel>
              <TextField
                fullWidth
                id="outlined-basic"
                label=""
                inputProps={{ ...register("username") }}
                error={!!errors.username}
                helperText={errors.username?.message}
                variant="outlined"
                sx={{ mb: 0 }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "20%",
              }}
            >
              <FormLabel>Password</FormLabel>
              <TextField
                fullWidth
                id="outlined-basic"
                label=""
                type="password"
                inputProps={{ ...register("password") }}
                error={!!errors.password || !!loginError}
                helperText={
                  !!loginError ? (
                    <Typography color={"error"} variant="caption">
                      {loginError}
                    </Typography>
                  ) : (
                    errors.password?.message
                  )
                }
                variant="outlined"
                onChange={() => {
                  setLoginError("");
                }}
              />
            </Box>
            <Box sx={{ width: "100%", height: "20%", pt: 7 }}>
              <Button
                fullWidth
                variant="outlined"
                sx={{ height: "50px" }}
                type="submit"
              >
                Login
              </Button>
            </Box>
          </Paper>
        </form>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "40%",
          height: "100%",
          backgroundColor: "#283342",
        }}
      >
        <img src={logo} style={{ width: "500px" }} alt="logo" />
        <img src={logotext} style={{ width: "500px" }} alt="logotext" />
      </Box>
    </Box>
  );
}

export default LoginPage;
