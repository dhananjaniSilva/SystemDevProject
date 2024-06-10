import React from "react";
import "../../../stylings/pages/dashboard.css";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import ButtonComponent from "../../../components/ButtonComponent";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { PopupContext } from "../../../contexts/MainContexts";
import { useContext } from "react";
import OverlayDialogBox from "../../../components/OverlayDialogBox";
import ICMedicineCategoryTable from "./ICMedicineCategorytable";
import MedicineCategoryForm from "../../Inventory/MedicineCategoryForm";

function ICMedicineGroups() {
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
             {/* <IconBreadcrumbs /> */}
             <div style={{ paddingRight: "20px"}}>
              <h3><span style={{ color: "grey" }}>Inventory</span> &gt; Medicine Categories</h3>
            </div>
          </div>
          <div className="right">
            <ButtonComponent
              variant="danger"
              text="Add New Category"
              className="cat1"
              icon={AddOutlinedIcon}
              onClick={handleAddMedicineCategory}
            />
          </div>
        </div>
        {/* table part */}
        <div className="table-div">
          <ICMedicineCategoryTable />
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

export default ICMedicineGroups;
