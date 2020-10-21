const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { User, createNewUser } = require('../models/user');

let mongoServer;

beforeAll(async () => {
  mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getUri();
  console.log(mongoUri);

  const mongooseOpts = {
    useNewUrlParser: true,
    autoReconnect: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000,
  };
  await mongoose.connect(mongoUri, mongooseOpts, (err) => {
    if (err) console.error(err);
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('...', () => {
  it('create new user successfully', async () => {
    await createNewUser('john', '001', '1110');

    const actual = await User.find(
      { username: 'john' },
      { _id: 0, __v: 0, timestamp: 0 }
    );

    console.log(actual);
    const expected = [
      {
        username: 'john',
        hash: '001',
        salt: '1110',
        online: false,
        status: 'Undefined',
      },
    ];
    expect(actual).toEqual(expected);
  });
});


    const actual = await User.find(
      { username: 'john' },
      { _id: 0, __v: 0, timestamp: 0 }
    );

    console.log(actual);
    const expected = [
      {
        username: 'john',
        hash: '001',
        salt: '1110',
        online: false,
        status: 'Undefined',
      },
    ];
    expect(actual).toEqual(expected);
