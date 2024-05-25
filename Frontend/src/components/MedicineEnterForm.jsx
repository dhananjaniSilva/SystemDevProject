import { Box, FormLabel, Stack } from "@mui/material";
import React from "react";
import Form from "react-bootstrap/Form";

function MedicineEnterForm() {
  return (
    <>
      <Box sx={{ m: 2 }}>
        <form>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Brand Name</Form.Label>
            <Form.Control type="email" placeholder="name@example.com" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Generic Name</Form.Label>
            <Form.Control type="text" placeholder="name@example.com" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Unit type</Form.Label>
            <Form.Select aria-label="Default select example">
              <option>Open this select menu</option>
              <option value="1">Tablet</option>
              <option value="2">Capsule</option>
              <option value="3">Bottle</option>
              <option value="4">Repostory</option>
              <option value="5">Catridge</option>
              
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Unit type</Form.Label>
            <Form.Select aria-label="Default select example">
              <option>Open this select menu</option>
              <option value="1">Tablet</option>
              <option value="2">Capsule</option>
              <option value="3">Bottle</option>
              <option value="4">Repostory</option>
              <option value="5">Catridge</option>
              
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Unit Price</Form.Label>
            <Form.Control type="number" placeholder="name@example.com" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Pack size</Form.Label>
            <Form.Control type="number" placeholder="name@example.com" />
          </Form.Group>
        </form>
      </Box>
    </>
  );
}

export default MedicineEnterForm;
