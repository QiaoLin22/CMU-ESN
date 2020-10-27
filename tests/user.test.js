// const DAO = require('../services/dao');
const DBInMemory = require('../services/dbInMemory');
// console.log(DBInMemory);

const {
  User,
  createNewUser,
  retrieveUsers,
  updateStatusIcon,
  getStatusByUsername,
  findUserByUsername,
} = require('../models/user');

// const dao = new DAO(DBInMemory);

beforeAll(DBInMemory.connect);
afterAll(DBInMemory.close);

describe('use case join community', () => {
  it('create new user successfully', async () => {
    await createNewUser('John', '001', '1110');

    const actual = await User.findOne(
      { username: 'John' },
      { _id: 0, __v: 0, timestamp: 0 }
    );

    const expected = [
      {
        username: 'John',
        hash: '001',
        salt: '1110',
        online: false,
        statusArray: [
          {
            status: 'Undefined',
          },
        ],
      },
    ];
    expect(actual.username).toEqual(expected[0].username);
    expect(actual.hash).toEqual(expected[0].hash);
    expect(actual.salt).toEqual(expected[0].salt);
    expect(actual.online).toEqual(expected[0].online);
    expect(actual.statusArray[0].status).toEqual(
      expected[0].statusArray[0].status
    );
  });

  it('Find user by username successfully', async () => {
    const actual = await findUserByUsername('John');
    console.log(actual);
    const expected = [
      {
        username: 'John',
        hash: '001',
        salt: '1110',
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
    await updateStatusIcon('John', 'OK');

    const expected = [
      {
        username: 'John',
        hash: '001',
        salt: '1110',
        online: false,
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
    const actual = await User.findOne(
      { username: 'John' },
      { _id: 0, __v: 0, timestamp: 0 }
    );

    expect(actual.username).toEqual(expected[0].username);
    expect(actual.hash).toEqual(expected[0].hash);
    expect(actual.salt).toEqual(expected[0].salt);
    expect(actual.online).toEqual(expected[0].online);
    expect(actual.status).toEqual(expected[0].status);
    expect(actual.statusArray[1].status).toEqual(
      expected[0].statusArray[1].status
    );
  });

  it('get status by username successfully', async () => {
    const actual = await getStatusByUsername('John');
    const expected = 'OK';
    expect(actual).toEqual(expected);
  });

  it('retrieve users successfully', async () => {
    const actual = await retrieveUsers();

    const expected = [
      {
        username: 'John',
        hash: '001',
        salt: '1110',
        online: false,
        statusArray: [
          {
            status: 'Undefined',
          },
        ],
      },
    ];
    expect(actual[0].username).toEqual(expected[0].username);
    expect(actual[0].online).toEqual(expected[0].online);
    expect(actual[0].statusArray[0].status).toEqual(
      expected[0].statusArray[0].status
    );
  });
});
