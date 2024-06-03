import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { TableVirtuoso } from "react-virtuoso";
import Swal from "sweetalert2";
import { Box, Typography } from "@mui/material";

const columns = [
  { width: 150, label: "Medicine Id", dataKey: "medicine_id" },
  { width: 200, label: "Brand Name", dataKey: "medicine_brandname" },
  { width: 200, label: "Generic Name", dataKey: "medicine_genericname" },
  { width: 150, label: "Unit Price", dataKey: "medicine_unitprice" },
  { width: 150, label: "Pack Size", dataKey: "medicine_packsize" },
  { width: 150, label: "In-hand Quantity", dataKey: "medicine_inhandquantity" },
  { width: 150, label: "Actions", dataKey: "actions" }, // New column for actions
];

const VirtuosoTableComponents = {
  Scroller: React.forwardRef((props, ref) => (
    <TableContainer component={Paper} {...props} ref={ref} />
  )),
  Table: (props) => (
    <Table
      {...props}
      sx={{ borderCollapse: "separate", tableLayout: "fixed" }}
    />
  ),
  TableHead: (props) => (
    <TableHead
      {...props}
      sx={{
        backgroundColor: "#f5f5f5", // Light grey background for header
      }}
    />
  ),
  TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
  TableBody: React.forwardRef((props, ref) => (
    <TableBody {...props} ref={ref} />
  )),
};

function fixedHeaderContent({ sortColumn, sortDirection, onSort }) {
  return (
    <TableRow>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          align="center"
          onClick={column.sortable ? () => onSort(column.dataKey) : null}
          style={{
            cursor: column.sortable ? "pointer" : "default",
            width: column.width,
            padding: "10px",
            fontWeight: "bold",
            borderBottom: "2px solid #ddd", // Add bottom border
          }}
        >
          {column.label}
          {column.sortable && sortColumn === column.dataKey && (
            <span>{sortDirection === "asc" ? " 🔼" : " 🔽"}</span>
          )}
        </TableCell>
      ))}
    </TableRow>
  );
}

function rowContent(_index, row, handlePass) {
  return (
    <TableRow>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          align="center"
          style={{
            width: column.width,
            padding: "10px",
            borderBottom: "1px solid #eee", // Add bottom border
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {column.dataKey === "actions" ? (
            <Button
              variant="contained"
              color="primary"
              onClick={() => handlePass(row)}
            >
              Pass
            </Button>
          ) : (
            row[column.dataKey]
          )}
        </TableCell>
      ))}
    </TableRow>
  );
}

function SupplierDetails({ supplier }) {
  return (
    <Box sx={{ marginTop: 2, padding: 2, border: "1px solid #ddd" }}>
      <Typography variant="h6">Supplier Details</Typography>
      <Typography variant="body1">
        <strong>Company Name:</strong> {supplier.sp_companyname}
      </Typography>
      <Typography variant="body1">
        <strong>First Name:</strong> {supplier.sp_fname}
      </Typography>
      <Typography variant="body1">
        <strong>Last Name:</strong> {supplier.sp_lname}
      </Typography>
      <Typography variant="body1">
        <strong>Phone Number:</strong> {supplier.sp_pno}
      </Typography>
    </Box>
  );
}

export default function RequestOrderTable({ medicineArray }) {
  const [filteredMedicines, setFilteredMedicines] = useState(medicineArray);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [supplier, setSupplier] = useState(null);
  const [passedMedicines, setPassedMedicines] = useState([]);

  useEffect(() => {
    setFilteredMedicines(medicineArray);
  }, [medicineArray]);

  const handleSort = (column) => {
    const newSortDirection =
      sortColumn === column && sortDirection === "asc" ? "desc" : "asc";
    const sortedData = [...filteredMedicines].sort((a, b) => {
      if (a[column] < b[column]) return newSortDirection === "asc" ? -1 : 1;
      if (a[column] > b[column]) return newSortDirection === "asc" ? 1 : -1;
      return 0;
    });
    setSortColumn(column);
    setSortDirection(newSortDirection);
    setFilteredMedicines(sortedData);
  };

  const handlePass = async (row) => {
    const { value: quantity } = await Swal.fire({
      title: "Enter the quantity you wish to purchase",
      input: "number",
      inputAttributes: {
        autocapitalize: "off",
        min: 1,
      },
      showCancelButton: true,
      confirmButtonText: "Submit",
    });

    if (quantity) {
      row.medicineOrderQuantity = quantity;
      console.log(row);
      setPassedMedicines([...passedMedicines, row]); // Add the passed medicine to the array
      // Optionally, update the state to reflect changes in the UI
      setFilteredMedicines([...filteredMedicines]);
    }
  };

  const handleSearch = async (searchValue) => {
    if (searchValue === "") {
      setFilteredMedicines(medicineArray);
      setSupplier(null);
      return;
    }

    const filteredData = medicineArray.filter((medicine) =>
      medicine.sp_companyname.toLowerCase().includes(searchValue.toLowerCase())
    );

    if (filteredData.length > 0) {
      setFilteredMedicines(filteredData);
      setSupplier({
        sp_companyname: filteredData[0].sp_companyname,
        sp_fname: filteredData[0].sp_fname,
        sp_lname: filteredData[0].sp_lname,
        sp_pno: filteredData[0].sp_pno
      });
    } else {
      setFilteredMedicines([]);
      setSupplier(null);
    }
  };

  return (
    <Paper style={{ height: "100%", width: "100%", padding: "20px" }}>
      <input
        type="text"
        placeholder="Search here..."
        onChange={(e) => handleSearch(e.target.value)}
        style={{ marginBottom: "20px", padding: "10px", width: "100%" }}
      />
      <TableVirtuoso
        data={filteredMedicines}
        components={VirtuosoTableComponents}
        fixedHeaderContent={() =>
          fixedHeaderContent({
            sortColumn,
            sortDirection,
            onSort: handleSort,
          })
        }
        itemContent={(index, row) => rowContent(index, row, handlePass)}
      />
      {supplier && <SupplierDetails supplier={supplier} />}
      {passedMedicines.length > 0 && (
        <div>
          <Typography variant="h6">Passed Medicines</Typography>
          {passedMedicines.map((medicine, index) => (
            <div key={index}>
              <Typography variant="body1">
                <strong>Medicine Id:</strong> {medicine.medicine_id}
              </Typography>
              <Typography variant="body1">
                <strong>Brand Name:</strong> {medicine.medicine_brandname}
              </Typography>
              <Typography variant="body1">
                <strong>Generic Name:</strong> {medicine.medicine_genericname}
              </Typography>
              <Typography variant="body1">
                <strong>Unit Price:</strong> {medicine.medicine_unitprice}
              </Typography>
              <Typography variant="body1">
                <strong>Pack Size:</strong> {medicine.medicine_packsize}
              </Typography>
              <Typography variant="body1">
                <strong>In-hand Quantity:</strong>{" "}
                {medicine.medicine_inhandquantity}
              </Typography>
              <Typography variant="body1">
                <strong>Order Quantity:</strong>{" "}
                {medicine.medicineOrderQuantity}
              </Typography>
              {/* Add any additional fields as needed */}
            </div>
          ))}
        </div>
      )}
    </Paper>
  );
}
