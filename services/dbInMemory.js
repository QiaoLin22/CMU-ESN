const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

class DBInMemory {
  constructor() {
    this.mongoServer = new MongoMemoryServer();
  }

  async connect() {
    const mongoUri = await this.mongoServer.getUri();
    const mongooseOpts = {
      useNewUrlParser: true,
      autoReconnect: true,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 1000,
    };
    await mongoose.createConnection(mongoUri, mongooseOpts, (err) => {
      if (err) console.error(err);
    });
  }

  async close() {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await this.mongoServer.stop();
  }
}

exports.DBInMemory = DBInMemory;
