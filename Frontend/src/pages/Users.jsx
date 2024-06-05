import React from "react";
import { Button } from "@mui/material";
import UsersForm from "../components/Users/UsersForm";
import UsersTable from "../components/Users/UsersTable";

function Users() {
  return (
    <div className="body">
      <div className="outer-div">
        <div className="top">
          <div className="left"></div>
          <div className="right"></div>
        </div>
        <div
          className="table"
          style={{ display: "flex", justifyContent: "space-evenly" }}
        >
          <div style={{ width: "30%", height: "100%" }}>
            <UsersForm />
          </div>
          <div style={{ width: "60%", height: "100%" }}>
            <UsersTable />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Users;
