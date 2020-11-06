// const DAO = require('../services/dao');
const DBInMemory = require('../services/db-in-memory');
// console.log(DBInMemory);

const {
    Announcement,
    createNewAnnouncement,
    getAllAnnouncements,
    searchAnnoucement,
} = require('../models/announcement');
const dbInMemory = require('../services/db-in-memory');

// const dao = new DAO(DBInMemory);

beforeAll(DBInMemory.connect);
afterAll(done => {
  DBInMemory.close();
  done();
});
beforeEach(async () => {
  await Announcement.create({
    sender: 'John',
    message: 'Hi',
  });
});
afterEach(dbInMemory.cleanup);

describe('use case post announcement', () => {
  it('create new announcement successfully', async () => {
    await createNewAnnouncement('Jack', 'Hello');
    const result = await Announcement.findOne(
        { sender: 'Jack' },
        { _id: 0, __v: 0, timestamp: 0 }
    );
    const actual = result.toJSON();

    const expected = {
      sender: 'Jack',
      message: 'Hello',
    };
    expect(actual).toEqual(expected);
  });

  
});
