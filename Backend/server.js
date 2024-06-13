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
  deleteStockByStockId,
  deleteUser,
  editUser,
  fetchListofMedicine,
  fetchListofMedicineByMedicineId,
  fetchListofMedicineBySearch,
  fetchListofMedicineCategory,
  fetchListofMedicineCategorybyId,
  fetchListofMedicineUnit,
  fetchMedicineCategoryCode,
  fetchSupplierByCompanyName,
  fetchSupplyInformation,
  fetchSupplyInformationGroupByMDID,
  getSalesReport,
  getSalesReportFastMoving,
  getUsers,
  insertSupplyDetails,
  loginValidate,
  newUserAdd,
  updateMedicineCategory,
  updateMedicinePrice,
} from "./database.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  return res.json("From backend side");
});

const verifyJWT = (allowedRoles) => {
  return (req, res, next) => {
    const token = req.headers["x-access-token"];
    if (!token) {
      console.log("No token provided");
      return res.json({ auth: false, message: "No token provided" });
    } else {
      jwt.verify(token, "jwtSecret", (err, decoded) => {
        if (err) {
          console.log("Failed to authenticate token");
          return res.json({
            auth: false,
            message: "Failed to authenticate token",
          });
        } else {
          req.role = parseInt(decoded.role); // Convert decoded role to number
          console.log("Decoded role type: ", typeof req.role); // Log the type of decoded role
          console.log("Allowed roles type: ", typeof allowedRoles[0]); // Log the type of first element in allowed roles
          console.log("Decoded role: ", req.role);
          console.log("Allowed roles: ", allowedRoles);
          if (allowedRoles.includes(req.role)) {
            next();
          } else {
            console.log("Unauthorized access attempt with role: ", req.role);
            return res
              .status(403)
              .json({ auth: false, message: "Unauthorized" });
          }
        }
      });
    }
  };
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

    if (response.success == true) {
      const role = response.role;
      const username = response.username;
      const userId = response.userId;
      const token = jwt.sign({ role }, "jwtSecret", {
        expiresIn: 60 * 60 * 24,
      });

      return res.json({
        auth: true,
        token: token,
        role: role,
        username: username,
        userId: userId,
      });
    } else {
      return res.json({
        auth: false,
      });
    }
  } catch (error) {
    console.log("Error in loginValidate", error);
  }
});

app.get("/fetchListOfMedicine", async (req, res) => {
  try {
    const response = await fetchListofMedicine();
    return res.json(response);
  } catch (error) {
    console.log("Error in fetchListOfMedicine", error);
    return res.status(500).json({ error: "Internal Server Error" });
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
app.post("/updateMedicinePrice", async (req, res) => {
  const { medicine_id, medicine_unitprice } = req.body;

  try {
    const response = await updateMedicinePrice(medicine_id, medicine_unitprice);

    if (response.success) {
      return res.status(200).json(response);
    } else {
      return res.status(400).json(response);
    }
  } catch (error) {
    console.error("Error in /updateMedicinePrice route:", error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred.",
    });
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
app.get("/searchSupplierbyCompanyname/:companyName", async (req, res) => {
  try {
    const companyName = req.params.companyName;

    const [response] = await fetchSupplierByCompanyName(companyName);
    return res.json(response);
  } catch (error) {
    console.log("Error in searchSupplierbyCompanyname", error);
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
  console.log("object");
  try {
    const updatedInvoiceObject = req.body;
    // Call completeInvoice function and await its completion
    const response = await completeInvoice(updatedInvoiceObject); // Await here
    console.log(response);
    // Check the response from completeInvoice function
    if (response.createdStatus) {
      // Return success response if invoice completed successfully
      res
        .status(200)
        .json({ message: "Invoice completed successfully", response });
    } else {
      // Return error response if invoice creation failed
      res
        .status(500)
        .json({ message: "Error completing the invoice", response });
    }
  } catch (error) {
    console.error("Error completing the invoice:", error);
    // Handle any uncaught errors
    res
      .status(500)
      .json({ message: "Error completing the invoice", error: error.message });
  }
});
app.post("/supplyDetailsCreate", async (req, res) => {
  try {
    const stockObject = req.body;

    // Insert supply details into the database
    const response = await insertSupplyDetails(stockObject);

    // Send a success response with the inserted supply details
    res.status(200).json(response);
  } catch (error) {
    console.error("Error creating the invoice", error);
    // Send an error response
    res
      .status(500)
      .json({ createdStatus: false, message: "Error creating the invoice" });
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

app.get("/fetchSupplyData", async (req, res) => {
  try {
    const listofSupplyInformation = await fetchSupplyInformation();
    res.json(listofSupplyInformation);
  } catch (error) {
    console.error("Error fetching supply data:", error);
    res.status(500).send("Error fetching supply data");
  }
});
app.get("/fetchSupplyDataGroupByMDID", async (req, res) => {
  try {
    const listofSupplyInformation = await fetchSupplyInformationGroupByMDID();
    res.json(listofSupplyInformation);
  } catch (error) {
    console.error("Error fetching supply data:", error);
    res.status(500).send("Error fetching supply data");
  }
});

app.delete("/deleteSupply/:sply_stockid", async (req, res) => {
  try {
    const { sply_stockid } = req.params;
    await deleteStockByStockId(sply_stockid); // Await the function call
    res.json({ success: true, message: "Stock item deleted successfully" });
  } catch (error) {
    console.error("Error deleting stock item:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete stock item" });
  }
});

app.post("/createUser", async (req, res) => {
  try {
    const response = await newUserAdd(req.body);
    res.json({ success: true, message: "User added successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to add user" });
  }
});

app.get("/getUsers", async (req, res) => {
  try {
    const response = await getUsers();
    console.log(response);
    return res.json(response);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed te retrieve users" });
  }
});

app.get("/api/sales-report", async (req, res) => {
  try {
    const salesReport = await getSalesReport();
    res.json({ success: true, data: salesReport });
  } catch (error) {
    console.error("Error occurred in backend: ", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

app.get("/api/fastmoving-report", async (req, res) => {
  try {
    console.log("object")
    const { startDate, endDate } = req.query;

    // Validate start and end dates
    if (!startDate || !endDate) {
      const startDate = new Date(0);
      const endDate = new Date();
    }
    console.log("sold qu");
    // Call getSalesReport function with start and end dates
    const salesReport = await getSalesReportFastMoving(startDate, endDate);
    console.log(salesReport);

    res.json({ success: true, data: salesReport });
  } catch (error) {
    console.error("Error occurred in backend: ", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

app.put("/updateUser/:userId", async (req, res) => {
  const userId = req.params.userId;
  const userData = req.body; // Assuming you're sending user data in the request body

  try {
    const updatedUser = await editUser({
      user_id: userId,
      ...userData,
    });

    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ success: false, error: "Failed to update user" });
  }
});

app.delete("/deleteUser/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    await deleteUser(userId);
    const users = await getUsers(); // Optionally fetch updated users after deletion
    res.status(200).json(users);
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});
const port = 8080;
app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
