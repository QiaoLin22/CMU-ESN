const { mongoose } = require('mongoose');

console.log(mongoose);

const dbString = process.env.DB_STRING;

class DBProduction {
  constructor() {
    mongoose
      .createConnection(dbString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .catch((e) => console.log(e));
  }

  static getMongoose() {
    if (!this.mongoose) {
      this.mongoose = mongoose;
    }
    console.log(this.mongoose);
    return this.mongoose;
  }
}

exports.DBProduction = DBProduction;
