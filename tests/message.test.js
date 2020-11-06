// const DAO = require('../services/dao');
const DBInMemory = require('../services/db-in-memory');

const { User } = require('../models/user');
const {
  Message,
  createNewMessage,
  getHistoricalMessages,
  updateAllToRead,
} = require('../models/message');

// const dao = new DAO(DBInMemory)

beforeAll(DBInMemory.connect);
afterAll(DBInMemory.close);

beforeEach(async () => {
  // create new users
  await User.insertMany([
    {
      username: 'John',
      hash: '001',
      salt: '110',
      statusArray: [
        {
          timestamp: '1',
          status: 'Undefined',
        },
        {
          timestamp: '2',
          status: 'OK',
        },
      ],
    },
    {
      username: 'Mike',
      hash: '002',
      salt: '111',
    },
  ]);
});

afterEach(DBInMemory.cleanup);

describe('use case chat publicly', () => {
  it('create new message successfully', async () => {
    await createNewMessage('John', 'public', 'test', 'public');

    const result = await Message.findOne(
      { sender: 'John' },
      { _id: 0, __v: 0, timestamp: 0 }
    );
    const actual = result.toJSON();

    const expected = {
      read: false,
      sender: 'John',
      recipient: 'public',
      message: 'test',
      roomId: 'public',
      status: 'OK',
    };
    expect(actual).toEqual(expected);
  });

  it('get historical message successfully', async () => {
    await createNewMessage('John', 'public', 'test', 'public');

    const actual = await getHistoricalMessages('public');

    const expected = [
      {
        read: false,
        sender: 'John',
        recipient: 'public',
        message: 'test',
        roomId: 'public',
        status: 'OK',
      },
    ];
    expect(actual[0].sender).toEqual(expected[0].sender);
    expect(actual[0].recipient).toEqual(expected[0].recipient);
    expect(actual[0].read).toEqual(expected[0].read);
    expect(actual[0].message).toEqual(expected[0].message);
    expect(actual[0].roomId).toEqual(expected[0].roomId);
    expect(actual[0].status).toEqual(expected[0].status);
  });
});

describe('use case chat privately', () => {
  beforeEach(async () => {
    await Message.insertMany(
      {
        sender: 'John',
        recipient: 'Mike',
        message: 'hello',
        roomId: 'JohnMike',
        status: 'OK',
      },
      {
        sender: 'Mike',
        recipient: 'John',
        message: 'hi',
        roomId: 'JohnMike',
        status: 'Undefined',
      }
    );
  });

  it('update message to read successfully', async () => {
    await updateAllToRead('JohnMike');
    const actual = await Message.find({ read: false, roomId: 'JohnMike' });

    expect(actual.length).toEqual(0);
  });
});
