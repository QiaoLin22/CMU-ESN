const request = require('supertest');
const app = require('../../app');
const { createToken } = require('../../lib/jwt');
const DBInMemory = require('../../services/db-in-memory');
const { User } = require('../../models/user');
const { Message } = require('../../models/message');
const { Announcement } = require('../../models/announcement');

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
      statusArray: [
        {
          timestamp: '1',
          status: 'Undefined',
        },
        {
          timestamp: '2',
          status: 'Help',
        },
      ],
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

  await Announcement.insertMany([
    {
      sender: 'John',
      timestamp: '1',
      message: 'Hello',
    },
    {
      sender: 'John',
      timestamp: '2',
      message: 'World',
    },
  ]);
});

afterEach(DBInMemory.cleanup);

describe("GET '/messages/:roomId/:keywords/:pagination'", () => {
  test('It should respond with an array of messages with keyword', async () => {
    const token = createToken({ _id: '000', username: 'John' });

    const response = await request(app)
      .get('/api/search/messages/JohnMike/hello/0')
      .set('Cookie', `jwt=${token}`);
    const expected = [
      {
        sender: 'John',
        recipient: 'Mike',
        message: 'hello',
        roomId: 'JohnMike',
        status: 'OK',
      },
    ];
    expect(response.body.length).toEqual(expected.length);
    expect(response.body[0].message).toEqual(expected[0].message);
    expect(response.body[0].roomId).toEqual(expected[0].roomId);
    expect(response.statusCode).toBe(200);
  });
});

describe("GET '/messages/:roomId'", () => {
  test("It should respond with an array of user's status", async () => {
    const token = createToken({ _id: '000', username: 'John' });

    const response = await request(app)
      .get('/api/search/messages/JohnMike')
      .set('Cookie', `jwt=${token}`);
    const expected = [
      {
        username: 'Mike',
        hash: '002',
        salt: '111',
        statusArray: [
          {
            timestamp: '1',
            status: 'Undefined',
          },
          {
            timestamp: '2',
            status: 'Help',
          },
        ],
      },
    ];
    expect(response.body.length).toEqual(expected.length);
    expect(response.body[0].username).toEqual(expected[0].username);
    expect(response.body[0].statusArray.length).toEqual(
      expected[0].statusArray.length
    );
    expect(response.statusCode).toBe(200);
  });
});

describe("GET '/users/:keywords'", () => {
  test('It should respond with an array of user with keyword', async () => {
    const token = createToken({ _id: '000', username: 'John' });

    const response = await request(app)
      .get('/api/search/users/John')
      .set('Cookie', `jwt=${token}`);
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
    expect(response.body.length).toEqual(expected.length);
    expect(response.body[0].username).toEqual(expected[0].username);
    expect(response.body[0].statusArray.length).toEqual(
      expected[0].statusArray.length
    );
    expect(response.statusCode).toBe(200);
  });

  test('It should respond with an array of user with status', async () => {
    const token = createToken({ _id: '000', username: 'John' });

    const response = await request(app)
      .get('/api/search/users/OK')
      .set('Cookie', `jwt=${token}`);
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
    expect(response.body.length).toEqual(expected.length);
    expect(response.body[0].username).toEqual(expected[0].username);
    expect(response.body[0].statusArray.length).toEqual(
      expected[0].statusArray.length
    );
    expect(response.statusCode).toBe(200);
  });
});

describe("GET '/announcements/:keywords/:pagination'", () => {
  test('It should respond with an array of announcement with keyword', async () => {
    const token = createToken({ _id: '000', username: 'John' });
    const response = await request(app)
      .get('/api/search/announcements/hello/0')
      .set('Cookie', `jwt=${token}`);

    const expected = [
      {
        sender: 'John',
        timestamp: '1',
        message: 'Hello',
      },
    ];
    expect(response.body.length).toEqual(expected.length);
    expect(response.body[0].message).toEqual(expected[0].message);
    expect(response.statusCode).toBe(200);
  });
});
