// Get the client
const mysql = require('mysql2');

// Create the connection to database
const conn = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'Book-shop',
  dateStrings: true
})

module.exports = conn;

