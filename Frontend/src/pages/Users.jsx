import React, { useState, useEffect } from "react";
import UsersForm from "../components/Users/UsersForm";
import UsersTable from "../components/Users/UsersTable";
import axios from "axios";

function Users() {
  // State for storing users fetched from the API
  const [users, setUsers] = useState([]);
  // State for storing the currently selected user for editing
  const [selectedUser, setSelectedUser] = useState(null);

  // Effect to fetch users from the API on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Fetch users from the backend
        const response = await axios.get("http://localhost:8080/getUsers");
        setUsers(response.data); // Set users state with fetched data
        console.log("Fetched users:", response.data); // Debugging line
      } catch (error) {
        // Log any error encountered during fetching
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers(); // Call fetchUsers function
  }, []); // Empty dependency array means this effect runs only once

  // Handler for selecting a user to edit
  const handleEditUser = (user) => {
    setSelectedUser(user); // Set selected user state
  };

  // Handler for deleting users; updates the users list
  const handleDeleteUser = async (deletedUsers) => {
    setUsers(deletedUsers); // Update users state with remaining users
  };

  return (
    <div className="body">
      <div className="outer-div">
        <div className="top">
          <div className="left">
            {/* Optional breadcrumb navigation or other components */}
            <div style={{ paddingRight: "20px" }}>
              <h3>User Management</h3> {/* Header for the user management section */}
            </div>
          </div>
          <div className="right"></div>
        </div>
        <div
          className="table"
          style={{ display: "flex", justifyContent: "space-evenly" }}
        >
          {/* User Form Section */}
          <div style={{ width: "30%", height: "100%" }}>
            <UsersForm selectedUser={selectedUser} setUsers={setUsers} />
          </div>
          {/* Users Table Section */}
          <div style={{ width: "60%", height: "100%" }}>
            <UsersTable
              users={users}
              onEditUser={handleEditUser}
              onDeleteUser={handleDeleteUser}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Users;
