import React, { useState } from 'react'
import {Box,FormLabel,Paper,TextField,Button} from '@mui/material'
import logo from '../assets/logo.png'
import logotext from '../assets/logotext.png'
import axios from 'axios'
import { Link, useNavigate } from "react-router-dom";


function LoginPage() {
    const [userName,setUserName]=useState('');
    const [password,setPassword]=useState('');
    const navigate=useNavigate();

    const handleSubmit = async (userName, password) => {
        const requestUserObjects = {
          username: userName,
          password: password
        };
        console.log("object", requestUserObjects);
        try {
          await axios
            .get(`http://localhost:8080/loginValidate`, {
              params: requestUserObjects,
            })
            .then((res) => {
              console.log("This is the response", res.data);
                if(res.data.response===true){
                    console.log("Dashboard")
                   navigate("/dashboard")
                }else{
                    console.log("Authorized")
                    navigate("/unauthorized")
                }
            
            });
        } catch (error) {
          console.error("Login frontend error", error);
        }
      };




  return (
    <Box sx={{display:"flex",alignItems:"center",width:"100vw",height:"100vh"}}>
           <Box sx={{display:"flex",alignItems:"center",justifyContent:"center",width:"60%",height:"100%",backgroundColor:"#283342"}}>

                  
                  <Paper elevation={10} sx={{height:"500px",width:"450px",display:"flex",flexDirection:"column",justifyContent:"space-evenly",p:8,borderRadius:5}}>
                    <Box sx={{width:"100%",height:"20%"}}>
                        <h1>Login</h1>
                    </Box>
                    <Box sx={{display:"flex",flexDirection:"column",width:"100%",height:"20%",gap:2}}>
                        <FormLabel>Username</FormLabel>
                        <TextField fullWidth id="outlined-basic" label="" variant="outlined" onChange={(e)=>setUserName(e.target.value)}/>
                    </Box>
                    <Box sx={{display:"flex",flexDirection:"column",width:"100%",height:"20%",gap:2}}>
                        <FormLabel>Password</FormLabel>
                        <TextField fullWidth id="outlined-basic" label="" variant="outlined" onChange={(e)=>setPassword(e.target.value)}/>
                        <FormLabel>Forgot password ?</FormLabel>
                    </Box>
                    <Box sx={{width:"100%",height:"20%",pt:10}}>
                        <Button fullWidth variant='outlined' sx={{height:"50px"}} onClick={()=>handleSubmit(userName,password)}>Login</Button>
                    </Box>
                  </Paper>
           </Box>
           <Box sx={{display:"flex",flexDirection:"column",justifyContent:"center",width:"40%",height:"100%",backgroundColor:"#283342"}}>
            <img src={logo} style={{width:'500px'}}/>
            <img src={logotext} style={{width:'500px'}}/>
           </Box>
    </Box>
  )
}

export default LoginPage
