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
import { Button, TextField } from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import Swal from "sweetalert2";
import EditNoteIcon from "@mui/icons-material/EditNote";

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
        backgroundColor: "#A052E0", // Set the background color to white
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
    <>
      <TableRow sx={{ backgroundColor: "white" }}>
        <TableCell colSpan={9}>
          {" "}
          <Form.Select
            value={selectedUnitName}
            onChange={handleUnitNameChange}
            sx={{ width: "100px" }}
          >
            <option value="">All Unit Names</option>
            <option value="Tablet">Tablet</option>
            <option value="Capsule">Capsule</option>
            <option value="Bottle">Bottle</option>
            <option value="Repository">Repository</option>
            <option value="Cartridge">Cartridge</option>
            <option value="Tube">Tube</option>
            <option value="Unit">Unit</option>
          </Form.Select>
        </TableCell>
      </TableRow>
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
      </TableRow>
    </>
  );
}

function rowContent(
  _index,
  row,
  editableRowId,
  setEditableRowId,
  handleUnitPriceChange,
  handleDelete,
  handleEditToggle
) {
  const isBottle = 
    row.unit_name == "Bottle" && row.medicine_inhandquantity <= 5;
  const isTablet =
    row.unit_name == "Tablet" && row.medicine_inhandquantity <= 200;
  const isCapsule =
    row.unit_name == "Capsule" && row.medicine_inhandquantity <= 200;
  const isRepository =
    row.unit_name == "Repository" && row.medicine_inhandquantity <= 5;
  const isTube =
    row.unit_name == "Tube" && row.medicine_inhandquantity <= 5;
  const isUnit =
    row.unit_name == "Unit" && row.medicine_inhandquantity <= 5;
  const isCartridge =
    row.unit_name == "Cartridge" && row.medicine_inhandquantity <= 5;
  
  let rowStyle = {};

  if (
    isBottle ||
    isTablet ||
    isCapsule ||
    isRepository ||
    isTube ||
    isUnit ||
    isCartridge 
  ) {
    rowStyle.backgroundColor = "#F2FEA4"; // Adjust color for low bottle quantity
  }

  return (
    <React.Fragment>
      {columns.map((column) => {
        if (column.dataKey === "new_column") {
          return (
            <TableCell
              key={column.dataKey}
              align={column.numeric ? "center" : "center"}
              sx={{
                backgroundColor: rowStyle.backgroundColor,
              }}
            >
              <Button
                color="error"
                variant="outlined"
                onClick={() => handleDelete(row.medicine_id)}
              >
                <DeleteOutlinedIcon />
              </Button>
              <Button
                color="info"
                variant="outlined"
                onClick={() =>
                  handleEditToggle(row.medicine_id, row.medicine_unitprice)
                }
              >
                <EditNoteIcon />
              </Button>
            </TableCell>
          );
        } else if (column.dataKey === "medicine_unitprice") {
          return (
            <TableCell
              key={column.dataKey}
              align={column.numeric ? "center" : "center"}
              sx={{ backgroundColor: rowStyle.backgroundColor }}
            >
              <TextField
                disabled={editableRowId !== row.medicine_id}
                type="number"
                value={row.medicine_unitprice}
                onChange={(e) =>
                  handleUnitPriceChange(row.medicine_id, e.target.value)
                }
                inputProps={{ style: { textAlign: "center" } }}
              />
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
  const [unitPrices, setUnitPrices] = useState({});
  const [editableRowId, setEditableRowId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("This is the token",token)
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
      axios
        .get("http://localhost:8080/fetchListOfMedicine", {
          headers: {
            "x-access-token": token,
          },
        })
        .then((res) => {
          const modifiedData = res.data.map((item) => ({
            ...item,
            medicine_info: `${item.mdct_code}${String(
              item.medicine_id
            ).padStart(5, "0")} `,
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

  const handleUnitPriceChange = (medicineId, newPrice) => {
    setUnitPrices((prevPrices) => ({
      ...prevPrices,
      [medicineId]: newPrice,
    }));
  };

  useEffect(() => {
    setFilteredMedicines((prevMedicines) =>
      prevMedicines.map((medicine) => ({
        ...medicine,
        medicine_unitprice:
          unitPrices[medicine.medicine_id] || medicine.medicine_unitprice,
      }))
    );
  }, [unitPrices]);

  const handleDelete = async (medicineId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `http://localhost:8080/deleteMedicineById/${medicineId}`
          );
          console.log("Medicine deleted successfully.");
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          });
          // Remove the deleted medicine from the state
          setFilteredMedicines((prevMedicines) =>
            prevMedicines.filter(
              (medicine) => medicine.medicine_id !== medicineId
            )
          );
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
            footer: '<a href="#">Why do I have this issue?</a>',
          });
          console.error("Error deleting medicine:", error);
        }
      }
    });
  };

  const handleEditToggle = (medicineId, currentUnitPrice) => {
    if (editableRowId === medicineId) {
      // Save the updated unit price
      axios
        .post(`http://localhost:8080/updateMedicinePrice`, {
          medicine_id: medicineId,
          medicine_unitprice: unitPrices[medicineId] || currentUnitPrice,
        })
        .then((response) => {
          console.log("Unit price updated successfully:", response.data);
          Swal.fire({
            title: "Updated!",
            text: "Unit price has been updated.",
            icon: "success",
          });
        })
        .catch((error) => {
          console.error("Error updating unit price:", error);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
            footer: '<a href="#">Why do I have this issue?</a>',
          });
        });
      setEditableRowId(null); // Disable edit mode
    } else {
      setEditableRowId(medicineId); // Enable edit mode
    }
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
        itemContent={(index, row) =>
          rowContent(
            index,
            row,
            editableRowId,
            setEditableRowId,
            handleUnitPriceChange,
            handleDelete,
            handleEditToggle
          )
        }
      />
    </Paper>
  );
}
