import * as React from "react";
import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { TableVirtuoso } from "react-virtuoso";
import axios from "axios";
import MedicineCategoryForm, {
  MedicineCategoryUpdateForm,
} from "./MedicineCategoryForm";
import OverlayDialogBox from "../OverlayDialogBox";
import { PopupContext } from "../../contexts/MainContexts";
import { useContext } from "react";
import EditNoteIcon from '@mui/icons-material/EditNote';

// Define table columns
const columns = [
  {
    width: 100,
    label: "ID",
    dataKey: "mdct_id",
  },
  {
    width: 200,
    label: "Name",
    dataKey: "mdct_name",
  },
  {
    width: 200,
    label: "Code",
    dataKey: "mdct_code",
  },
  {
    width: 100,
    label: "Actions",
    dataKey: "actions",
  },
];

// Define Virtuoso table components
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
  TableHead,
  TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
  TableBody: React.forwardRef((props, ref) => (
    <TableBody {...props} ref={ref} />
  )),
};

// Define fixed header content for the table
function fixedHeaderContent() {
  return (
    <TableRow>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          variant="head"
          align={column.numeric || false ? "right" : "left"}
          style={{ width: column.width }}
          sx={{
            backgroundColor: "background.paper",
          }}
        >
          {column.label}
        </TableCell>
      ))}
    </TableRow>
  );
}

// Define row content for the table
function rowContent(_index, row, handleUpdate) {
  return (
    <React.Fragment>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          align={column.numeric || false ? "right" : "left"}
        >
          {column.dataKey === "actions" ? (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleUpdate(row.mdct_id)}
            >
              <EditNoteIcon />
            </Button>
          ) : (
            row[column.dataKey]
          )}
        </TableCell>
      ))}
    </React.Fragment>
  );
}

export default function ReactVirtualizedTable() {
  // State to hold the table rows data
  const [rows, setRows] = useState([]);
  // Context to manage popup state and selected medicine category ID
  const { boolValue, setBoolValue, medicineCategoryId, setMedicineCategoryId } = useContext(PopupContext);

  // Fetch data from the server on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/fetchListOfMedicineCategory");
        setRows(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Handle update button click to open the update form
  const handleUpdate = (medicineCategoryId) => {
    setMedicineCategoryId(medicineCategoryId);
    setBoolValue(true);
  };

  return (
    <Paper style={{ height: "100%", width: "100%" }}>
      <TableVirtuoso
        data={rows}
        components={VirtuosoTableComponents}
        fixedHeaderContent={fixedHeaderContent}
        itemContent={(index, row) => rowContent(index, row, handleUpdate)}
      />
      {/* Display overlay dialog box if boolValue is true */}
      {boolValue && (
        <OverlayDialogBox>
          {/* Show update form if medicineCategoryId is not 0, otherwise show the create form */}
          {medicineCategoryId !== 0 ? <MedicineCategoryUpdateForm medicineCategoryId={medicineCategoryId} /> : <MedicineCategoryForm />}
        </OverlayDialogBox>
      )}
    </Paper>
  );
}
