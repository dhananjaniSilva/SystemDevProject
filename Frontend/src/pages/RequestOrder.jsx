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
  const [medicineArray, setMedicineArray] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [supplierInfo, setSupplierInfo] = useState(null);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/fetchSupplyDataGroupByMDID").then((res) => {
      console.log("supply", res.data);
      setMedicineArray(res.data);
    });
  }, []);

  const handleSearch = async (searchValue) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/searchSupplierbyCompanyname/${searchValue}`
      );
      const supplierData = response.data;

      if (supplierData.length > 0) {
        const supplierIds = supplierData.map((supplier) => supplier.sp_id);
        const filteredData = medicineArray.filter((medicine) =>
          supplierIds.includes(medicine.sp_id)
        );
        setTableData(filteredData);
        setSupplierInfo(supplierData[0]); // Assuming you want to display the first supplier's info
      } else {
        setTableData([]);
        setSupplierInfo(null);
      }
    } catch (error) {
      console.error("Error fetching supplier data:", error);
    }
  };

  return (
    <div className="body">
      <div className="outer-div">
        <div className="top">
          <div className="left">
             {/* <IconBreadcrumbs /> */}
             <div style={{ paddingRight: "20px"}}>
              <h3>Request Order</h3>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", height: "100%", width: "100%" }}>
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent:"space-between"
            }}
          >
            <RequestOrderTable
              data={tableData}
              searchValue={searchValue}
              medicineArray={medicineArray}
              setMedicineArray={setMedicineArray}
            />
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
