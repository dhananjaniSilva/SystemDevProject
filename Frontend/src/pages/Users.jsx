import React, { useState, useEffect } from "react";
import UsersForm from "../components/Users/UsersForm";
import UsersTable from "../components/Users/UsersTable";
import axios from "axios";

function Users() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8080/getUsers");
        setUsers(response.data);
        console.log("Fetched users:", response.data); // Debugging line
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleEditUser = (user) => {
    setSelectedUser(user);
  };

  const handleDeleteUser = async (deletedUsers) => {
    setUsers(deletedUsers);
  };

  return (
    <div className="body">
      <div className="outer-div">
        <div className="top">
          <div className="left">
             {/* <IconBreadcrumbs /> */}
             <div style={{ paddingRight: "20px"}}>
              <h3>User Management</h3>
            </div>
          </div>
          <div className="right"></div>
        </div>
        <div
          className="table"
          style={{ display: "flex", justifyContent: "space-evenly" }}
        >
          <div style={{ width: "30%", height: "100%" }}>
            <UsersForm selectedUser={selectedUser} setUsers={setUsers} />
          </div>
          <div style={{ width: "60%", height: "100%" }}>
            <UsersTable users={users} onEditUser={handleEditUser} onDeleteUser={handleDeleteUser} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Users;
