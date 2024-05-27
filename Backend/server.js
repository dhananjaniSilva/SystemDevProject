import express from "express";
import cors from "cors";
import {
  createMedicine,
  createMedicineCategory,
  deleteMedicineById,
  deleteMedicineCategoryById,
  fetchListofMedicine,
  fetchListofMedicineBySearch,
  fetchListofMedicineCategory,
  fetchListofMedicineCategorybyId,
  fetchListofMedicineUnit,
  fetchMedicineCategoryCode,
  loginValidate,
  updateMedicineCategory,
} from "./database.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  return res.json("From backend side");
});

app.get("/loginValidate", async (req, res) => {
  try {
    console.log("express app ", req.query.username);

    const response = await loginValidate(req.query);
    console.log("This is the response ", response);
    return res.json({ response });
  } catch (error) {
    console.log("Error in loginValidate", error);
  }
});

app.get("/fetchListOfMedicine", async (req, res) => {
  try {
    // console.log("express app ",req.query.username)

    const response = await fetchListofMedicine();
    return res.json(response);
  } catch (error) {
    console.log("Error in loginValidate", error);
  }
});
app.post("/createMedicine", async (req, res) => {
  try {
    const response = await createMedicine(req.body);
    console.log(response)
    return res.json(response);
  } catch (error) {
    console.error("Error creating medicine category:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});




app.get("/fetchListOfMedicineCategory", async (req, res) => {
  try {
    // console.log("express app ",req.query.username)

    const response = await fetchListofMedicineCategory();
    return res.json(response);
  } catch (error) {
    console.log("Error in loginValidate", error);
  }
});




app.get("/fetchListOfMedicineUnit", async (req, res) => {
  try {
    // console.log("express app ",req.query.username)

    const response = await fetchListofMedicineUnit();
    return res.json(response);
  } catch (error) {
    console.log("Error in loginValidate", error);
  }
});
app.get("/fetchMedicineCategoryById/:medicineCategoryId", async (req, res) => {
  try {
    // console.log("express app ",req.params.medicineCategoryId)

    const [response] = await fetchListofMedicineCategorybyId(req.params.medicineCategoryId);
    return res.json(response);
  } catch (error) {
    console.log("Error in loginValidate", error);
  }
});
app.post("/createMedicineCategory", async (req, res) => {
  try {
    const { categoryName, categoryCode } = req.body;
    const response = await createMedicineCategory(categoryName, categoryCode);
    console.log(response)
    return res.json(response);
  } catch (error) {
    console.error("Error creating medicine category:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
app.put("/updateMedicineCategory/:medicineCategoryId", async (req, res) => {
  try {
    const { medicineCategoryId } = req.params;
    const { mdct_name, mdct_code } = req.body;

    // Assuming `updateMedicineCategory` is a function that takes the ID and the new data to update the category
    const response = await updateMedicineCategory(medicineCategoryId, { mdct_name, mdct_code });
    
    console.log(response);
    return res.json(response);
  } catch (error) {
    console.error("Error updating medicine category:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});delete("/deleteMedicineCategoryById/:medicineCategoryId",async (req,res)=>{
  try{
    console.log(req.params.medicineCategoryId)
    const response = await deleteMedicineCategoryById(req.params.medicineCategoryId);
    return res.json(response)
  }catch(error){
    console.log("Error when deleting the medicine by Id",error)
  }
})
app.get("/searchMedicine", async (req, res) => {
  try {
    // console.log("express app ",req.query.username)
    console.log("query", req.query.searchVal);
    const response = await fetchListofMedicineBySearch(req.query.searchVal);
    return res.json(response);
  } catch (error) {
    console.log("Error in loginValidate", error);
  }
});
app.delete("/deleteMedicineById/:medicineId",async (req,res)=>{
  try{
    const response = await deleteMedicineById(req.params.medicineId);
    return res.json(response)
  }catch(error){
    console.log("Error when deleting the medicine by Id",error)
  }
})

app.get("/fetchListOfMedicineCategoryCode", async (req, res) => {
  try {
    // console.log("express app ",req.query.username)

    const response = await fetchMedicineCategoryCode();
    return res.json(response);
  } catch (error) {
    console.log("Error in loginValidate", error);
  }
});
const port = 8080;
app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
