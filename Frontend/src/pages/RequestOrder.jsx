// RequestOrder.jsx
import React, { useContext, useState, useEffect } from "react";
import "../stylings/pages/dashboard.css";
import { Button, Box, Paper, Stack, Typography } from "@mui/material";
import RequestOrderTable from "../components/RequestOrder/RequestOrderTable";
import IconBreadcrumbs from "../components/IconBreadcrumbs";
import Form from "react-bootstrap/Form";
import ButtonComponent from "../components/ButtonComponent";
import axios from "axios";
import OverlayDialogBox from "../components/OverlayDialogBox.jsx";
import { PopupContext } from "../contexts/MainContexts.jsx";
import MedicineEnterForm from "../components/MedicineEnterForm.jsx";

function RequestOrder() {
  const { boolValue, setBoolValue } = useContext(PopupContext);
  const [listOfMedicineCategoryArray, setListOfMedicineCategoryArray] =
    useState([]);
  const [selectedMdctCode, setSelectedMdctCode] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [medicineArray, setMedicineArray] = useState([]);
  const [supplierInfo, setSupplierInfo] = useState(null);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/fetchSupplyData")
      .then((res) => {
        console.log(res.data);
        setListOfMedicineCategoryArray(res.data);
      });
  }, []);

  const handleOnChange = (categoryCode) => {
    setSelectedMdctCode(categoryCode);
  };

  const handleSearch = async (searchVal) => {
    setSearchValue(searchVal);
    try {
      const res = await axios.get("http://localhost:8080/fetchSupplyData", {
        params: { searchVal },
      });
      setMedicineArray(res.data);
      console.log("supplier", res.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }

    // Fetch supplier info based on the search value
    const fetchSupplierInfo = async () => {
      try {
        const res = await axios.get("http://localhost:8080/fetchSupplierData", {
          params: { companyName: searchVal },
        });
        setSupplierInfo(res.data);
      } catch (error) {
        console.error("Error fetching supplier info:", error);
      }
    };

    fetchSupplierInfo();
  };

  const handleRowClick = (row) => {
    // handle row click here, you can set selected row data to state
    // for example, setTableData(row);
  };

  return (
    <div className="body">
      <div className="outer-div">
        <div className="top">
          <div className="left">
            <IconBreadcrumbs />
            <Form.Control
              placeholder="Search here ..."
              style={{ width: "309px" }}
              onChange={(e) => handleSearch(e.target.value)}
              type="text"
              id="inputPassword5"
              aria-describedby="passwordHelpBlock"
            />
            <Form.Select
              id="select"
              onChange={(e) => handleOnChange(e.target.value)}
            >
              <option value={0}>-Select Group-</option>
              {listOfMedicineCategoryArray.map((item, index) => (
                <option key={index} value={item.mdct_code}>
                  {item.mdct_code}
                </option>
              ))}
            </Form.Select>
          </div>
          <div className="right">
            <ButtonComponent
              variant="danger"
              text="+ Add New Items"
              className="cat1"
              onClick={() => setBoolValue(true)}
            />
          </div>
        </div>
        <div style={{ display: "flex", height: "100%" }}>
          <div style={{ width: "50%", height: "100%" }}>
            <RequestOrderTable
              data={tableData}
              searchValue={searchValue}
              onRowClick={handleRowClick}
            />
          </div>
          <div style={{ width: "50%", height: "100%" }}>
            <Paper sx={{ p: 2 }}>
              <Stack>
                <Box>
                  <Typography>
                    Supplier Company:{" "}
                    {supplierInfo && supplierInfo.sp_companyname}
                  </Typography>
                  <Typography>
                    Agent Name: {supplierInfo && supplierInfo.agentName}
                  </Typography>
                  <Typography>
                    Supplier Phone number:{" "}
                    {supplierInfo && supplierInfo.phoneNumber}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </div>
        </div>
      </div>
      <OverlayDialogBox>
        <MedicineEnterForm />
      </OverlayDialogBox>
    </div>
  );
}

export default RequestOrder;
