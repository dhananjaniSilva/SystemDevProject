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
  const [listOfMedicineCategoryArray, setListOfMedicineCategoryArray] =
    useState([]);
  const [selectedMdctCode, setSelectedMdctCode] = useState(null);
  const [searchValue, setSearchValue] = useState();

  useEffect(() => {
    axios
      .get("http://localhost:8080/fetchListOfMedicineCategory")
      .then((res) => {
        setListOfMedicineCategoryArray(res.data);
        console.log(res.data);
      });
  }, []);

  const handleAddNew = (val) => {
    console.log("handleAdd new", val);
  };

  const handleOnChange = (categoryCode) => {
    setSelectedMdctCode(categoryCode);
  };
  const handleSearch = async (searchVal) => {
    setSearchValue(searchVal);
    try {
      const res = await axios.get("http://localhost:8080/searchMedicine", {
        params: { searchVal },
      });
      setMedicineArray(res.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
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
              <option>-Select Group-</option>
              {listOfMedicineCategoryArray.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </Form.Select>
          </div>
        </div>
        {/* table part */}
        <div className="table-div">
        <ListOfMedicineTable
  istOfMedicineCategoryArray={listOfMedicineCategoryArray}
  mdct_code={selectedMdctCode}
  searchValue={searchValue} // Pass searchValue prop
/>

        </div>
      </div>
    </div>
  );
}

export default InventoryListOfMedicine;
