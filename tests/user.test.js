const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { User, createNewUser } = require('../models/user');
const {Message, createNewMessage,
   getHistoricalMessages, updateAllToRead,
  checkUnreadMessage} = require('../models/message');

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

describe('use case join community', () => {
  it('create new user successfully', async () => {
    await createNewUser('John', '001', '1110');


    const actual = await User.find(
      { username: 'John' },
      { _id: 0, __v: 0, timestamp: 0 }
    );

    console.log(actual);
    const expected = [
      {
        username: 'John',
        hash: '001',
        salt: '1110',
        online: false,
        status: 'Undefined',
      },
    ];
    expect(actual[0].username).toEqual(expected[0].username);
    expect(actual[0].hash).toEqual(expected[0].hash);
    expect(actual[0].salt).toEqual(expected[0].salt);
    expect(actual[0].online).toEqual(expected[0].online);
    expect(actual[0].status).toEqual(expected[0].status);
  });
});

describe('use case chat publicly', () => {
  it('create new message successfully', async () => {
    await createNewMessage('John', 'test', 'public');
    

    const actual = await Message.find(
      { username: 'John' },
      { _id: 0, __v: 0}
    );

    console.log(actual);
    const expected = [
      {
        read: false,
        username: 'John',
        message: 'test',
        roomId: 'public',
        status: 'Undefined'
      }
    ];
    expect(actual[0].username).toEqual(expected[0].username);
    expect(actual[0].read).toEqual(expected[0].read);
    expect(actual[0].message).toEqual(expected[0].message);
    expect(actual[0].public).toEqual(expected[0].public);
    expect(actual[0].status).toEqual(expected[0].status);
  });

  it('get historical message successfully', async () => {
    const actual = await getHistoricalMessages('public');

  
    console.log(actual);
    const expected = [
      {
        read: false,
        username: 'John',
        message: 'test',
        roomId: 'public',
        status: 'Undefined'
      }
    ];
    expect(actual[0].username).toEqual(expected[0].username);
    expect(actual[0].read).toEqual(expected[0].read);
    expect(actual[0].message).toEqual(expected[0].message);
    expect(actual[0].public).toEqual(expected[0].public);
    expect(actual[0].status).toEqual(expected[0].status);
  });

  it('update message to read successfully', async () => {
    await updateAllToRead('public');
    const actual = await Message.find(
      { read: 0, roomId:'public' }
    );

    console.log(actual);
    expect(actual.length).toEqual(0);
  });

  it('get unread message successfully', async () => {
    const otherUser = new User({
      username: 'Mike',
      hash : '00001',
      salt: '0101001',
      timestamp: '2020-10-21T05:08:23.867Z',
    });
    await otherUser.save();

    const messageSentbyMike = new Message({
      username: 'Mike',
      message : 'Unread',
      roomId : 'JohnMike',
      timestamp: '2020-10-21T05:08:23.867Z',
    });
    await messageSentbyMike.save();
    const actual = await checkUnreadMessage('John', 'Mike');
    console.log(actual);
  
    expect(actual.length).toEqual(1);
    
  });
});

