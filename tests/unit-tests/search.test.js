// const DAO = require('../services/dao');
const DBInMemory = require('../../services/db-in-memory');
// const express = require("express");
// const app = express();

const User = require('../../models/user');

const {
  searchAnnouncement,
  Announcement,
} = require('../../models/announcement');

const { searchMessage, Message } = require('../../models/message');
// const {
//     router
// } = require('../routes/search');

// app.use('/api/search', router);

// const dao = new DAO(DBInMemory);

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
  await Announcement.insertMany([
    {
      sender: 'John',
      timestamp: '1',
      message: 'Hello',
    },
    {
      sender: 'John',
      timestamp: '1',
      message: 'World',
    },
  ]);
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
      message: 'World',
      roomId: 'JohnMike',
      status: 'Undefined',
    }
  );
});
afterEach(DBInMemory.cleanup);

describe('use case search information', () => {
  it('search username by keyword', async () => {
    const actual = await User.findUserByKeyword('John');

    const expected = [
      {
        username: 'John',
      },
    ];
    expect(actual.length).toEqual(expected.length);
    expect(actual[0].username).toEqual(expected[0].username);
  });

  it('search user by status', async () => {
    const actual = await User.findUserByStatus('OK');
    const expected = [
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
    ];
    expect(actual.length).toEqual(expected.length);
    expect(actual[0].username).toEqual(expected[0].username);
    expect(actual[0].statusArray[1].status).toEqual(
      expected[0].statusArray[1].status
    );
  });

  it('search announcement by keyword', async () => {
    const actual = await searchAnnouncement(['Hello'], 0);
    const expected = [
      {
        sender: 'John',
        timestamp: '1',
        message: 'Hello',
      },
    ];
    expect(actual.length).toEqual(expected.length);
    expect(actual[0].message).toEqual(expected[0].message);
  });

  it('search message by keyword', async () => {
    const actual = await searchMessage('JohnMike', ['Hello'], 0);

    const expected = [
      {
        sender: 'John',
        recipient: 'Mike',
        message: 'hello',
        roomId: 'JohnMike',
        status: 'OK',
      },
    ];
    expect(actual.length).toEqual(expected.length);
    expect(actual[0].message).toEqual(expected[0].message);
    expect(actual[0].roomId).toEqual(expected[0].roomId);
  });

  it('retrieve user status', async () => {
    const actual = await User.retrieveUserStatus('John');

    const expected = [
      {
        username: 'John',
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
    ];
    expect(actual.length).toEqual(expected.length);
    expect(actual[0].username).toEqual(expected[0].username);
    expect(actual[0].statusArray.length).toEqual(
      expected[0].statusArray.length
    );
  });
});
