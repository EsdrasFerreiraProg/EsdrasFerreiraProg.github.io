const mysql = require("mysql");

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'adotapet'
});

db.connect ((error)=>{
    if (error){
        console.log(error);
    }else{
        console.log("MYSQL is running...");
    }
});

module.exports = db;

