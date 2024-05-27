import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { TableVirtuoso } from "react-virtuoso";
import axios from "axios";
import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import { Button } from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import Swal from "sweetalert2";
const columns = [
  { width: 300, label: "Medicine Id", dataKey: "medicine_info" },
  { width: 200, label: "Brand Name", dataKey: "medicine_brandname" },
  { width: 200, label: "Generic Name", dataKey: "medicine_genericname" },
  { width: 150, label: "Category Code", dataKey: "mdct_code", numeric: true },
  { width: 150, label: "Unit Name", dataKey: "unit_name", numeric: true },
  {
    width: 150,
    label: "Unit Price",
    dataKey: "medicine_unitprice",
    numeric: true,
  },
  {
    width: 150,
    label: "Pack Size",
    dataKey: "medicine_packsize",
    numeric: true,
    sortable: true,
  },
  {
    width: 150,
    label: "In-hand Quantity",
    dataKey: "medicine_inhandquantity",
    numeric: true,
  },
  { width: 150, label: "Delete", dataKey: "new_column", numeric: true },
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
  selectedUnitName,
  handleUnitNameChange,
}) {
  return (
    <TableRow>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          align={column.numeric ? "center" : "center"}
          onClick={column.sortable ? () => onSort(column.dataKey) : null}
          style={{ cursor: column.sortable ? "pointer" : "default" }}
        >
          {column.label}
          {column.sortable && sortColumn === column.dataKey && (
            <span>{sortDirection === "asc" ? " 🔼" : " 🔽"}</span>
          )}
        </TableCell>
      ))}
      <TableCell align="center">
        <Form.Select value={selectedUnitName} onChange={handleUnitNameChange}>
          <option value="">All Unit Names</option>
          <option value="Tablet">Tablet</option>
          <option value="Capsule">Capsule</option>
          <option value="Bottle">Bottle</option>
          <option value="Repository">Repository</option>
          <option value="Cartridge">Cartridge</option>
          <option value="Unit">Unit</option>
        </Form.Select>
      </TableCell>
    </TableRow>
  );
}

function rowContent(_index, row) {
  const isHighQuantity = row.medicine_inhandquantity < 50;

  const handleDelete = async (medicineId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          axios.delete(
            `http://localhost:8080/deleteMedicineById/${medicineId}`
          );
          console.log("Medicine deleted successfully.");
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          });
          window.location.reload()
          // Optionally, you can update your UI or perform other actions upon successful deletion.
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
            footer: '<a href="#">Why do I have this issue?</a>',
          });
          console.error("Error deleting medicine:", error);

          // Optionally, you can handle the error or display a message to the user.
        }
      }
    });
  };

  const rowStyle = {
    backgroundColor: isHighQuantity ? "#e3707b" : "inherit",
  };

  return (
    <React.Fragment>
      {columns.map((column) => {
        if (column.dataKey === "new_column") {
          return (
            <TableCell
              key={column.dataKey}
              align={column.numeric ? "center" : "center"}
              sx={{ backgroundColor: rowStyle.backgroundColor }}
            >
              <Button
                color="error"
                onClick={() => handleDelete(row.medicine_id)}
              >
                <DeleteOutlinedIcon />
              </Button>
            </TableCell>
          );
        } else {
          return (
            <TableCell
              key={column.dataKey}
              align={column.numeric ? "center" : "center"}
              sx={{ backgroundColor: rowStyle.backgroundColor }}
            >
              {row[column.dataKey]}
            </TableCell>
          );
        }
      })}
    </React.Fragment>
  );
}

export default function ReactVirtualizedTable(props) {
  const { mdct_code, searchValue, medicineArray } = props;
  const [allMedicines, setAllMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedUnitName, setSelectedUnitName] = useState("");

  useEffect(() => {
    if (medicineArray.length > 0) {
      const modifiedData = medicineArray.map((item) => ({
        ...item,
        medicine_info: `${item.mdct_code}${String(item.medicine_id).padStart(
          5,
          "0"
        )} `,
      }));
      setAllMedicines(modifiedData);
    } else {
      axios.get("http://localhost:8080/fetchListOfMedicine").then((res) => {
        const modifiedData = res.data.map((item) => ({
          ...item,
          medicine_info: `${item.mdct_code}${String(item.medicine_id).padStart(
            5,
            "0"
          )} `,
        }));
        setAllMedicines(modifiedData);
      });
    }
  }, [medicineArray]);

  useEffect(() => {
    let filteredData = allMedicines;

    if (mdct_code) {
      filteredData = filteredData.filter((item) => item.mdct_code == mdct_code);
    }

    // if (searchValue) {
    //   filteredData = filteredData.filter(item =>
    //     item.medicine_brandname.toLowerCase().includes(searchValue.toLowerCase()) ||
    //     item.medicine_genericname.toLowerCase().includes(searchValue.toLowerCase()) ||
    //     String(item.medicine_id).toLowerCase().includes(searchValue.toLowerCase())
    //   );
    // }

    if (selectedUnitName) {
      filteredData = filteredData.filter(
        (item) => item.unit_name === selectedUnitName
      );
    }

    setFilteredMedicines(filteredData);
  }, [allMedicines, mdct_code, searchValue, selectedUnitName]);

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

  const handleUnitNameChange = (event) => {
    setSelectedUnitName(event.target.value);
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
            selectedUnitName,
            handleUnitNameChange,
          })
        }
        itemContent={rowContent}
      />
    </Paper>
  );
}
