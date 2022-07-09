
const posts = require("./posts/posts.js")
const express = require("express");
var bodyParser = require("body-parser");
const mysqlconnect = require("./mysqlconnection");
var routes = require("./routes.js");

const app = express();

app.use(express.urlencoded({extended: false}));

app.use(express.json());

app.use(routes);

app.use(posts);


app.listen(80, ()=>{
    console.log("Server running on port 5000");
}); 