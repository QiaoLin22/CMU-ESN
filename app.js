const express = require("express");
const path = require("path");
const routes = require("./routes");
const cookieParser = require("cookie-parser");

require("dotenv").config();

var app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(routes);

app.listen(3000);
