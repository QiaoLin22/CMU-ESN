const request = require('supertest');
const http = require('http');
const socketIO = require('socket.io');

const app = require('../../app');
const DBInMemory = require('../../services/db-in-memory');
const { createToken } = require('../../lib/jwt');
const { Announcement } = require('../../models/announcement');
const User = require('../../models/user');

const server = http.createServer(app);
const io = socketIO.listen(server);
app.set('io', io);

beforeAll(DBInMemory.connect);
afterAll(DBInMemory.close);

beforeEach(async () => {
  await User.insertMany([
    {
      username: 'John',
      hash: '001',
      salt: '110',
      accountStatus: true,
      privilegeLevel: 'Coordinator',
    },
    {
      username: 'Admin',
      hash: '001',
      salt: '110',
      accountStatus: true,
      privilegeLevel: 'Administrator',
    },
    {
      username: 'Mike',
      hash: '002',
      salt: '111',
      accountStatus: false,
      privilegeLevel: 'Citizen',
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
      timestamp: '2',
      message: 'World',
    },
  ]);
});
afterEach(DBInMemory.cleanup);

const token = createToken({ _id: '000', username: 'John' });
const tokenAdmin = createToken({ _id: '000', username: 'Admin' });

describe('GET /announcements', () => {
  test('It should respond with an array of announcements', async () => {
    const response = await request(app)
      .get('/api/announcements')
      .set('Cookie', `jwt=${token}`);

    expect(response.body.length).toBe(2);
    expect(response.body[0]).toHaveProperty('sender');
    expect(response.body[0]).toHaveProperty('message');
    expect(response.statusCode).toBe(200);
  });
});

describe('GET /privilege', () => {
  test('It should respond with the current user', async () => {
    const response = await request(app)
      .get('/api/announcements/privilege')
      .set('Cookie', `jwt=${token}`);

    expect(response.body).toHaveProperty('privilegeLevel');
    expect(response.statusCode).toBe(200);
  });
});

describe('POST /announcements', () => {
  test('It should respond with the newly created announcement for coordinator', async () => {
    const oneAnnouncement = {
      sender: 'John',
      message: 'Hi',
    };
    const newAnnouncement = await request(app)
      .post('/api/announcements')
      .set('Cookie', `jwt=${token}`)
      .send(oneAnnouncement);

    // make sure we add it correctly
    expect(newAnnouncement.statusCode).toBe(201);

    // make sure we have 3 announcements now
    const response = await request(app)
      .get('/api/announcements')
      .set('Cookie', `jwt=${token}`);
    expect(response.body.length).toBe(3);
  });

  test('It should respond with the newly created announcement for admin', async () => {
    const oneAnnouncement = {
      sender: 'Admin',
      message: 'Hi',
    };
    const newAnnouncement = await request(app)
      .post('/api/announcements')
      .set('Cookie', `jwt=${tokenAdmin}`)
      .send(oneAnnouncement);

    // make sure we add it correctly
    expect(newAnnouncement.statusCode).toBe(201);

    // make sure we have 3 announcements now
    const response = await request(app)
      .get('/api/announcements')
      .set('Cookie', `jwt=${token}`);
    expect(response.body.length).toBe(3);
  });

  test('It should respond with the 401 unauthorized', async () => {
    const oneAnnouncement = {
      sender: 'Mike',
      message: 'Hi',
    };

    await request(app)
      .post('/api/announcements')
      .set('Cookie', `jwt=${token}`)
      .send(oneAnnouncement);

    // make sure we have 3 announcements now
    const response = await request(app)
      .get('/api/announcements')
      .set('Cookie', `jwt=${token}`);
    expect(response.body.length).toBe(2);
  });
});
