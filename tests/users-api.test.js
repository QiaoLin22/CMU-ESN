require('dotenv/config');

process.env.NODE_ENV = 'test';
const request = require('supertest');

const DBInMemory = require('../services/db-in-memory');

const { User } = require('../models/user');
const app = require('../app');

beforeAll(DBInMemory.connect);
afterAll(DBInMemory.close);

describe('GET /users', () => {
  beforeEach(async () => {
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
      },
    ]);
  });

  test('It should respond with an array of students', async () => {
    const response = await request(app).get('/users');
    expect(response.body).toEqual(['Elie', 'Matt', 'Joel', 'Michael']);
    expect(response.statusCode).toBe(200);
  });
});
