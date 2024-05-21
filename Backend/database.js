import mysql from "mysql2";


const pool = mysql
  .createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pharmacy_database_new',
  })
  .promise();

  export async function loginValidate(userObject) {
   // console.log(userObject.username)
    const [user] = await pool.query(
      "SELECT username FROM user WHERE username = ? AND password = ?",
      [userObject.username, userObject.password]
    );
    if (user.length > 0) {
        // User exists, return true
        console.log("this is the selected user :",user)
        return true;
      } else {
        // User does not exist, return false
        console.log("User does not exist:",user)
        return false;
      }
    }
  export async function fetchListofMedicine(){
    const [listofMedicine]=await pool.query(
      "SELECT * FROM medicine"
    )
    
    return listofMedicine
  }