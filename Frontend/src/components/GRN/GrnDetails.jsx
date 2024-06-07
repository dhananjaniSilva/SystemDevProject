import { Box, Paper, Stack, Typography } from "@mui/material";
import React from "react";

function GrnDetails() {
  return (
    <div>
      <Paper>
        <Typography variant="h6">Medicine Details</Typography>
        <Stack>
          <Typography variant="body">Medicine brand name : </Typography>
          <Typography variant="body">Medicine generic name : </Typography>
          <Typography variant="body">Medicine selling price : </Typography>
          <Typography variant="body">Medicine pack size: </Typography>
        </Stack>
        <Typography variant="h6">Supplier Details</Typography>
        <Stack>
          <Typography variant="body">Supplier name : </Typography>
          <Typography variant="body">Supplier agent name : </Typography>
          <Typography variant="body">Supplier phone number : </Typography>
        </Stack>
      </Paper>
    </div>
  );
}

export default GrnDetails;
