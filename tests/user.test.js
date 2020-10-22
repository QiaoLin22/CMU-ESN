// const DAO = require('../services/dao');
const DBInMemory = require('../services/dbInMemory');
// console.log(DBInMemory);

const { User, createNewUser } = require('../models/user');

// const dao = new DAO(DBInMemory);

beforeAll(DBInMemory.connect);
afterAll(DBInMemory.close);

describe('use case join community', () => {
  it('create new user successfully', async () => {
    await createNewUser('John', '001', '1110');

    const actual = await User.find(
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
    expect(actual[0].username).toEqual(expected[0].username);
    expect(actual[0].hash).toEqual(expected[0].hash);
    expect(actual[0].salt).toEqual(expected[0].salt);
    expect(actual[0].online).toEqual(expected[0].online);
    expect(actual[0].statusArray[0].status).toEqual(
      expected[0].statusArray[0].status
    );
  });
});
