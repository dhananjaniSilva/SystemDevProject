import mysql from "mysql2";

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
        "SELECT user_username, user_role_id FROM user WHERE user_username = ? AND user_password = ?",
        [userObject.username, userObject.password]
      );

      // Check if the user exists
      if (user.length > 0) {
        // User exists, return an object with the user details and a success flag
        return {
          success: true,
          username: user[0].user_username,
          role: user[0].user_role_id
        };
      } else {
        // User does not exist, return an object with the success flag set to false
        return {
          success: false,
          username: null,
          role: null
        };
      }
    } catch (error) {
      console.error("Error validating user:", error);
      return {
        success: false,
        username: null,
        role: null,
        error: error.message
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
  console.log(listofMedicine);
  return listofMedicine;
}


export async function fetchListofMedicineByMedicineId(categoryCode, medicineId) {
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
      medicine.medicine_id LIKE ? AND medicinecategory.mdct_code = ?
  `;
  
  // Adding '%' wildcards for LIKE clause
  const likeMedicineId = `%${medicineId}%`;

  const [listofMedicine] = await pool.query(query, [likeMedicineId, categoryCode]);
  
  console.log("ff", likeMedicineId, categoryCode);
  console.log(listofMedicine);
  
  return listofMedicine;
}

  
export async function fetchListofMedicineCategory() {
  const [listofMedicineCategories] = await pool.query(`
  SELECT *
  FROM medicinecategory
  `)

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
    const { medicine_brandname, medicine_genericname, mdct_id, unit_id, medicine_packsize } = formData;

    const [response] = await pool.query(
      "INSERT INTO medicine (medicine_brandname, medicine_genericname, medicine_categoryid, medicine_unitid, medicine_packsize) VALUES (?, ?, ?, ?, ?)",
      [medicine_brandname, medicine_genericname, mdct_id, unit_id, medicine_packsize]
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
        `INSERT INTO invoice ( inv_datetime, inv_total, inv_padiamount, inv_updatestatus) VALUES ( NOW(), ?, ?, 0)`,
        [ 0, 0]
      );


      // Get the ID of the newly created invoice
      invoiceId = newInvoice.insertId;
      console.log("New invoice inserted id",newInvoice.insertId)
    }
    console.log("inv",invoiceId)
    return invoiceId;
  } catch (error) {
    console.error("Error creating or retrieving invoice ID:", error);
    throw error; // Rethrow the error to handle it in the caller function
  }
}
