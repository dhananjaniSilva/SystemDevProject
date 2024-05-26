import React, { useContext, useEffect, useState } from "react";
import "../stylings/pages/dashboard.css";
import IconBreadcrumbs from "../components/IconBreadcrumbs";
import "../stylings/pages/inventoryListOfMedicine.css";
import Form from "react-bootstrap/Form";
import ButtonComponent from "../components/ButtonComponent";
import ListOfMedicineTable from "../components/Inventory/ListOfMedicineTable.jsx";
import axios from "axios";
import OverlayDialogBox from "../components/OverlayDialogBox.jsx";
import { PopupContext } from "../contexts/MainContexts.jsx";
import MedicineEnterForm from "../components/MedicineEnterForm.jsx";

function InventoryListOfMedicine() {
  const { boolValue, setBoolValue } = useContext(PopupContext);
  const [listOfMedicineCategoryArray, setListOfMedicineCategoryArray] = useState([]);
  const [selectedMdctCode, setSelectedMdctCode] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [medicineArray, setMedicineArray] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/fetchListOfMedicineCategory")
      .then((res) => {
        console.log(res.data);
        setListOfMedicineCategoryArray(res.data);
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
      console.log(res.data)
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
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
            <Form.Select id="select" onChange={(e) => handleOnChange(e.target.value)}>
              <option value={0}>-Select Group-</option>
              {listOfMedicineCategoryArray.map((item, index) => (
                <option key={index} value={item.mdct_code}>
                  {item.mdct_name}
                </option>
              ))}
            </Form.Select>
          </div>
          <div className="right">
            <ButtonComponent
              variant="danger"
              text="Add New Items"
              className="cat1"
              onClick={() => setBoolValue(true)}
            />
          </div>
        </div>
        <div className="table-div">
          <ListOfMedicineTable
            listOfMedicineCategoryArray={listOfMedicineCategoryArray}
            mdct_code={selectedMdctCode}
            searchValue={searchValue}
            medicineArray={medicineArray}
          />
        </div>
      </div>
      <OverlayDialogBox>
        <MedicineEnterForm />
      </OverlayDialogBox>
    </div>
  );
}

export default InventoryListOfMedicine;
