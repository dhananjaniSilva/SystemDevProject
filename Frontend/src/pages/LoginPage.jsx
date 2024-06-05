import React, { useState } from "react";
import { Box, FormLabel, Paper, TextField, Button, Typography } from "@mui/material";
import logo from "../assets/logo.png";
import logotext from "../assets/logotext.png";
import axios from "axios";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const schema = yup.object().shape({
    username: yup.string().required().min(3).max(12),
    password: yup.string().min(3).max(20).required(),
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const [loginError, setLoginError] = useState("");

  const navigate = useNavigate();

  const submitForm = async (data) => {
    console.log("This is the submitted data ", data);
    const { username, password } = data;
    const requestUserObjects = { username, password };

    try {
      const res = await axios.get(`http://localhost:8080/loginValidate`, {
        params: requestUserObjects,
      });
      console.log("This is the response", res.data);
      if (res.data.auth === true) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", res.data.username);
        navigate("/dashboard");
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
                inputProps={{ ...register("password") }}
                error={!!errors.password}
                helperText={(!!loginError) ? <Typography color={"error"} variant="caption">{loginError}</Typography>:errors.password?.message }
                variant="outlined"
                onChange={()=>{setLoginError('')}}
              />
              <FormLabel>Forgot password?</FormLabel>
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
        <img src={logo} style={{ width: "500px" }} />
        <img src={logotext} style={{ width: "500px" }} />
      </Box>
    </Box>
  );
}

export default LoginPage;
