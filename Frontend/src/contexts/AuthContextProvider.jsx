import React, { useEffect } from 'react'
import { AuthContext } from './MainContexts'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

function AuthContextProvider({children}) {
    const navigate=useNavigate()
    useEffect(() => {
        try {
          axios
            .get("http://localhost:8080/isUserAuth", {
              headers: {
                "x-access-token": localStorage.getItem("token"),
              },
            })
            .then((response) => {
              if (!response.data.auth) navigate("/");
            });
        } catch (error) {
          console.log("Error", error);
        }
      }, []);
  return (
    <AuthContext.Provider>
        {children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider
