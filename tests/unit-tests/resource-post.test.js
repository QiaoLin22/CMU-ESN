const DBInMemory = require('../../services/db-in-memory');

const ResourcePost = require('../../models/resource-post');
const dbInMemory = require('../../services/db-in-memory');

beforeAll(DBInMemory.connect);
afterAll(DBInMemory.close);
beforeEach(async () => {});
afterEach(dbInMemory.cleanup);

describe('createResourcePost', () => {
  it('create new resource post successfully', async () => {
    await ResourcePost.createResourcePost({
      sender: 'jack',
      zip: '11111',
      postType: 'request',
      resourceType: 'masks',
      message: 'Needing masks',
    });
    const result = await ResourcePost.findOne(
      { sender: 'jack' },
      { _id: 0, __v: 0, timestamp: 0 }
    );
    const actual = result.toJSON();

    const expected = {
      sender: 'jack',
      zip: '11111',
      postType: 'request',
      resourceType: 'masks',
      message: 'Needing masks',
      comments: [],
    };
    expect(actual).toEqual(expected);
  });
});

describe('getAllResourcePosts, getResourcePostById, createResourcePostComment', () => {
  const resourcePostList = [
    {
      sender: 'jack',
      zip: '11111',
      postType: 'request',
      resourceType: 'masks',
      message: 'Needing masks',
    },
    {
      sender: 'tom',
      zip: '11111',
      postType: 'share',
      resourceType: 'medicine',
      message: 'More medicine here',
    },
  ];

  let ids;

  beforeEach(async () => {
    const posts = await ResourcePost.insertMany(resourcePostList);
    ids = posts.map((post) => post._id);
  });

  it('get all posts successfully', async () => {
    const result = await ResourcePost.getAllResourcePosts({ zip: '11111' });
    const actual = result;

    const expected = resourcePostList.length;
    expect(actual.length).toEqual(expected);
  });

  it('get post by id successfully', async () => {
    const result = await ResourcePost.getResourcePostById(ids[0]);
    expect(result.sender).toEqual('jack');
    expect(result.zip).toEqual('11111');
    expect(result.postType).toEqual('request');
    expect(result.resourceType).toEqual('masks');
    expect(result.message).toEqual('Needing masks');
  });

  it('create comment for post', async () => {
    await ResourcePost.createResourcePostComment(ids[1], {
      sender: 'sam',
      comment: 'hello',
    });

    const post = await ResourcePost.getResourcePostById(ids[1]);
    const { comments } = post;

    expect(comments[0].sender).toEqual('sam');
    expect(comments[0].comment).toEqual('hello');
  });
});
