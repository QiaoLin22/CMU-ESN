const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const mongoServer = new MongoMemoryServer();
class DBInMemory {
  constructor() {
    this.connect();
  }

  async connect() {
    const mongoUri = await mongoServer.getUri();
    const mongooseOpts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    };

    await mongoose.connect(mongoUri, mongooseOpts, (err) => {
      if (err) console.error(err);
    });
  }

  async close() {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  }

  async cleanup() {
    await mongoose.connection.dropDatabase();
  }
}

module.exports = new DBInMemory();
