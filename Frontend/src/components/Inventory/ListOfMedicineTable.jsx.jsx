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

const columns = [
  {
    width: 300, // Adjust the width as needed
    label: "Medicine Id",
    dataKey: "medicine_info",
  },
  {
    width: 200,
    label: "Brand Name",
    dataKey: "medicine_brandname",
  },
  {
    width: 200,
    label: "Generic Name",
    dataKey: "medicine_genericname",
  },
  {
    width: 150,
    label: "Category Code",
    dataKey: "mdct_code",
    numeric: true,
  },
  {
    width: 150,
    label: "Unit Name",
    dataKey: "unit_name",
    numeric: true,
  },
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
  },
  {
    width: 150,
    label: "In-hand Quantity",
    dataKey: "medicine_inhandquantity",
    numeric: true,
  },
];

const VirtuosoTableComponents = {
  Scroller: React.forwardRef((props, ref) => (
    <TableContainer component={Paper} {...props} ref={ref} />
  )),
  Table: (props) => (
    <Table 
      {...props}
      sx={{ borderCollapse: "separate", tableLayout: "fixed"}}
    />
  ),
  TableHead,
  TableRow: ({ item: _item, ...props }) => <TableRow  {...props} />,
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
          align={column.numeric ? "center" : "center"}
        >
          {column.label}
        </TableCell>
      ))}
    </TableRow>
  );
}

function rowContent(_index, row) {
  const isHighQuantity = row.medicine_inhandquantity < 200; // Example condition

  const rowStyle = {
    backgroundColor: isHighQuantity ? 'orange' : 'inherit', // Change color based on condition
  };
  return (
    <React.Fragment>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          align={column.numeric ? "center" : "center"}
          sx={{ backgroundColor: rowStyle.backgroundColor }}
        >
          {row[column.dataKey]}
        </TableCell>
      ))}
    </React.Fragment>
  );
}

export default function ReactVirtualizedTable(props) {
  const { mdct_code } = props;
  const [allMedicines, setAllMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/fetchListOfMedicine").then((res) => {
      const modifiedData = res.data.map(item => ({
        ...item,
        medicine_info: `${item.mdct_code}${String(item.medicine_id).padStart(5, '0')} `
      }));
      setAllMedicines(modifiedData);
      setFilteredMedicines(modifiedData);
    });
  }, []);

  useEffect(() => {
    if (mdct_code) {
      setFilteredMedicines(allMedicines.filter(item => item.mdct_code === mdct_code));
    } else {
      setFilteredMedicines(allMedicines);
    }
  }, [mdct_code, allMedicines]);

  return (
    <Paper style={{ height: 400, width: "100%" }}>
      <TableVirtuoso
        data={filteredMedicines}
        components={VirtuosoTableComponents}
        fixedHeaderContent={fixedHeaderContent}
        itemContent={rowContent}
      />
    </Paper>
  );
}
