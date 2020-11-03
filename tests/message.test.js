// const DAO = require('../services/dao');
const DBInMemory = require('../services/db-in-memory');

const { User } = require('../models/user');
const {
  Message,
  createNewMessage,
  getHistoricalMessages,
  updateAllToRead,
  numUnreadMessages,
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
      hash: '00001',
      salt: '0101001',
    },
  ]);
});

afterEach(DBInMemory.cleanup);

describe('use case chat publicly', () => {
  it('create new message successfully', async () => {
    await createNewMessage('John', undefined, 'test', 'public');

    const actual = await Message.find({ username: 'John' });

    const expected = [
      {
        read: false,
        sender: 'John',
        message: 'test',
        roomId: 'public',
        status: 'Undefined',
      },
    ];
    expect(actual[0].sender).toEqual(expected[0].sender);
    expect(actual[0].read).toEqual(expected[0].read);
    expect(actual[0].message).toEqual(expected[0].message);
    expect(actual[0].roomId).toEqual(expected[0].roomId);
    expect(actual[0].status).toEqual(expected[0].status);
  });

  it('get historical message successfully', async () => {
    await createNewMessage('John', 'test', 'public');

    const actual = await getHistoricalMessages('public');

    const expected = [
      {
        read: false,
        sender: 'John',
        message: 'test',
        roomId: 'public',
        status: 'Undefined',
      },
    ];
    expect(actual[0].sender).toEqual(expected[0].sender);
    expect(actual[0].read).toEqual(expected[0].read);
    expect(actual[0].message).toEqual(expected[0].message);
    expect(actual[0].roomId).toEqual(expected[0].roomId);
    expect(actual[0].status).toEqual(expected[0].status);
  });
});

describe('use case chat privately', () => {
  beforeEach(async () => {
    await createNewMessage('John', 'test', 'public');
  });

  it('update message to read successfully', async () => {
    await updateAllToRead('public');
    const actual = await Message.find({ read: 0, roomId: 'public' });

    expect(actual.length).toEqual(0);
  });

  it('get unread message successfully', async () => {
    const messageSentByMike = new Message({
      username: 'Mike',
      message: 'Unread',
      roomId: 'JohnMike',
      timestamp: '2020-10-21T05:08:23.867Z',
    });
    await messageSentByMike.save();

    const actual = await numUnreadMessages('John');
    console.log(actual);

    expect(actual[0].numUnreadMessages).toEqual(1);
  });
});
