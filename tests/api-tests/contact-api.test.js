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
  await User.create([
    {
      username: 'John',
      hash: '001',
      salt: '110',
      emergencyContact: [
        {
          name: 'Mike',
          phone: '+19081234567',
        },
      ],
    },
  ]);
});
afterEach(DBInMemory.cleanup);

describe('GET /', () => {
  test('It should respond with all emergency contacts', async () => {
    const token = createToken({ _id: '000', username: 'John' });

    const response = await request(app)
      .get('/api/contacts/')
      .set('Cookie', `jwt=${token}`);
    const expected = [
      {
        name: 'Mike',
        phone: '+19081234567',
      },
    ];

    expect(response.body.length).toEqual(expected.length);
    expect(response.body[0].name).toEqual('Mike');
    expect(response.body[0].phone).toEqual('+19081234567');
    expect(response.statusCode).toBe(200);
  });
});

describe('POST /', () => {
  test('It should responds with the newly created user', async () => {
    const token = createToken({ _id: '000', username: 'John' });
    const newContact = await request(app)
      .post('/api/contacts/')
      .set('Cookie', `jwt=${token}`)
      .send({
        username: 'John',
        name: 'Jack',
        phone: '+19087654321',
      });

    expect(newContact.statusCode).toBe(201);
    const response = await request(app)
      .get('/api/contacts/')
      .set('Cookie', `jwt=${token}`);
    expect(response.body.length).toBe(2);
  });
});
