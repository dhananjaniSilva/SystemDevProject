import React from "react";
import "../../../stylings/pages/dashboard.css";

import "../../../stylings/pages/inventoryListOfMedicine.css";

import ButtonComponent from "../../../components/ButtonComponent";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { PopupContext } from "../../../contexts/MainContexts";
import { useContext } from "react";
import OverlayDialogBox from "../../../components/OverlayDialogBox";
import PCMedicineCategoryTable from "./PCMedicineCategoryTable";

function PCMedicineGroups() {
  const { boolValue, setBoolValue, medicineCategoryId, setMedicineCategoryId } =
    useContext(PopupContext);

  const handleAddMedicineCategory = () => {
    setMedicineCategoryId(0);
    setBoolValue(true);
  };

  return (
    <div className="body">
      <div className="outer-div">
        {/* top row */}
        <div className="top">
          <div className="left">
          </div>
          <div className="right">
          
          </div>
        </div>
        {/* table part */}
        <div className="table-div">
          <PCMedicineCategoryTable />
        </div>
      </div>
      {boolValue && medicineCategoryId === 0 && (
        <OverlayDialogBox>
          <MedicineCategoryForm />
        </OverlayDialogBox>
      )}
    </div>
  );
}

export default PCMedicineGroups;
