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
    privilegeLevel: 'Coordinator',
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

  it('retrieve active users successfully', async () => {
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

  it('retrieve all users successfully', async () => {
    await User.insertMany([
      {
        username: 'John',
        hash: '001',
        salt: '110',
        accountStatus: false,
        statusArray: [
          {
            timestamp: '1',
            status: 'OK',
          },
        ],
      },
    ]);
    const actual = await User.retrieveAllUsers();

    const expected = [
      {
        username: 'Jack',
        hash: '000',
        salt: '001',
        online: false,
        accountStatus: true,
        privilegeLevel: 'Coordinator',
      },
      {
        username: 'John',
        hash: '001',
        salt: '110',
        online: false,
        accountStatus: false,
        privilegeLevel: 'Citizen',
      },
    ];
    expect(actual.length).toEqual(expected.length);
  });

  it('get user profile successfully', async () => {
    const actual = await User.getUserProfile('Jack');

    const expected = {
      username: 'Jack',
      accountStatus: true,
      privilegeLevel: 'Coordinator',
    };
    expect(actual.username).toEqual(expected.username);
    expect(actual.accountStatus).toEqual(expected.accountStatus);
    expect(actual.privilegeLevel).toEqual(expected.privilegeLevel);
  });

  it('update user profile successfully', async () => {
    const newProfile = {
      username: 'JackNew',
      accountStatus: true,
      privilegeLevel: 'Citizen',
      hash: '021',
      salt: '411',
    };

    await User.updateUserProfile('Jack', newProfile);
    const actual = await User.findUserByUsername('JackNew');
    const expected = {
      online: false,
      accountStatus: true,
      privilegeLevel: 'Citizen',
      username: 'JackNew',
      hash: '021',
      salt: '411',
    };
    expect(actual.username).toEqual(expected.username);
    expect(actual.accountStatus).toEqual(expected.accountStatus);
    expect(actual.privilegeLevel).toEqual(expected.privilegeLevel);
    expect(actual.hash).toEqual(expected.hash);
    expect(actual.salt).toEqual(expected.salt);
  });

  it("compare user's profile successfully", async () => {
    const newProfile = {
      username: 'Jack',
      accountStatus: true,
      privilegeLevel: 'Citizen',
    };

    const actual = await User.compareUserProfile('Jack', newProfile);
    expect(actual).toEqual(true);
  });

  describe('validate username and password', () => {
    it('should throw error when username is not provided', () => {
      expect(() => {
        User.validateUsername();
      }).toThrow('Username needed');
    });

    it('should throw error when username is less than 3 chars', () => {
      expect(() => {
        User.validateUsername('hi');
      }).toThrow('Username should be at least 3 characters long');
    });

    it('should throw error when password is not provided', () => {
      expect(() => {
        User.validatePassword(undefined);
      }).toThrow('Password needed');
    });

    it('should throw error when password is less than 4 chars', () => {
      expect(() => {
        User.validatePassword('hel');
      }).toThrow('Password should be at least 4 characters long');
    });
  });

  describe('get and update zip', () => {
    it('should get undefined zip code successfully', async () => {
      const res = await User.getZip('Jack');
      expect(res.zip).toEqual(undefined);
    });

    it('should update zip code successfully', async () => {
      await User.updateZip('Jack', '12345');

      const res = await User.findOne({ username: 'Jack' }, { zip: 1 });

      expect(res.zip).toEqual('12345');
    });
  });
});
