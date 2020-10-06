const mongoose = require('mongoose');
require('dotenv').config();

const dbString = process.env.DB_STRING;

mongoose
  .connect(dbString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((e) => console.log(e));

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    validate: [
      (username) => username.length >= 3,
      'Username must be at least 3 characters long',
    ],
  },
  hash: String,
  salt: String,
  online:{
    type: Boolean,
    default: false
   }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
