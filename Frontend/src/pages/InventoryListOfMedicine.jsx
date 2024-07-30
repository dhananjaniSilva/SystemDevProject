import React, { useContext, useEffect, useState } from "react";
import IconBreadcrumbs from "../components/IconBreadcrumbs";
import Form from "react-bootstrap/Form";
import ButtonComponent from "../components/ButtonComponent";
import ListOfMedicineTable from "../components/Inventory/ListOfMedicineTable.jsx";
import axios from "axios";
import OverlayDialogBox from "../components/OverlayDialogBox.jsx";
import { PopupContext } from "../contexts/MainContexts.jsx";
import MedicineEnterForm from "../components/MedicineEnterForm.jsx";

function InventoryListOfMedicine() {
  // Using context to handle popup state
  const { boolValue, setBoolValue } = useContext(PopupContext);
  const [listOfMedicineCategoryArray, setListOfMedicineCategoryArray] = useState([]);
  const [selectedMdctCode, setSelectedMdctCode] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [medicineArray, setMedicineArray] = useState([]);


  // Fetch the list of medicine categories on initial load
  useEffect(() => {
    axios
      .get("http://localhost:8080/fetchListOfMedicineCategory")
      .then((res) => {
        console.log(res.data);
        setListOfMedicineCategoryArray(res.data);
      });
  }, []);

   // Fetch all medicines when search value is empty
  useEffect(() => {
    if (searchValue === "") {
      fetchAllMedicines();
    }
  }, [searchValue]);

  // When the search values in the text area is empty, fetch all the medicines
  const fetchAllMedicines = async () => {
    try {
      const res = await axios.get("http://localhost:8080/fetchAllMedicines");
      setMedicineArray(res.data);
    } catch (error) {
      console.error("Error fetching all medicines:", error);
    }
  };

  // Handle adding a new medicine (currently only logs to console)
  const handleAddNew = (val) => {
    console.log("handleAdd new", val);
  };

   // Handle selection of a medicine category
  const handleOnChange = (categoryCode) => {
    setSelectedMdctCode(categoryCode);
  };

  // Handle search functionality
  const handleSearch = async (searchVal) => {
    setSearchValue(searchVal);
    if (searchVal === "") {
      fetchAllMedicines();
    } else {
      try {
        const res = await axios.get("http://localhost:8080/searchMedicine", {
          params: { searchVal },
        });
        setMedicineArray(res.data);
        console.log(res.data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    }
  };

  return (
    <div className="body">
      <div className="outer-div">
        <div className="top">
          <div className="left">
            {/* <IconBreadcrumbs /> */}
            <div style={{ paddingRight: "20px"}}>
              <h3><span style={{ color: "grey" }}>Inventory</span> &gt; List of Medicines</h3>
            </div>

            {/* Fetch medicine categories from the array and display in the select category bar */}
            <Form.Select id="select" onChange={(e) => handleOnChange(e.target.value)}> 
              <option value={0}>- Select Medicine Category -</option>
              {listOfMedicineCategoryArray.map((item, index) => (
                <option key={index} value={item.mdct_code}>
                  {item.mdct_code}
                </option>
              ))}
            </Form.Select>
            
            <Form.Control           // Search medicine bar
              placeholder="- Search Medicine - "
              style={{ width: "365px", color: "black" }}
              onChange={(e) => handleSearch(e.target.value)}
              type="text"
              id="inputPassword5"
              aria-describedby="passwordHelpBlock"
            />          
          </div>
          
          <div className="right"> 
            <ButtonComponent              // Add new medicine button
              variant="danger"
              text="+ Add New Medicines"
              color={"#dd0b81"}
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
