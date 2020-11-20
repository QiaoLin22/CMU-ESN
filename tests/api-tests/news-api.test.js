const request = require('supertest');
const http = require('http');
const socketIO = require('socket.io');

const app = require('../../app');
const DBInMemory = require('../../services/db-in-memory');
const { createToken } = require('../../lib/jwt');
const { News } = require('../../models/news');

const server = http.createServer(app);
const io = socketIO.listen(server);
app.set('io', io);

beforeAll(DBInMemory.connect);
afterAll(DBInMemory.close);

beforeEach(async () => {
  await News.insertMany([
    {
      sender: 'John',
      timestamp: '1',
      message: 'Hello',
      cityname: 'San Jose',
    },
    {
      sender: 'John',
      timestamp: '2',
      message: 'World',
      cityname: 'New York',
    },
  ]);
});
afterEach(DBInMemory.cleanup);

const token = createToken({ _id: '000', username: 'John' });

describe('GET /news/:cityname', () => {
  test('It should respond with an array of news', async () => {
    const response = await request(app)
      .get('/api/news/San Jose')
      .set('Cookie', `jwt=${token}`);

    expect(response.body.length).toBe(1);
    expect(response.body[0]).toHaveProperty('sender');
    expect(response.body[0]).toHaveProperty('message');
    expect(response.statusCode).toBe(200);
  });
});

describe('POST /news', () => {
  test('It should respond with the newly created news', async () => {
    const newsFormData = {
      sender: 'John',
      message: 'Hi',
      cityname: 'Los Angeles',
    };
    const newNews = await request(app)
      .post('/api/news')
      .set('Cookie', `jwt=${token}`)
      .send(newsFormData);

    // make sure we add it correctly
    expect(newNews.statusCode).toBe(201);

    // make sure we have 1 news in Los Angeles now
    const response = await request(app)
      .get('/api/news/Los Angeles')
      .set('Cookie', `jwt=${token}`);
    expect(response.body.length).toBe(1);
  });
});

/*
describe('POST /news/forward', () => {
  test('It should respond with forward successfully message ', async () => {
    const newsFormData = {
        sender: 'John',
        timestamp: '1',
        message: 'Hello',
        cityname: 'San Jose',
    };
    const newNews = await request(app)
      .post('/api/news')
      .set('Cookie', `jwt=${token}`)
      .send(newsFormData);

    // make sure we add it correctly
    expect(newNews.statusCode).toBe(201);

    // make sure we have 1 news in Los Angeles now
    const response = await request(app)
      .get('/api/news/Los Angeles')
      .set('Cookie', `jwt=${token}`);
    expect(response.body.length).toBe(1);
  });
});*/
