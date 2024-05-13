import React from "react";
import "../stylings/pages/dashboard.css";
import IconBreadcrumbs from "../components/IconBreadcrumbs";
import "../stylings/pages/inventoryListOfMedicine.css";
import Form from "react-bootstrap/Form";

import FormTextExample from "../components/Inventory/TextField";
import ButtonComponent from "../components/ButtonComponent";
import TableComponent from "../components/Inventory/TableComponent";

function InventoryListOfMedicine() {
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
              text="Add New Items"
              className="cat1"
            />
            <Form.Select id="select">
              <option>-Select Group-</option>
              <option></option>
              <option>Motti</option>
            </Form.Select>
          </div>
        </div>
        {/* table part */}
        <div className="table-div">
          <TableComponent/>
        </div>
      </div>
    </div>
  );
}

export default InventoryListOfMedicine;
