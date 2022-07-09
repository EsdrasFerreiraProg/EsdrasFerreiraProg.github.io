
const express = require("express");
var routes = require("./routes.js");
const app = express();

app.use(routes);

app.listen(80, ()=>{
    console.log("Server running on port 5000");
});