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
    width: 200,
    label: "Medicine ID",
    dataKey: "medicine_id",
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
    label: "Category ID",
    dataKey: "medicine_categoryid",
    numeric: true,
  },
  {
    width: 150,
    label: "Unit ID",
    dataKey: "medicine_unitid",
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
          align={column.numeric ? "right" : "left"}
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
        <TableCell sx={{backgroundColor:rowStyle}}
          key={column.dataKey}
          align={column.numeric ? "right" : "left"}
        >
          {row[column.dataKey]}
        </TableCell>
      ))}
    </React.Fragment>
  );
}
export default function ReactVirtualizedTable(props) {
  const {listOfMedicineArray}=props
  useEffect(()=>{
    
  },[listOfMedicineArray])
  const [listOfMedicineArray2, setListOfMedicineArray2] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/fetchListOfMedicine").then((res) => {
      setListOfMedicineArray2(res.data);
      console.log(res.data);
    });
  }, []);

  return (
    <Paper style={{ height: 400, width: "100%" }}>
      <TableVirtuoso
        data={listOfMedicineArray2}
        components={VirtuosoTableComponents}
        fixedHeaderContent={fixedHeaderContent}
        itemContent={rowContent}
      />
    </Paper>
  );
}
