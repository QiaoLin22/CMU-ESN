const request = require('supertest');
const http = require('http');
const socketIO = require('socket.io');

const app = require('../../app');
const { createToken } = require('../../lib/jwt');
const DBInMemory = require('../../services/db-in-memory');
const { User } = require('../../models/user');

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
      location: {
        longitude: 1,
        latitude: 1,
      },
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
      location: {
        longitude: 2,
        latitude: 2,
      },
    },
    {
      username: 'Jack',
      hash: '003',
      salt: '112',
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
  ]);
});
afterEach(DBInMemory.cleanup);

describe('GET /locations', () => {
  test('It should respond with all user locations', async () => {
    const token = createToken({ _id: '000', username: 'John' });

    const response = await request(app)
      .get('/api/users/locations')
      .set('Cookie', `jwt=${token}`);
    const expected = [
      {
        username: 'John',
        location: { longitude: 1, latitude: 1 },
        status: { timestamp: '2', status: 'OK' },
      },
      {
        username: 'Mike',
        location: { longitude: 2, latitude: 2 },
        status: { status: 'Help' },
      },
    ];
    // Make sure we retrieve two locations correctly
    expect(response.body.length).toEqual(expected.length);
    expect(response.body[0].location).toEqual(expected[0].location);
    expect(response.body[1].location).toEqual(expected[1].location);
    expect(response.statusCode).toBe(200);
  });
});

describe('GET /locations negative', () => {
  test('It should respond with 401 unauthorized', async () => {
    const response = await request(app).get('/api/users/locations');

    expect(response.statusCode).toBe(401);
  });
});

describe('GET /location', () => {
  test('It should respond with one user locations', async () => {
    const token = createToken({ _id: '000', username: 'John' });

    const response = await request(app)
      .get('/api/users/location')
      .set('Cookie', `jwt=${token}`);
    const expected = {
      username: 'John',
      location: { longitude: 1, latitude: 1 },
      status: { timestamp: '2', status: 'OK' },
    };

    // Make sure we retrieve that user location correctly
    expect(response.body.location).toEqual(expected.location);
    expect(response.statusCode).toBe(200);
  });
});

describe('GET /location negative', () => {
  test('It should respond with 401 unauthorized', async () => {
    const response = await request(app).get('/api/users/location');

    expect(response.statusCode).toBe(401);
  });
});

describe('POST /', () => {
  test('It should respond with new user location created', async () => {
    const response = await request(app).post('/api/users/location').send({
      username: 'Jack',
      longitude: 3,
      latitude: 3,
    });
    // Make sure the location is created successfully
    expect(response.statusCode).toBe(200);
  });
});

// describe('POST /', () => {
//   test('It should respond with 400 bad request', async () => {
//     const response = await request(app)
//       .post('/api/users/location')

//     expect(response.statusCode).toBe(400)
//   });
// });

describe('PUT /', () => {
  test('It should respond user location successfully update', async () => {
    const response = await request(app).put('/api/users/location').send({
      username: 'John',
    });
    // Make sure the location is deleted successfully
    expect(response.statusCode).toBe(200);
  });
});
