const request = require('supertest');
const app = require('../app');
const DBInMemory = require('../services/db-in-memory');
const { createToken } = require('../lib/jwt');
const { Announcement } = require('../models/announcement');

beforeAll(DBInMemory.connect);
afterAll(DBInMemory.close);

beforeEach(async () => {
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

describe('GET /announcements', () => {
  test('It should respond with an array of announcements', async () => {
    const token = createToken({ _id: '000', username: 'John' });

    const response = await request(app)
      .get('/api/announcements')
      .set('Cookie', `jwt=${token}`);

    expect(response.body.length).toBe(2);
    expect(response.body[0]).toHaveProperty('sender');
    expect(response.body[0]).toHaveProperty('message');
    expect(response.statusCode).toBe(200);
  });
});

describe('POST /announcements', () => {
  test('It should respond with the newly created announcement', async () => {
    const token = createToken({ _id: '000', username: 'John' });

    const newAnnouncement = await request(app)
      .post('/api/announcements')
      .set('Cookie', `jwt=${token}`)
      .send({
        sender: 'John',
        message: 'Hi',
      });

    console.log(newAnnouncement.body);
    // make sure we add it correctly
    expect(newAnnouncement.body).toHaveProperty('sender');
    expect(newAnnouncement.body).toHaveProperty('message');
    expect(newAnnouncement.body.sender).toBe('John');
    expect(newAnnouncement.body.message).toBe('Hi');
    expect(newAnnouncement.statusCode).toBe(201);

    // make sure we have 3 announcements now
    const response = await request(app).get('/api/announcements');
    expect(response.body.length).toBe(3);
  });
});
