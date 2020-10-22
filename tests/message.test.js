// const DAO = require('../services/dao');
const DBInMemory = require('../services/dbInMemory');

const { User } = require('../models/user');
const {
  Message,
  createNewMessage,
  getHistoricalMessages,
  updateAllToRead,
  checkUnreadMessage,
} = require('../models/message');

// const dao = new DAO(DBInMemory);

beforeAll(DBInMemory.connect);

afterAll(DBInMemory.close);

describe('use case chat publicly', () => {
  it('create new message successfully', async () => {
    // create a new user
    await new User({
      username: 'John',
      hash: '001',
      salt: '110',
      timestamp: '123',
    }).save();

    await createNewMessage('John', 'test', 'public');

    const actual = await Message.find({ username: 'John' });

    console.log(actual);
    const expected = [
      {
        read: false,
        username: 'John',
        message: 'test',
        roomId: 'public',
        status: 'Undefined',
      },
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
        status: 'Undefined',
      },
    ];
    expect(actual[0].username).toEqual(expected[0].username);
    expect(actual[0].read).toEqual(expected[0].read);
    expect(actual[0].message).toEqual(expected[0].message);
    expect(actual[0].public).toEqual(expected[0].public);
    expect(actual[0].status).toEqual(expected[0].status);
  });

  it('update message to read successfully', async () => {
    await updateAllToRead('public');
    const actual = await Message.find({ read: 0, roomId: 'public' });

    console.log(actual);
    expect(actual.length).toEqual(0);
  });

  it('get unread message successfully', async () => {
    const otherUser = new User({
      username: 'Mike',
      hash: '00001',
      salt: '0101001',
      timestamp: '2020-10-21T05:08:23.867Z',
    });
    await otherUser.save();

    const messageSentByMike = new Message({
      username: 'Mike',
      message: 'Unread',
      roomId: 'JohnMike',
      timestamp: '2020-10-21T05:08:23.867Z',
    });
    await messageSentByMike.save();

    const actual = await checkUnreadMessage('John', 'Mike');
    console.log(actual);

    expect(actual.length).toEqual(1);
  });
});
