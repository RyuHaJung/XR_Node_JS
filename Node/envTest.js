require('dotenv').config();

const dbHost = process.env.DB_HOST;
const dbPort = Process.env.DB_PORT;
const dbUser = Process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

console.log(dbHost);
console.log(dbPort);
console.log(dbUser);
console.log(dbPassword);
console.log(dbName);