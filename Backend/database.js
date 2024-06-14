import mysql from "mysql2";
import { response } from "express";

// host: "srv1327.hstgr.io",
// user: "u323893650_umesha",
// password: "Umesha123##11",
// database: "u323893650_phamacy",

const pool = mysql
  .createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "pharmacy_database_new",
  })
  .promise();

export async function loginValidate(userObject) {
  try {
    // Execute the query to check the user's credentials
    const [user] = await pool.query(
      "SELECT user_username, user_role_id ,user_id FROM user WHERE user_username = ? AND user_password = ?",
      [userObject.username, userObject.password]
    );

    // Check if the user exists
    if (user.length > 0) {
      // User exists, return an object with the user details and a success flag
      return {
        success: true,
        username: user[0].user_username,
        role: user[0].user_role_id,
        userId: user[0].user_id,
      };
    } else {
      // User does not exist, return an object with the success flag set to false
      return {
        success: false,
        username: null,
        userId: null,
        role: null,
      };
    }
  } catch (error) {
    console.error("Error validating user:", error);
    return {
      success: false,
      username: null,
      role: null,
      userId: null,
      error: error.message,
    };
  }
}

export async function fetchListofMedicine() {
  const [listofMedicine] = await pool.query(`
    SELECT 
      medicine.*, 
      medicinecategory.*, 
      unit.* 
    FROM 
      medicine 
    JOIN 
      medicinecategory 
    ON 
      medicine.medicine_categoryid = medicinecategory.mdct_id
    JOIN
      unit
    ON
      medicine.medicine_unitid = unit.unit_id
  `);
  return listofMedicine;
}

export async function fetchListofMedicineByMedicineId(
  categoryCode,
  medicineId
) {
  
  const query = `
    SELECT 
      medicine.*, 
      medicinecategory.mdct_code
    FROM 
      medicine 
    JOIN
      medicinecategory
    ON
      medicine.medicine_categoryid = medicinecategory.mdct_id
    WHERE 
      medicine.medicine_id = ? AND medicinecategory.mdct_code = ?
  `;

  // Adding '%' wildcards for LIKE clause
  const likeMedicineId = `%${medicineId}%`;

  const [listofMedicine] = await pool.query(query, [
    medicineId,
    categoryCode,
  ]);

  console.log("ff", medicineId, categoryCode);
  console.log(listofMedicine);

  return listofMedicine;
}

export async function fetchListofMedicineCategory() {
  const [listofMedicineCategories] = await pool.query(`
  SELECT *
  FROM medicinecategory
  `);

  return listofMedicineCategories;
}

export async function fetchListofMedicineUnit() {
  const [listofMedicineCategories] = await pool.query(`
  SELECT *
  FROM unit
  `);
  return listofMedicineCategories;
}
export async function fetchListofMedicineCategorybyId(medicineCategoryId) {
  const [listofMedicineCategories] = await pool.query(
    `
  SELECT *
  FROM medicinecategory
  WHERE mdct_id=?
  `,
    [medicineCategoryId]
  );
  return listofMedicineCategories;
}
export async function createMedicine(formData) {
  try {
    const {
      medicine_brandname,
      medicine_genericname,
      mdct_id,
      unit_id,
      medicine_packsize,
    } = formData;

    const [response] = await pool.query(
      "INSERT INTO medicine (medicine_brandname, medicine_genericname, medicine_categoryid, medicine_unitid, medicine_packsize) VALUES (?, ?, ?, ?, ?)",
      [
        medicine_brandname,
        medicine_genericname,
        mdct_id,
        unit_id,
        medicine_packsize,
      ]
    );

    if (response.affectedRows > 0) {
      return {
        success: true,
        message: "Medicine created successfully.",
      };
    } else {
      return { success: false, message: "Failed to create medicine." };
    }
  } catch (error) {
    console.error("Error creating medicine:", error);
    return {
      success: false,
      message: "An error occurred while creating medicine.",
    };
  }
}
export async function updateMedicinePrice(medicine_id, medicine_unitprice) {
  try {
    const query = `
      UPDATE medicine 
      SET medicine_unitprice = ? 
      WHERE medicine_id = ?
    `;

    const response = await pool.query(query, [medicine_unitprice, medicine_id]);

    if (response.affectedRows === 0) {
      // No rows were affected, indicating the medicine_id does not exist
      console.log(`No medicine found with id: ${medicine_id}`);
      return {
        success: false,
        message: "No medicine found with the given id.",
      };
    }

    console.log(`Medicine with id ${medicine_id} updated successfully.`);
    return { success: true, message: "Medicine updated successfully." };
  } catch (error) {
    console.error(`Error updating medicine with id ${medicine_id}:`, error);
    return { success: false, message: "Error updating medicine." };
  }
}
export async function deleteMedicineCategoryById(medicineCategoryId) {
  console.log("type", typeof medicineCategoryId);

  try {
    const [result] = await pool.query(
      `
      DELETE FROM medicine WHERE medicine_id = ?
    `,
      [medicineCategoryId]
    );

    if (result.affectedRows > 0) {
      console.log(
        `Medicine with ID ${medicineCategoryId} deleted successfully.`
      );
    } else {
      console.log(`No medicine found with ID ${medicineCategoryId}.`);
    }

    return result; // Return the result if needed
  } catch (error) {
    console.error("Error deleting medicine:", error);
    throw error; // Rethrow the error to handle it in the caller function
  }
}

