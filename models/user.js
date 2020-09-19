const mongoose = require("mongoose");
require("dotenv").config();
const db_string = process.env.DB_STRING;

mongoose
  .connect(db_string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((e) => console.error);

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    validate: [
      (username) => username.length >= 3,
      "Username must be at least 3 characters long",
    ],
  },
  hash: String,
  salt: String,
});

User = mongoose.model("User", UserSchema);
module.exports = User;
