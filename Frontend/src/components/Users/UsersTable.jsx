import React from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import Swal from "sweetalert2"; // Import SweetAlert2 here
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
function UsersTable({ users, onEditUser, onDeleteUser }) {
  console.log("UsersTable received users:", users); // Debugging line

  const handleDelete = async (user_id) => {
    // Show confirmation dialog before deletion
    const confirmDelete = await Swal.fire({
      // Use Swal.fire() instead of Swal()
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this user!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmDelete.isConfirmed) {
      try {
        const response = await axios.delete(
          `http://localhost:8080/deleteUser/${user_id}`
        );

        if (response.status === 200) {
          onDeleteUser(response.data); // Update state with updated user list
          console.log("User deleted successfully");
          Swal.fire("Deleted!", "The user has been deleted.", "success");
        } else {
          console.error("Failed to delete user");
          Swal.fire("Failed!", "The user could not be deleted.", "error");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        Swal.fire("Error!", "Failed to delete the user.", "error");
      }
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>First Name</TableCell>
            <TableCell>Last Name</TableCell>
            <TableCell>NIC</TableCell>
            <TableCell>Phone Number</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user, index) => (
            <TableRow key={index}>
              <TableCell>{user.user_fname}</TableCell>
              <TableCell>{user.user_lname}</TableCell>
              <TableCell>{user.user_nic}</TableCell>
              <TableCell>{user.user_pno}</TableCell>
              <TableCell>{user.role_name}</TableCell>
              <TableCell>{user.user_username}</TableCell>
              <TableCell width={"200px"}>
                <Button color="info" onClick={() => onEditUser(user)}>
                  <EditNoteIcon />
                </Button>
                <Button
                  color="error"
                  onClick={() => handleDelete(user.user_id)}
                >
                  <DeleteOutlineOutlinedIcon />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default UsersTable;
