const mysql = require("mysql");

const db = mysql.createConnection({
    host: 'sql10.freemysqlhosting.net',
    user: 'sql10504531',
    password: 'pDUd9AdgW6',
    database: 'sql10504531'
});

db.connect ((error)=>{
    if (error){
        console.log(error);
    }else{
        console.log("MYSQL is running...");
    }
});

module.exports = db;

