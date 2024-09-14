const mysql = require('mysql2/promise');

// create the connection to database

let pool;

pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    waitForConnections: true,      // Wait for a connection if the pool is full
    connectionLimit: 10,          // Maximum number of connections in the pool
    queueLimit: 0,
});

if (!pool) {
    console.error("Failed to connect to MySQL database");
    throw new Error("Failed to connect to MySQL database");
} else {
    console.log("Connected to MySQL database");
}



// async function sleep(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }

// async function RetryConnection() { 
//     let currentRetry = 0;

//     while (true) {
//         try {
//             connectDB();
//             break;
//         } catch (err) {
//             console.error(err);
//             currentRetry++;
//             console.log(`Failed to connect retry attempt ${currentRetry}...`);
//             if (currentRetry >= 10) {
//                 console.log(`Reached maximum number of retries ${currentRetry}`);
//                 break;
//             }
//         }
//         await sleep(3000);
//     }
// }



// RetryConnection();




module.exports = { pool, mysql };