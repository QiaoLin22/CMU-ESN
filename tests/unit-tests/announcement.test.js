const DBInMemory = require('../../services/db-in-memory');

const {
  Announcement,
  createNewAnnouncement,
  getAllAnnouncements,
} = require('../../models/announcement');
const User = require('../../models/user');
const dbInMemory = require('../../services/db-in-memory');

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
      username: 'Jack',
      hash: '002',
      salt: '111',
      accountStatus: true,
      privilegeLevel: 'Coordinator',
    },
  ]);

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

  it('retrieve all announcements successfully', async () => {
    const actual = await getAllAnnouncements();
    const expected = [
      {
        sender: 'John',
        message: 'Hi',
      },
    ];
    expect(actual[0].sender).toEqual(expected[0].sender);
    expect(actual[0].message).toEqual(expected[0].message);
  });
});
