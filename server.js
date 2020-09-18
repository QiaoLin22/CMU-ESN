const jwt = require("jsonwebtoken");
require("dotenv").config();

const express = require("express");
const app = express();
app.use(express.json());

app.post("/login", (req, res) => {
  // TODO: Authenticate the user with username and pwd

  // Create web token
  const username = req.body.username;

  const accessToken = jwt.sign(
    { username: username },
    process.env.ACCESS_TOKEN_SECRET
  );

  res.json({ accessToken: accessToken });
});

// Middleware
function authenticateToken(req, res, next) {
    
}

app.listen(3000);
