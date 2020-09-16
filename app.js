const express = require('express');
const passport = require('passport');
const routes = require('./routes');
const path = require('path')

require('dotenv').config();
require('./config/passport');

var app = express();
app.set('view engine','ejs')
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname,"public")))

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(passport.initialize());
app.use(routes);
app.listen(3000);
