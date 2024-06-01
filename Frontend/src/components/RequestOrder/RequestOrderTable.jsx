// RequestOrderTable.jsx
import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { TableVirtuoso } from "react-virtuoso";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Swal from "sweetalert2";

const columns = [
  { width: 300, label: "Medicine Id", dataKey: "medicine_id" },
  { width: 200, label: "Brand Name", dataKey: "medicine_brandname" },
  { width: 200, label: "Generic Name", dataKey: "medicine_genericname" },
  { width: 150, label: "Unit Price", dataKey: "medicine_unitprice" },
  { width: 150, label: "Pack Size", dataKey: "medicine_packsize" },
  { width: 150, label: "In-hand Quantity", dataKey: "medicine_inhandquantity" },
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
        backgroundColor: "white", // Set the background color to white
      }}
    />
  ),
  TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
  TableBody: React.forwardRef((props, ref) => (
    <TableBody {...props} ref={ref} />
  )),
};

function fixedHeaderContent({
  sortColumn,
  sortDirection,
  onSort,
}) {
  return (
    <TableRow>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          align="center"
          onClick={column.sortable ? () => onSort(column.dataKey) : null}
          style={{ cursor: column.sortable ? "pointer" : "default" }}
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

function rowContent(
  _index,
  row,
  onClickRow
) {
  return (
    <TableRow onClick={() => onClickRow(row)}>
      {columns.map((column) => (
        <TableCell key={column.dataKey} align="center">
          {row[column.dataKey]}
        </TableCell>
      ))}
    </TableRow>
  );
}

export default function RequestOrderTable({ data, searchValue, onRowClick }) {
  const [filteredMedicines, setFilteredMedicines] = useState(data);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    // Filter the table based on the search value
    const filteredData = data.filter(
      (item) =>
        item.sp_companyname.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredMedicines(filteredData);
  }, [searchValue]);

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

  return (
    <Paper style={{ height: "100%", width: "100%" }}>
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
        itemContent={(index, row) =>
          rowContent(index, row, onRowClick)
        }
      />
    </Paper>
  );
}
