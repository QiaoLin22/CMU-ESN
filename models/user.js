const mongoose = require("mongoose");
require("dotenv").config();
const db_string = process.env.DB_STRING;

mongoose.connect(db_string, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const UserSchema = new mongoose.Schema({
  username: String,
  hash: String,
  salt: String,
});

User = mongoose.model("User", UserSchema);
module.exports = User;
