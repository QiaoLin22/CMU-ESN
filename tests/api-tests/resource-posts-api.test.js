const request = require('supertest');
const http = require('http');
const socketIO = require('socket.io');

const app = require('../../app');
const DBInMemory = require('../../services/db-in-memory');
const { createToken } = require('../../lib/jwt');
const ResourcePost = require('../../models/resource-post');

const server = http.createServer(app);
const io = socketIO.listen(server);
app.set('io', io);

beforeAll(DBInMemory.connect);
afterAll(DBInMemory.close);

beforeEach(async () => {});
afterEach(DBInMemory.cleanup);

const token = createToken({ _id: '000', username: 'john' });

const resourcePost = {
  sender: 'john',
  zip: '11111',
  postType: 'request',
  resourceType: 'masks',
  message: 'Needing masks',
};

describe('POST /resource-posts', () => {
  test('It should fail', async () => {
    const response = await request(app)
      .post('/api/resource-posts')
      .send(resourcePost);

    expect(response.statusCode).toBe(401);
  });

  test('It should respond with success', async () => {
    const response = await request(app)
      .post('/api/resource-posts')
      .set('Cookie', `jwt=${token}`)
      .send(resourcePost);

    expect(response.statusCode).toBe(201);
  });
});

describe('GET /resource-posts', () => {
  beforeEach(async () => {
    await ResourcePost.create(resourcePost);
  });

  test('It should fail', async () => {
    const response = await request(app).get('/api/resource-posts');
    expect(response.statusCode).toBe(401);
  });

  test('It should respond with list of posts', async () => {
    const res = await request(app)
      .get('/api/resource-posts')
      .set('Cookie', `jwt=${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body[0].message).toEqual(resourcePost.message);
    expect(res.body[0].postType).toEqual(resourcePost.postType);
    expect(res.body[0].resourceType).toEqual(resourcePost.resourceType);
    expect(res.body[0].sender).toEqual(resourcePost.sender);
    expect(res.body[0].zip).toEqual(resourcePost.zip);
  });
});

describe('GET /resource-posts/:postId', () => {
  let postId;

  beforeEach(async () => {
    const post = await ResourcePost.create(resourcePost);
    postId = post._id;
  });

  test('It should fail', async () => {
    const response = await request(app).get(`/api/resource-posts/${postId}`);
    expect(response.statusCode).toBe(401);
  });

  test('It should respond with the post correctly', async () => {
    const res = await request(app)
      .get(`/api/resource-posts/${postId}`)
      .set('Cookie', `jwt=${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.comments).toEqual([]);
    expect(res.body.message).toBe(resourcePost.message);
    expect(res.body.postType).toBe(resourcePost.postType);
    expect(res.body.resourceType).toBe(resourcePost.resourceType);
    expect(res.body.sender).toBe(resourcePost.sender);
    expect(res.body.zip).toBe(resourcePost.zip);
  });
});

describe('POST /resource-posts/:postId/comments', () => {
  let postId;

  const comment = {
    sender: 'jack',
    comment: 'A comment',
  };

  beforeEach(async () => {
    const post = await ResourcePost.create(resourcePost);
    postId = post._id;
  });

  test('It should fail', async () => {
    const response = await request(app)
      .post(`/api/resource-posts/${postId}/comments`)
      .send(comment);
    expect(response.statusCode).toBe(401);
  });

  test('It should create a new comment for the post correctly', async () => {
    const response = await request(app)
      .post(`/api/resource-posts/${postId}/comments`)
      .send(comment)
      .set('Cookie', `jwt=${token}`);

    const post = await ResourcePost.findById(postId);
    const { comments } = post;
    expect(response.statusCode).toBe(201);
    expect(comments.length).toBe(1);
  });
});
