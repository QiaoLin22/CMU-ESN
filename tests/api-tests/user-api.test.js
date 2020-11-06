const request = require('supertest');
const http = require('http');
const socketIO = require('socket.io');

const app = require('../../app');
const { createToken } = require('../../lib/jwt');
const DBInMemory = require('../../services/db-in-memory');
const { User, updateOnlineStatus } = require('../../models/user');

const server = http.createServer(app);
const io = socketIO.listen(server);
app.set('io', io);

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
});
afterEach(DBInMemory.cleanup);

describe('GET /', () => {
  test('It should respond with all users', async () => {
    const token = createToken({ _id: '000', username: 'John' });

    const response = await request(app)
      .get('/api/users/')
      .set('Cookie', `jwt=${token}`);
    const expected = [
      {
        online: false,
        username: 'John',
        latestStatus: { timestamp: '2', status: 'OK' },
        numUnreadMessages: 0,
      },
      {
        online: false,
        username: 'Mike',
        latestStatus: { timestamp: '2', status: 'Help' },
        numUnreadMessages: 0,
      },
    ];
    // Make sure we retrieve two users correctly
    expect(response.body.length).toEqual(expected.length);
    expect(response.body[0].username).toEqual('John');
    expect(response.body[1].username).toEqual('Mike');
    expect(response.statusCode).toBe(200);
  });
});

describe('POST /', () => {
  test('It should responds with the newly created user', async () => {
    const newUser = await request(app).post('/api/users/').send({
      username: 'George',
      password: '666',
    });

    // make sure we add it correctly
    expect(newUser.statusCode).toBe(201);

    // make sure we have 3 users now
    const token = createToken({ _id: '000', username: 'John' });
    const response = await request(app)
      .get('/api/users/')
      .set('Cookie', `jwt=${token}`);
    expect(response.body.length).toBe(3);
  });
});

describe('POST /login', () => {
  test('It should responds with a user successfully login', async () => {
    const response = await request(app).post('/api/users/login').send({
      username: 'George',
      password: '666',
    });

    // make sure we can login successfully
    expect(response.statusCode).toBe(200);
  });
});

describe('PUT /logout', () => {
  test('It should respond with a user logout successfully', async () => {
    const token = createToken({ _id: '111', username: 'John' });
    updateOnlineStatus('John', true);
    const response = await request(app)
      .put('/api/users/logout')
      .set('Cookie', `jwt=${token}`);

    // Make sure we can logout successfully
    expect(response.statusCode).toBe(200);
  });
});

describe('PUT /', () => {
  test('It should responds with a successfully update online status', async () => {
    const response = await request(app).put('/api/users/').send({
      username: 'John',
      status: 'offline',
    });

    // make sure we can change status successfully
    expect(response.statusCode).toBe(200);
  });
});