export async function fetchListofMedicineBySearch(searchvalue) {
  console.log("se", searchvalue);
  const [listofMedicine] = await pool.query(
    `
    SELECT 
    medicine.*, 
    medicinecategory.*, 
    unit.* 
FROM 
    medicine 
JOIN 
    medicinecategory 
ON 
    medicine.medicine_categoryid = medicinecategory.mdct_id
JOIN
    unit
ON
    medicine.medicine_unitid = unit.unit_id
WHERE 
    medicine.medicine_id LIKE CONCAT('%', ?, '%') OR
    medicine.medicine_brandname LIKE CONCAT('%', ?, '%') OR
    medicine.medicine_genericname LIKE CONCAT('%', ?, '%') OR
    medicinecategory.mdct_code LIKE CONCAT('%', ?, '%');

  `,
    [searchvalue, searchvalue, searchvalue, searchvalue]
  );
  console.log(listofMedicine);
  return listofMedicine;
}
export async function createMedicineCategory(categoryName, categoryCode) {
  try {
    const [response] = await pool.query(
      "INSERT INTO medicinecategory (mdct_name, mdct_code) VALUES (?, ?)",
      [categoryName, categoryCode]
    );
    if (response.affectedRows > 0) {
      return {
        success: true,
        message: "Medicine category created successfully.",
      };
    } else {
      return { success: false, message: "Failed to create medicine category." };
    }
  } catch (error) {
    console.error("Error creating medicine category:", error);
    return {
      success: false,
      message: "An error occurred while creating medicine category.",
    };
  }
}

export async function updateMedicineCategory(
  medicineCategoryId,
  { mdct_name, mdct_code }
) {
  try {
    const [response] = await pool.query(
      "UPDATE medicinecategory SET mdct_name = ?, mdct_code = ? WHERE mdct_id = ?",
      [mdct_name, mdct_code, medicineCategoryId]
    );

    if (response.affectedRows > 0) {
      return {
        success: true,
        message: "Medicine category updated successfully.",
      };
    } else {
      return { success: false, message: "Failed to update medicine category." };
    }
  } catch (error) {
    console.error("Error updating medicine category:", error);
    return {
      success: false,
      message: "An error occurred while updating medicine category.",
    };
  }
}

