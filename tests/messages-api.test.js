const request = require('supertest');
const http = require('http');
const socketIO = require('socket.io');

const app = require('../app');
const { createToken } = require('../lib/jwt');
const DBInMemory = require('../services/db-in-memory');
const { User } = require('../models/user');
const { Message } = require('../models/message');

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

  await Message.insertMany([
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
    },
  ]);
});

afterEach(DBInMemory.cleanup);

const token = createToken({ _id: '000', username: 'John' });

describe('GET /messages/private/:roomId', () => {
  test('Not authorized', async () => {
    const response = await request(app).get('/api/messages/private/JohnMike');
    expect(response.statusCode).toBe(401);
  });

  test('Invalid roomId', async () => {
    const response = await request(app)
      .get('/api/messages/private/SamMike')
      .set('Cookie', `jwt=${token}`);
    expect(response.statusCode).toBe(400);
    expect(response.text).toBe('room id is not valid');
  });

  test('Successfully getting an array of private messages', async () => {
    const response = await request(app)
      .get('/api/messages/private/JohnMike')
      .set('Cookie', `jwt=${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(2);
  });
});

describe('POST /messages/private/:roomId', () => {
  test('Not authorized', async () => {
    const response = await request(app)
      .post('/api/messages/private/JohnMike')
      .send({});
    expect(response.statusCode).toBe(401);
  });

  test('Invalid roomId', async () => {
    const response = await request(app)
      .post('/api/messages/private/MikeJohn')
      .set('Cookie', `jwt=${token}`);
    expect(response.statusCode).toBe(400);
    expect(response.text).toBe('room id is not valid');
  });

  test('Missing sender', async () => {
    const response = await request(app)
      .post('/api/messages/private/JohnMike')
      .set('Cookie', `jwt=${token}`)
      .send({
        recipient: 'John',
        message: 'New message',
        roomId: 'JohnMike',
      });
    expect(response.statusCode).toBe(400);
  });

  test('Successfully post a new private message', async () => {
    const response = await request(app)
      .post('/api/messages/private/JohnMike')
      .set('Cookie', `jwt=${token}`)
      .send({
        sender: 'Mike',
        recipient: 'John',
        message: 'New message',
        roomId: 'JohnMike',
      });
    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('success');
  });
});
