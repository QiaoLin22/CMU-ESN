const DBInMemory = require('../../services/db-in-memory');
const User = require('../../models/user');
const { validatePassword, genHashAndSalt } = require('../../lib/password');
const { isRoomIdValid } = require('../../lib/room-id');

describe('validate password', () => {
  it('wrong password', () => {
    const { salt, hash } = genHashAndSalt('password');
    const actual = validatePassword('hello', hash, salt);
    expect(actual).toBe(false);
  });

  it('successfully validate password', () => {
    const { salt, hash } = genHashAndSalt('password');
    const actual = validatePassword('password', hash, salt);
    expect(actual).toBe(true);
  });
});

describe('validate room id', () => {
  beforeAll(DBInMemory.connect);
  afterAll(DBInMemory.close);
  beforeEach(async () => {
    await User.insertMany([
      {
        username: 'john',
        hash: '000',
        salt: '001',
      },
      {
        username: 'mike',
        hash: '000',
        salt: '001',
      },
    ]);
  });
  afterEach(DBInMemory.cleanup);

  it('currUsername is not in roomId', async () => {
    const actual = await isRoomIdValid('johnmike', 'ellen');
    expect(actual).toBe(false);
  });

  it('two usernames are the same', async () => {
    const actual = await isRoomIdValid('johnjohn', 'john');
    expect(actual).toBe(false);
  });

  it('two usernames are not in order', async () => {
    const actual = await isRoomIdValid('mikejohn', 'john');
    expect(actual).toBe(false);
  });

  it('user1 are not in db', async () => {
    const actual = await isRoomIdValid('ellenjohn', 'john');
    expect(actual).toBe(false);
  });

  it('user2 are not in db', async () => {
    const actual = await isRoomIdValid('mikeellen', 'mike');
    expect(actual).toBe(false);
  });

  it('validate successfully when other username is in the beginning', async () => {
    const actual = await isRoomIdValid('johnmike', 'john');
    expect(actual).toBe(true);
  });

  it('validate successfully when other username is at the end', async () => {
    const actual = await isRoomIdValid('johnmike', 'mike');
    expect(actual).toBe(true);
  });
});
