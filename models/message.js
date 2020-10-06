const mongoose = require('mongoose');
require('dotenv').config();

const dbString = process.env.DB_STRING;

mongoose
  .connect(dbString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((e) => console.log(e));

const MessageSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
  },
  timestamp: String,
  message: {
    type: String,
    required: [true, 'Message is required'],
  },
});

const Message = mongoose.model('Message', MessageSchema);
module.exports = Message;
