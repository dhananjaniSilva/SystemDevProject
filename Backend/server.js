import express, { response } from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import {
  completeInvoice,
  createInvoiceAndRetrieveId,
  createMedicine,
  createMedicineCategory,
  deleteMedicineById,
  deleteMedicineCategoryById,
  fetchListofMedicine,
  fetchListofMedicineByMedicineId,
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

const verifyJWT = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    res.json({ auth: false, message: "failed" });
  } else {
    jwt.verify(token, "jwtSecret", (err, decoded) => {
      if (err) {
        res.json({ auth: false, message: "U failed to authencticate" });
      } else {
        req.role = decoded.role;
        console.log("veriy jwt else part ", req.role);
        next();
      }
    });
  }
};

app.get("/isUserAuth", verifyJWT, (req, res) => {
  return res.json({ auth: true, message: "You have a valid token" });
});

// app.get("/loginValidate", async (req, res) => {
//   try {
//     console.log("express app ", req.query.username);

//     const response = await loginValidate(req.query);
//     const id = response[1][0].user_id;
//     const userRole = response[1][0].role;
//     const userName = response[1][0].username;
//     console.log("id is", id, "Role is ", userRole);
//     const token = jwt.sign({ userRole }, "jwtSecret", {
//       expiresIn: 3600,
//     });

//     return res.json({
//       auth: true,
//       token: token,
//       result: userRole,
//       username: userName,
//     });
//   } catch (error) {
//     console.log("wrong", { auth: false, message: "express failed auth false" });
//     return res.json({ auth: false, message: "express failed auth false" });
//   }
// });

app.get("/loginValidate", async (req, res) => {
  try {
    console.log("express app ", req.query.username);

    const response = await loginValidate(req.query);
    console.log("This is the role ", response);
    const role = response.role;
    const username = response.username;
    const token = jwt.sign({ role }, "jwtSecret", {
      expiresIn: 3600,
    });

    return res.json({
      auth: true,
      token: token,
      role: role,
      username: username,
    });
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
    console.log(response);
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

    const [response] = await fetchListofMedicineCategorybyId(
      req.params.medicineCategoryId
    );
    return res.json(response);
  } catch (error) {
    console.log("Error in loginValidate", error);
  }
});
app.post("/createMedicineCategory", async (req, res) => {
  try {
    const { categoryName, categoryCode } = req.body;
    const response = await createMedicineCategory(categoryName, categoryCode);
    console.log(response);
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
    const response = await updateMedicineCategory(medicineCategoryId, {
      mdct_name,
      mdct_code,
    });

    console.log(response);
    return res.json(response);
  } catch (error) {
    console.error("Error updating medicine category:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
delete ("/deleteMedicineCategoryById/:medicineCategoryId",
async (req, res) => {
  try {
    console.log(req.params.medicineCategoryId);
    const response = await deleteMedicineCategoryById(
      req.params.medicineCategoryId
    );
    return res.json(response);
  } catch (error) {
    console.log("Error when deleting the medicine by Id", error);
  }
});
app.get("/searchMedicine", async (req, res) => {
  console.log("object");
  try {
    // console.log("express app ",req.query.username)
    console.log("query", req.query.searchVal);
    const response = await fetchListofMedicineBySearch(req.query.searchVal);
    return res.json(response);
  } catch (error) {
    console.log("Error in loginValidate", error);
  }
});

app.get("/searchMedicinebyId/:medicineId", async (req, res) => {
  try {
    const medicineIdWithCode = req.params.medicineId;

    const regex = /^([A-Z]{2,3})(\d+)$/;
    const match = medicineIdWithCode.match(regex);

    if (!match) {
      return res.status(400).json({ error: "Invalid Medicine ID format" });
    }

    const categoryCode = match[1];
    const medicineId = parseInt(match[2], 10);
    const [response] = await fetchListofMedicineByMedicineId(
      categoryCode,
      medicineId
    );
    return res.json(response);
  } catch (error) {
    console.log("Error in searchMedicinebyId", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/deleteMedicineById/:medicineId", async (req, res) => {
  try {
    const response = await deleteMedicineById(req.params.medicineId);
    return res.json(response);
  } catch (error) {
    console.log("Error when deleting the medicine by Id", error);
  }
});

app.get("/fetchListOfMedicineCategoryCode", async (req, res) => {
  try {
    // console.log("express app ",req.query.username)

    const response = await fetchMedicineCategoryCode();
    console.log("This is the response", response);
    return res.json(response);
  } catch (error) {
    console.log("Error in loginValidate", error);
  }
});

app.get("/createNewInvoice", async (req, res) => {
  try {
    const response = await createInvoiceAndRetrieveId();
    res.status(200).send(response.toString());
  } catch (error) {
    console.log("Error when creating the invoice", error);
    res.status(500).send("Error creating the invoice");
  }
});
app.post("/completeInvoice", async (req, res) => {
  try {
    const updatedInvoiceObject = req.body;
    // Process the updatedInvoiceObject as needed
    const response = completeInvoice(req.body);

    // Assuming you want to return some response after processing
    return response;
  } catch (error) {
    console.log("Error completing the invoice", error);
    return { createdStatus: false, message: "Error creating the invoice" };
    res.status(500).send("Error completing the invoice");
  }
});

const port = 8080;
app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
