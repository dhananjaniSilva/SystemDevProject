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

const columns = [
  {
    width: 300,
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
    sortable: true,
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

function fixedHeaderContent({ sortColumn, sortDirection, onSort, selectedUnitName, handleUnitNameChange }) {
  return (
    <TableRow>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          align={column.numeric ? "center" : "center"}
          onClick={column.sortable ? () => onSort(column.dataKey) : null}
          style={{ cursor: column.sortable ? 'pointer' : 'default' }}
        >
          {column.label}
          {column.sortable && sortColumn === column.dataKey && (
            <span>{sortDirection === 'asc' ? ' 🔼' : ' 🔽'}</span>
          )}
        </TableCell>
      ))}
      <TableCell align="center">
        <Form.Select
          value={selectedUnitName}
          onChange={handleUnitNameChange}
        >
          <option value="">All Units</option>
          <option value="Tablet">Tablet</option>
          <option value="Capsule">Capsule</option>
          <option value="Bottle">Bottle</option>
          <option value="Repository">Repository</option>
          <option value="Catridge">Catridge</option>
        </Form.Select>
      </TableCell>
    </TableRow>
  );
}

function rowContent(_index, row) {
  const isHighQuantity = row.medicine_inhandquantity < 200;

  const rowStyle = {
    backgroundColor: isHighQuantity ? 'orange' : 'inherit',
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
  const { mdct_code, searchValue } = props; // Add searchValue prop
  const [allMedicines, setAllMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedUnitName, setSelectedUnitName] = useState('');

  useEffect(() => {
    axios.get("http://localhost:8080/fetchListOfMedicine").then((res) => {
      const modifiedData = res.data.map(item => ({
        ...item,
        medicine_info: `${item.mdct_code}${String(item.medicine_id).padStart(5, '0')} `
      }));
      setAllMedicines(modifiedData);
      setFilteredMedicines(modifiedData);
    });
  }, []);useEffect(() => {
    let data = allMedicines;
    if (mdct_code) {
      data = data.filter(item => item.mdct_code === mdct_code);
    }
    if (selectedUnitName) {
      data = data.filter(item => item.unit_name === selectedUnitName);
    }
    if (searchValue) {
      data = data.filter(item =>
        item.medicine_info.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.medicine_brandname.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.medicine_genericname.toLowerCase().includes(searchValue.toLowerCase())
      );
    }
    if (sortColumn) {
      data = [...data].sort((a, b) => {
        if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
        if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    setFilteredMedicines(data);
  }, [mdct_code, sortColumn, sortDirection, allMedicines, selectedUnitName, searchValue]);
  
  useEffect(() => {
    let data = allMedicines;
    if (mdct_code) {
      data = data.filter(item => item.mdct_code === mdct_code);
    }
    if (selectedUnitName) {
      data = data.filter(item => item.unit_name === selectedUnitName);
    }
    if (sortColumn) {
      data = [...data].sort((a, b) => {
        if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
        if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    setFilteredMedicines(data);
  }, [mdct_code, sortColumn, sortDirection, allMedicines, selectedUnitName]);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleUnitNameChange = (event) => {
    setSelectedUnitName(event.target.value);
  };

  return (
    <Paper style={{ height: 400, width: "100%" }}>
      <TableVirtuoso
        data={filteredMedicines}
        components={{
          ...VirtuosoTableComponents,
          TableHead: (props) => (
            <TableHead {...props}>
              {fixedHeaderContent({ sortColumn, sortDirection, onSort: handleSort, selectedUnitName, handleUnitNameChange })}
            </TableHead>
          ),
        }}
        fixedHeaderContent={() => fixedHeaderContent({ sortColumn, sortDirection, onSort: handleSort, selectedUnitName, handleUnitNameChange })}
        itemContent={rowContent}
      />
    </Paper>
  );
}
