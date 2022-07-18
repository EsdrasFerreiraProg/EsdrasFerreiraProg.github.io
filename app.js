
const posts = require("./posts/posts.js")
const express = require("express");
var bodyParser = require("body-parser");
const mysqlconnect = require("./mysqlconnection");
var routes = require("./routes.js");

const cookieParser = require("cookie-parser");
const session = require("express-session");

const app = express();

app.use(cookieParser());

app.use(bodyParser.urlencoded({extended:false}));

app.use(session({
    name: "session",
    key:"userId",
    secret:"ghost",
    resave: false,
    saveUninitialized: false,
    cookie:{
        expires: 60*60*1000000,
    },
}));


app.use(express.json());

app.use(routes);

app.use(posts);



app.listen(5000, ()=>{
    console.log("Server running on port 5000");
}); 