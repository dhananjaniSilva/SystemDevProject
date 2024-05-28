import React from "react";
import "../stylings/pages/dashboard.css";
import { Button, Stack, TextField } from "@mui/material";
export default function InvoiceBill() {
  return (
    <>
      <form no noValidate>
        <Stack>
          <Box>
            <TextField placeholder="medicine Id"/>
            <Button>Search</Button>
          </Box>
          <TextField placeholder="medicine brand nane"/>
          <TextField placeholder="Unit price"/>
          <TextField placeholder="quantity"/>
        </Stack>
      </form>
    </>
  );
}
