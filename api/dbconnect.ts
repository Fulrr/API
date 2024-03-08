import mysql from "mysql";
import util from "util";


export const conn = mysql.createPool(
    {
        connectionLimit: 10,
        host: "sql6.freemysqlhosting.net",
        user: "sql6688866",
        database: "sql6688866",
        password: "TQcyuS7TXs"
    }
);

conn.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err.message);
      return;
    }
  
    console.log('Connected to database!');
  
    connection.query('SELECT 1 + 1 AS solution', (err, results) => {
      connection.release(); // ปล่อยการเชื่อมต่อกับ Pool
  
      if (err) {
        console.error('Error executing query:', err.message);
        return;
      }
  
      console.log('Result:', results[0].solution); // ผลลัพธ์ที่ได้จากการส่งคำสั่ง SQL
    });
  });
  

export const queryAsync = util.promisify(conn.query).bind(conn);