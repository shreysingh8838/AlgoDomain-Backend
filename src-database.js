const mysql = require("mysql2");

const connection = mysql.createConnection({
    host : '127.0.0.1',
    user : 'root',
    password : 'Shrey@2000',
    database : 'AlgoDomain'
});

connection.connect(function(err) {
    if(err) console.log(err);
});
module.exports = connection;
