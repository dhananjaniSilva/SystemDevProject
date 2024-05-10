import React from "react";
import "../stylings/pages/dashboard.css";
import IconBreadcrumbs from "../components/IconBreadcrumbs";
import "../stylings/pages/inventoryListOfMedicine.css";

import FormTextExample from "../components/Inventory/TextField";

function InventoryListOfMedicine() {
  return (
    <div className="body">
      <div className="outer-div">
        {/* //top row */}
        <div className="top">
          <div className="left">
            <IconBreadcrumbs />
            <FormTextExample/>
         
  
          </div>
          <div className="right"></div>
        </div>
        {/* table part */}
        <div className="table-div">
        
        </div>

      </div>
    </div>
  );
}

export default InventoryListOfMedicine;
