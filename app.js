const express = require("express");
const passport = require("passport");
const flash = require("express-flash");
const path = require("path");
const routes = require("./routes");

require("dotenv").config();
require("./config/passport");

var app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(flash());

app.use(routes);

app.listen(3000);
