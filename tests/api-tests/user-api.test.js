const request = require('supertest');
const http = require('http');
const socketIO = require('socket.io');

const app = require('../../app');
const { createToken } = require('../../lib/jwt');
const DBInMemory = require('../../services/db-in-memory');
const User = require('../../models/user');

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
      privilegeLevel: 'Administrator',
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
      accountStatus: true,
    },
    {
      username: 'Mike',
      hash: '002',
      salt: '111',
      privilegeLevel: 'Coordinator',
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
      accountStatus: true,
    },
    {
      username: 'Jack',
      hash: '003',
      salt: '011',
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
      accountStatus: false,
    },
  ]);
});
afterEach(DBInMemory.cleanup);

const token = createToken({ _id: '000', username: 'John' });

describe('GET /active', () => {
  test('It should respond with all active users', async () => {
    const response = await request(app)
      .get('/api/users/active')
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
      password: '6666',
    });

    // make sure we add it correctly
    expect(newUser.statusCode).toBe(201);

    // make sure we have 3 users now
    const response = await request(app)
      .get('/api/users/active')
      .set('Cookie', `jwt=${token}`);
    expect(response.body.length).toBe(3);
  });

  // test('It should responds 400 with existing username', async () => {
  //   const allUsers = await User.find({});
  //   console.log(allUsers);
  //   const res = await request(app).post('/api/users/').send({
  //     username: 'Mike',
  //     password: '6666',
  //   });

  //   expect(res.statusCode).toBe(400);
  // });
});

describe('POST /login', () => {
  test('It should responds with a user successfully login', async () => {
    await request(app).post('/api/users/').send({
      username: 'George',
      password: '6666',
    });

    const response = await request(app).post('/api/users/login').send({
      username: 'George',
      password: '6666',
    });

    // make sure we can login successfully
    expect(response.statusCode).toBe(200);
  });

  test('Should responds with 400 with incorrect password', async () => {
    const response = await request(app).post('/api/users/login').send({
      username: 'Mike',
      password: '12345',
    });

    // make sure we login failed
    expect(response.statusCode).toBe(400);
  });

  test('It should responds 403 when inactive user login', async () => {
    const response = await request(app).post('/api/users/login').send({
      username: 'Jack',
      password: '123456',
    });

    // make sure we login failed
    expect(response.statusCode).toBe(403);
  });
});

describe('PUT /logout', () => {
  test('It should respond with a user logout successfully', async () => {
    User.updateOnlineStatus('John', true);
    const response = await request(app)
      .put('/api/users/logout')
      .set('Cookie', `jwt=${token}`);

    // Make sure we can logout successfully
    expect(response.statusCode).toBe(200);
  });
});

describe('PUT /', () => {
  test('It should responds with a successfully update online status', async () => {
    const response = await request(app)
      .put('/api/users/')
      .set('Cookie', `jwt=${token}`)
      .send({
        username: 'John',
        status: 'offline',
      });

    // make sure we can change status successfully
    expect(response.statusCode).toBe(200);
  });
});

describe('GET /all', () => {
  test('It should respond with all users', async () => {
    const response = await request(app)
      .get('/api/users/all')
      .set('Cookie', `jwt=${token}`);
    const expected = [
      {
        username: 'Jack',
        accountStatus: false,
        statusArray: [
          {
            timestamp: '1',
            status: 'OK',
          },
        ],
      },
      {
        online: false,
        username: 'John',
        accountStatus: true,
        latestStatus: { timestamp: '2', status: 'OK' },
        numUnreadMessages: 0,
      },
      {
        online: false,
        username: 'Mike',
        accountStatus: true,
        latestStatus: { timestamp: '2', status: 'Help' },
        numUnreadMessages: 0,
      },
    ];
    // Make sure we retrieve three users correctly
    expect(response.body.length).toEqual(expected.length);
    expect(response.body[0].username).toEqual('Jack');
    expect(response.body[1].username).toEqual('John');
    expect(response.body[2].username).toEqual('Mike');
    expect(response.statusCode).toBe(200);
  });
});

describe('GET /profile/:username', () => {
  test("It should respond with an object of user's profile", async () => {
    const response = await request(app)
      .get('/api/users/profile/John')
      .set('Cookie', `jwt=${token}`);
    // Make sure we retrieve user's profile correctly
    expect(response.body.username).toEqual('John');
    expect(response.body.privilegeLevel).toEqual('Administrator');
    expect(response.body.accountStatus).toEqual(true);
    expect(response.statusCode).toBe(200);
  });
});

describe('PUT /:username/profile', () => {
  test('It should respond with update user profile successfully', async () => {
    const response = await request(app)
      .put('/api/users/Jack/profile')
      .set('Cookie', `jwt=${token}`)
      .send({
        newUsername: 'JackNew',
        accountStatus: 'active',
        privilegeLevel: 'Coordinator',
        password: '99999',
      });
    expect(response.statusCode).toBe(200);
    const compare = await request(app)
      .get('/api/search/users/JackNew')
      .set('Cookie', `jwt=${token}`);
    // Make sure we updated correctly
    expect(compare.body[0].username).toEqual('JackNew');
    expect(compare.body[0].privilegeLevel).toEqual('Coordinator');
    expect(compare.body[0].accountStatus).toEqual(true);
  });
});
