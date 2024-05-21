import React from "react";
import "../stylings/pages/dashboard.css";
import IconBreadcrumbs from "../components/IconBreadcrumbs";
import "../stylings/pages/inventoryListOfMedicine.css";
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

import FormTextExample from "../components/Inventory/TextField";
import ButtonComponent from "../components/ButtonComponent";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

function MedicineGroups() {
  return (
    <div className="body">
      <div className="outer-div">
        {/* //top row */}
        <div className="top">
          <div className="left">
            <IconBreadcrumbs />
            <FormTextExample
              placeholderValue="Search Medicine Inventory"
              type="text"
            />
          </div>
          <div className="right">
            <ButtonComponent
              variant="danger"
              text="Add Medicine"
              className="cat1"
              icon={AddOutlinedIcon}
            />
            {/* <Form.Select id="select">
              <option>-Select Group-</option>
              <option></option>
              <option>Motti</option>
            </Form.Select> */}
          </div>
        </div>
        {/* table part */}
        <div className="table-div">
          {/* <TableComponent/> */}
          <ButtonComponent variant="outline-danger" className="cat1" text="Delete group" icon={DeleteOutlinedIcon}/>
        </div>
        
      </div>
    </div>
  );
}

export default MedicineGroups;
