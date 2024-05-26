import { Box, Button } from "@mui/material";
import React from "react";
import Form from "react-bootstrap/Form";

function MedicineCategoryForm() {
  return (
    <Box sx={{ m: 2 }}>
      <form>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Medicine Category Name</Form.Label>
          <Form.Control type="email" placeholder="name@example.com" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Category Code</Form.Label>
          <Form.Control type="text" placeholder="name@example.com" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Button>Submit</Button>
        </Form.Group>
      </form>
    </Box>
  );
}

export default MedicineCategoryForm;