export async function fetchMedicineCategoryCode() {
  const [listofMedicineCategoryCode] = await pool.query(`
    SELECT 
      mdct_code
    FROM
      medicinecategory
  `);
  const mdctCodesArray = listofMedicineCategoryCode.map(
    (item) => item.mdct_code
  );
  return mdctCodesArray;
}
export async function deleteMedicineById(medicineId) {
  const numericPart = medicineId.replace(/\D/g, ""); // Remove non-numeric characters
  console.log("Numeric part:", numericPart);
  const medId = parseInt(numericPart);
  console.log("Parsed integer:", medId);

  try {
    console.log("This is the medicine Id", medId);
    const result = await pool.query(
      `
      DELETE FROM medicine WHERE medicine_id = ?
    `,
      [medId]
    );

    if (result.affectedRows > 0) {
      console.log(`Medicine with ID ${medicineId} deleted successfully.`);
    } else {
      console.log(`No medicine found with ID ${medicineId}.`);
    }

    return result; // Return the result if needed
  } catch (error) {
    console.error("Error deleting medicine:", error);
    throw error; // Rethrow the error to handle it in the caller function
  }
}
export async function createInvoiceAndRetrieveId() {
  try {
    let invoiceId;

    // Check if there are any incomplete invoices
    const [incompleteInvoices] = await pool.query(
      `SELECT inv_id FROM invoice WHERE inv_updatestatus = 0 LIMIT 1`
    );

    if (incompleteInvoices.length > 0) {
      // If incomplete invoices found, return the ID of the first incomplete invoice

      invoiceId = incompleteInvoices[0].inv_id;
    } else {
      // If no incomplete invoices found, create a new invoice
      const newInvoice = await pool.query(
        `INSERT INTO invoice ( inv_datetime, inv_paidamount, inv_updatestatus) VALUES ( NOW(), ?, 0)`,
        [0]
      );

      // Get the ID of the newly created invoice
      invoiceId = newInvoice.insertId;
      console.log("New invoice inserted id", newInvoice.insertId);
    }
    console.log("inv", invoiceId);
    return invoiceId;
  } catch (error) {
    console.error("Error creating or retrieving invoice ID:", error);
    throw error; // Rethrow the error to handle it in the caller function
  }
}
export async function completeInvoice(invoiceObject) {
  try {
    // Update invoice data in the invoice table based on conditions
    await pool.query(
      `UPDATE invoice 
       SET inv_userid = ?, inv_datetime = ?, inv_paidamount = ?, inv_updatestatus = ?
       WHERE inv_id = ? AND inv_updatestatus = 0`,
      [
        invoiceObject.userId,
        invoiceObject.invoiceDate,
        invoiceObject.paidAmount,
        1, // Assuming 1 represents the status for a completed invoice
        invoiceObject.invoiceId,
      ]
    );

    // Insert medicine data into the invoicemedicine table
    for (const medicine of invoiceObject.medicineData) {
      await pool.query(
        `INSERT INTO invoicemedicine (invmd_invid, invmd_mdid, invmd_quantity) VALUES (?, ?, ?)`,
        [
          invoiceObject.invoiceId,
          medicine.medicineId,
          medicine.medicineQuantity,
        ]
      );

      const [rows] = await pool.query(
        `SELECT medicine_inhandquantity FROM medicine WHERE medicine_id=?`,
        [medicine.medicineId]
      );

      if (rows.length === 0) {
        throw new Error(`Medicine with ID ${medicine.medicineId} not found`);
      }

      const currentQuantity = rows[0].medicine_inhandquantity;
      const newQuantity = currentQuantity - medicine.medicineQuantity;

      if (newQuantity < 0) {
        throw new Error(
          `Not enough quantity for medicine with ID ${medicine.medicineId}`
        );
      }

      await pool.query(
        `UPDATE medicine SET medicine_inhandquantity = ? 
        WHERE medicine_id=?`,
        [newQuantity, medicine.medicineId]
      );
    }

    console.log("Invoice and medicine data inserted successfully");
    return { createdStatus: true, message: "Successfully created" };
  } catch (error) {
    console.error("Error completing invoice:", error);
    return { createdStatus: false, message: "Error creating the invoice" };

    throw error; // Rethrow the error to handle it in the caller function
  }
}
export async function fetchSupplyInformation() {
  try {
    const [listofSupplyInformation] = await pool.query(`
    SELECT medicine.*, supply.*, supplier.*
    FROM supply
    JOIN supplier ON supply.sply_spid = supplier.sp_id
    JOIN medicine ON supply.sply_mdid = medicine.medicine_id
    
    `);
    return listofSupplyInformation;
  } catch (error) {
    console.error("Error fetching supply information:", error);
    throw error; // Re-throw the error if you want it to be handled further up the call stack
  }
}
export async function fetchSupplyInformationGroupByMDID() {
  try {
    const [listofSupplyInformation] = await pool.query(`
    SELECT medicine.*, supply.*, supplier.*,medicineCategory.mdct_code
    FROM supply
    JOIN supplier ON supply.sply_spid = supplier.sp_id
    JOIN medicine ON supply.sply_mdid = medicine.medicine_id
    JOIN medicineCategory ON medicine.medicine_categoryid = medicineCategory.mdct_id
    GROUP BY medicine.medicine_id;

    `);
    return listofSupplyInformation;
  } catch (error) {
    console.error("Error fetching supply information:", error);
    throw error; // Re-throw the error if you want it to be handled further up the call stack
  }
}
export async function fetchSupplierByCompanyName(companyName) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      "SELECT * FROM supplier WHERE sp_companyname LIKE ?",
      [`%${companyName}%`]
    );
    return [rows];
  } finally {
    connection.release();
  }
}
export async function insertSupplyDetails(supplyDetails) {
  try {
    // Extract the supply details from the object
    const {
      supplierId,
      medicineId,
      sply_quantity,
      sply_datetime,
      sply_expiredate,
      sply_unit_buying_price,
    } = supplyDetails;

    // Insert the supply details into the database
    const query = `
      INSERT INTO supply (sply_spid, sply_mdid, sply_quantity, sply_datetime, sply_expiredate, sply_unit_buying_price)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    await pool.query(query, [
      supplierId,
      medicineId,
      sply_quantity,
      sply_datetime,
      sply_expiredate,
      sply_unit_buying_price,
    ]);

    // Return success message or any other necessary data
    return { success: true, message: "Supply details inserted successfully" };
  } catch (error) {
    // Handle errors
    console.error("Error inserting supply details:", error);
    throw error; // Rethrow the error to be caught by the caller
  }
}
export async function deleteStockByStockId(sply_stockid) {
  try {
    // Execute the DELETE query to remove the row with the specified stock id
    const result = await pool.query(
      `
      DELETE FROM supply WHERE sply_stockid = ?
    `,
      [sply_stockid]
    );

    // Check if any rows were affected by the delete operation
    if (result.affectedRows > 0) {
      console.log(`Stock with ID ${sply_stockid} deleted successfully.`);
    } else {
      console.log(`No stock found with ID ${sply_stockid}.`);
    }

    // Return the result if needed
    return result;
  } catch (error) {
    // Log and rethrow any errors that occur during the delete operation
    console.error("Error deleting stock:", error);
    throw error;
  }
}
export async function newUserAdd(user) {
  try {
    console.log(user);
    const {
      user_fname,
      user_lname,
      user_role_id,
      user_nic,
      user_pno,
      user_password,
      user_username,
    } = user;
    const result = await pool.query(
      `INSERT INTO user (user_fname, user_lname, user_role_id, user_nic, user_pno, user_password, user_username) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        user_fname,
        user_lname,
        user_role_id,
        user_nic,
        user_pno,
        user_password,
        user_username,
      ]
    );
    return result;
  } catch (error) {
    console.log("Backend user add error:", error);
    throw error;
  }
}
export async function getUsers() {
  try {
    const [response] = await pool.query(
      `SELECT user.user_id, user.user_fname,user.user_lname,user.user_pno,user.user_nic,user.user_username,role.role_name 
      FROM user JOIN role ON user.user_role_id=role.role_id
      WHERE user.user_delete_status=0`
    );
    return response;
  } catch (error) {
    console.log(error);
  }
}
export async function editUser(user) {
  const {
    user_id,
    user_fname,
    user_lname,
    user_role_id,
    user_nic,
    user_pno,
    user_password,
    user_username,
  } = user;

  try {
    const query = `
      UPDATE user
      SET user_fname = ?, user_lname = ?, user_role_id = ?,
          user_nic = ?, user_pno = ?, user_password = ?,
          user_username = ?
      WHERE user_id = ?
    `;
    const values = [
      user_fname,
      user_lname,
      user_role_id,
      user_nic,
      user_pno,
      user_password,
      user_username,
      user_id,
    ];

    const result = await pool.query(query, values);
    console.log("UPDATE result:", result); // Log the result object for debugging

    // Check if any rows were affected by the update
    if (result.affectedRows > 0) {
      return true; // Return the updated user object
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error in editUser:", error);
    throw error; // Throw the error for handling in higher levels
  }
}
export async function deleteUser(userId) {
  try {
    const query = `
     UPDATE user
     SET user_delete_status = 1
     WHERE user_id=?
    `;
    const values = [userId];

    const result = await pool.query(query, values);
    return result.rowCount; // Number of rows deleted (should be 1 if successful)
  } catch (error) {
    console.error('Error in deleteUser:', error);
    throw error;
  }
}
export async function getSalesReport() {
  try {
    const [response] = await pool.query(`
SELECT 
    invoice.inv_id, 
    invoice.inv_datetime, 
    invoice.inv_paidamount, 
    user.user_fname, 
    user.user_lname,
    SUM(medicine.medicine_unitprice * invoicemedicine.invmd_quantity) AS totalPrice
FROM 
    invoice
INNER JOIN 
    user ON invoice.inv_userid = user.user_id
INNER JOIN 
    invoicemedicine ON invoice.inv_id = invoicemedicine.invmd_invid
INNER JOIN 
    medicine ON invoicemedicine.invmd_mdid = medicine.medicine_id
GROUP BY 
    invoice.inv_id;

`);
    console.log(response);
    return response;
  } catch (error) {
    console.log("error occured in backend ", error);
  }
}

export async function getSalesReportFastMoving(s,a) {
  try {
    const [response] = await pool.query(`
    SELECT 
      medicine.medicine_id,
      medicine.medicine_brandname,
      medicine.medicine_genericname,
      SUM(invoicemedicine.invmd_quantity) AS total_sales
    FROM 
      invoicemedicine
    INNER JOIN 
      medicine ON invoicemedicine.invmd_mdid = medicine.medicine_id
    GROUP BY 
      medicine.medicine_id,
      medicine.medicine_brandname,
      medicine.medicine_genericname
    ORDER BY 
      total_sales DESC;
`);
    console.log(response);
    return response;
  } catch (error) {
    console.log("error occured in backend ", error);
  }
}

