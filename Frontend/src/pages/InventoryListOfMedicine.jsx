import React, { useEffect } from "react";
import "../stylings/pages/dashboard.css";
import IconBreadcrumbs from "../components/IconBreadcrumbs";
import "../stylings/pages/inventoryListOfMedicine.css";
import Form from "react-bootstrap/Form";
import FormTextExample from "../components/Inventory/TextField";
import ButtonComponent from "../components/ButtonComponent";
import ListOfMedicineTable from "../components/Inventory/ListOfMedicineTable.jsx";
import axios from "axios";
import { useState } from "react";

function InventoryListOfMedicine() {

  const [listOfMedicineArray, setListOfMedicineArray] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/fetchListOfMedicine").then((res) => {
      setListOfMedicineArray(res.data);
      console.log(res.data);
    });
  }, []);

  const handleAddNew = (val) => {
    console.log("handleAdd new", val);
  };

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
              onClick={() => handleAddNew("hey")}
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
          <ListOfMedicineTable listofMedicineArray={listOfMedicineArray} />
        </div>
      </div>
    </div>
  );
}

export default InventoryListOfMedicine;
