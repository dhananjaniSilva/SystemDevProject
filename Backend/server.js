import express from "express";
import cors from "cors";
import {
  deleteMedicineById,
  deleteMedicineCategoryById,
  fetchListofMedicine,
  fetchListofMedicineBySearch,
  fetchListofMedicineCategory,
  fetchMedicineCategoryCode,
  loginValidate,
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
app.get("/fetchListOfMedicineCategory", async (req, res) => {
  try {
    // console.log("express app ",req.query.username)

    const response = await fetchListofMedicineCategory();
    return res.json(response);
  } catch (error) {
    console.log("Error in loginValidate", error);
  }
});
app.delete("/deleteMedicineCategoryById/:medicineCategoryId",async (req,res)=>{
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

app.get("/fetchListOfMedicineCategory", async (req, res) => {
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
