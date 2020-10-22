const mongoose = require('mongoose');

const dbString = process.env.DB_STRING;

class DBProduction {
  constructor() {
    this.connect();
  }

  connect() {
    mongoose
      .connect(dbString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      })
      .catch((e) => console.log(e));
  }
}

module.exports = new DBProduction();
