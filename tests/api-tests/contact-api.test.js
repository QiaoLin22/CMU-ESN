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
  test('Not authorized get', async () => {
    const response = await request(app).get('/api/contacts/');
    expect(response.statusCode).toBe(401);
  });

  test('Respond with all emergency contacts', async () => {
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
  test('Not authorized post', async () => {
    const response = await request(app).post('/api/contacts/').send({});
    expect(response.statusCode).toBe(401);
  });

  test('It should responds with the newly created emergency contact', async () => {
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

describe('PUT /', () => {
  test('Not authorized put', async () => {
    const response = await request(app).put('/api/contacts/').send({});
    expect(response.statusCode).toBe(401);
  });

  test('Remove a contact', async () => {
    const token = createToken({ _id: '111', username: 'John' });
    const result = await request(app)
      .put('/api/contacts/')
      .set('Cookie', `jwt=${token}`)
      .send({
        username: 'John',
        name: 'Mike',
      });
    expect(result.statusCode).toBe(200);
    const response = await request(app)
      .get('/api/contacts/')
      .set('Cookie', `jwt=${token}`);
    expect(response.body.length).toBe(0);
  });
});

describe('POST /sms', () => {
  test('Not authorized post to sms', async () => {
    const response = await request(app).post('/api/contacts/sms/');
    expect(response.statusCode).toBe(401);
  });

  test('Send SMS to all emergency contacts', async () => {
    const token = createToken({ _id: '000', username: 'John' });
    const response = await request(app)
      .post('/api/contacts/sms/')
      .set('Cookie', `jwt=${token}`);

    expect(response.statusCode).toBe(200);
  });
});
