const DBInMemory = require('../../services/db-in-memory');

const {
  News,
  createNewNews,
  getAllNews,
  getNewsByNewsId,
} = require('../../models/news');
const dbInMemory = require('../../services/db-in-memory');

beforeAll(DBInMemory.connect);
afterAll(DBInMemory.close);
beforeEach(async () => {
  await News.create({
    sender: 'John',
    message: 'Hi',
    cityname:'San Jose'
  });
});
afterEach(dbInMemory.cleanup);

describe('use case share news by multimedia', () => {
  it('create new news successfully', async () => {
    await createNewNews('Jack', 'Hello', 'New York');
    const result = await News.findOne(
      { sender: 'Jack' },
      { _id: 0, __v: 0, timestamp: 0 }
    );
    const actual = result.toJSON();
    const expected = {
      sender: 'Jack',
      message: 'Hello',
      cityname:'New York',
    };
    expect(actual).toEqual(expected);
  });

  it('retrieve all news successfully', async () => {
    const actual = await getAllNews();

    const expected = [
      {
        sender: 'John',
        message: 'Hi',
        cityname:'San Jose',
      },
    ];
    expect(actual.length).toEqual(expected.length);
    expect(actual[0].sender).toEqual(expected[0].sender);
    expect(actual[0].message).toEqual(expected[0].message);
    expect(actual[0].cityname).toEqual(expected[0].cityname);
  });

  it('get news by news ID successfully', async () => {
    const findResult = await News.find({cityname: 'San Jose'});
    const newsId = findResult[0]._id
    const actual = await getNewsByNewsId(newsId);
    const expected = [
        {
          sender: 'John',
          message: 'Hi',
          cityname:'San Jose',
        },
    ];
    expect(actual.length).toEqual(expected.length);
    expect(actual[0].sender).toEqual(expected[0].sender);
    expect(actual[0].message).toEqual(expected[0].message);
    expect(actual[0].cityname).toEqual(expected[0].cityname);
  });

});
