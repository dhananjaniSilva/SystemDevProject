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
import OverlayDialogBox from "../../../components/OverlayDialogBox";

import { useContext } from "react";
import EditNoteIcon from '@mui/icons-material/EditNote';
import MedicineCategoryForm, { MedicineCategoryUpdateForm } from "../../Inventory/MedicineCategoryForm";
import { PopupContext } from "../../../contexts/MainContexts";
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
              <EditNoteIcon/>
            </Button>
          ) : (
            row[column.dataKey]
          )}
        </TableCell>
      ))}
    </React.Fragment>
  );
}

export default function ICMedicineCategoryTable() {
  const [rows, setRows] = useState([]);
  const { boolValue, setBoolValue, medicineCategoryId, setMedicineCategoryId } = useContext(PopupContext);

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
      {boolValue && (
        <OverlayDialogBox>
          {medicineCategoryId !== 0 ? <MedicineCategoryUpdateForm medicineCategoryId={medicineCategoryId} /> : <MedicineCategoryForm />}
        </OverlayDialogBox>
      )}
    </Paper>
  );
}