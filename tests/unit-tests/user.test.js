// const DAO = require('../services/dao');
const DBInMemory = require('../../services/db-in-memory');
// console.log(DBInMemory);

const User = require('../../models/user');

// const dao = new DAO(DBInMemory);

beforeAll(DBInMemory.connect);
afterAll(DBInMemory.close);
beforeEach(async () => {
  await User.create({
    username: 'Jack',
    hash: '000',
    salt: '001',
  });
});
afterEach(DBInMemory.cleanup);

describe('use case join community', () => {
  it('create new user successfully', async () => {
    await User.createNewUser('John', '001', '1110');

    const result = await User.findOne(
      { username: 'John' },
      { _id: 0, __v: 0, timestamp: 0, statusArray: 0, emergencyContact: 0 }
    );
    const actual = result.toJSON();

    const expected = {
      username: 'John',
      accountStatus: true,
      hash: '001',
      salt: '1110',
      online: false,
      privilegeLevel: 'Citizen',
    };
    expect(actual).toEqual(expected);
  });

  it('Find user by username successfully', async () => {
    const actual = await User.findUserByUsername('Jack');

    const expected = [
      {
        username: 'Jack',
        hash: '000',
        salt: '001',
        online: false,
        statusArray: [
          {
            status: 'Undefined',
          },
        ],
      },
    ];
    expect(actual.username).toEqual(expected[0].username);
    expect(actual.online).toEqual(expected[0].online);
    expect(actual.statusArray[0].status).toEqual(
      expected[0].statusArray[0].status
    );
  });

  it('Update status successfully', async () => {
    await User.updateStatusIcon('Jack', 'OK');

    const expected = [
      {
        statusArray: [
          {
            status: 'Undefined',
          },
          {
            status: 'OK',
          },
        ],
      },
    ];
    const actual = await User.findOne({ username: 'Jack' }, { statusArray: 1 });

    expect(actual.statusArray[1].status).toEqual(
      expected[0].statusArray[1].status
    );
  });

  it('get status by username successfully', async () => {
    const actual = await User.getStatusByUsername('Jack');
    const expected = 'Undefined';
    expect(actual.status).toEqual(expected);
  });

  it('retrieve users successfully', async () => {
    const actual = await User.retrieveActiveUsers();

    const expected = [
      {
        username: 'Jack',
        hash: '000',
        salt: '001',
        online: false,
        latestStatus: {
          status: 'Undefined',
        },
      },
    ];
    expect(actual[0].username).toEqual(expected[0].username);
    expect(actual[0].online).toEqual(expected[0].online);
    expect(actual[0].latestStatus.status).toEqual(
      expected[0].latestStatus.status
    );
  });
});
