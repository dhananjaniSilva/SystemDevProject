import mysql from "mysql2";


const pool = mysql
  .createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pharmacy_db',
  })
  .promise();

  export async function loginValidate(userObject) {
   // console.log(userObject.username)
    const [user] = await pool.query(
      "SELECT username FROM systemadmin WHERE username = ? AND password = ?",
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
  