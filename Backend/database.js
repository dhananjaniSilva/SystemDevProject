import mysql from "mysql2";

const pool = mysql
  .createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "pharmacy_database_new",
  })
  .promise();

export async function loginValidate(userObject) {
  // console.log(userObject.username)
  const [user] = await pool.query(
    "SELECT user_username FROM user WHERE user_username = ? AND user_password = ?",
    [userObject.username, userObject.password]
  );
  console.log(user);
  if (user.length > 0) {
    // User exists, return true
    console.log("this is the selected user :", user);
    return true;
  } else {
    // User does not exist, return false
    console.log("User does not exist:", user);
    return false;
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
    medicine.medicine_genericname LIKE CONCAT('%', ?, '%');

  `,
    [searchvalue, searchvalue, searchvalue]
  );
  console.log(listofMedicine);
  return listofMedicine;
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
