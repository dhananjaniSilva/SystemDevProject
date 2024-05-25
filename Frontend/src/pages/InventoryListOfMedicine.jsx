import React, { useEffect, useState } from "react";
import "../stylings/pages/dashboard.css";
import IconBreadcrumbs from "../components/IconBreadcrumbs";
import "../stylings/pages/inventoryListOfMedicine.css";
import Form from "react-bootstrap/Form";
import FormTextExample from "../components/Inventory/TextField";
import ButtonComponent from "../components/ButtonComponent";
import ListOfMedicineTable from "../components/Inventory/ListOfMedicineTable.jsx";
import axios from "axios";

function InventoryListOfMedicine() {
  const [listOfMedicineArray, setListOfMedicineArray] = useState([]);
  const [selectedMdctCode, setSelectedMdctCode] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8080/fetchListOfMedicineCategory")
      .then((res) => {
        setListOfMedicineArray(res.data);
        console.log(res.data);
      });
  }, []);

  const handleAddNew = (val) => {
    console.log("handleAdd new", val);
  };

  const handleOnChange = (categoryCode) => {
    setSelectedMdctCode(categoryCode);
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
            <Form.Select
              id="select"
              onChange={(e) => handleOnChange(e.target.value)}
            >
              <option>-Select Group-</option>
              {listOfMedicineArray.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </Form.Select>
          </div>
        </div>
        {/* table part */}
        <div className="table-div">
          <ListOfMedicineTable listofMedicineArray={listOfMedicineArray} mdct_code={selectedMdctCode} />
        </div>
      </div>
    </div>
  );
}

export default InventoryListOfMedicine;
