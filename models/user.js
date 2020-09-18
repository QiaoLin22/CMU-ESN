const mongoose = require('mongoose');
require('dotenv').config();
const db = process.env.DB_STRING;

const connection = mongoose.createConnection(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const UserSchema = new mongoose.Schema({
    username: String,
    hash: String,
    salt: String
});

User = connection.model('User', UserSchema);
module.exports = connection;