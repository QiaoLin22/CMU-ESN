const DBInMemory = require('../../services/db-in-memory');

const {
    User,
    updateUserLocation,
    retrieveUserLocations,
    retrieveUserLocation,
    deleteUserLocations
  } = require('../../models/user');

beforeAll(DBInMemory.connect);
afterAll(DBInMemory.close);
beforeEach(async () => {
    await User.insertMany([
        {
          username: 'John',
          hash: '001',
          salt: '110',
          statusArray: [
            {
              timestamp: '1',
              status: 'Undefined',
            },
            {
              timestamp: '2',
              status: 'OK',
            },
          ],
          location: {
            longitude: 1,
            latitude: 2,
          }
        },
        {
          username: 'Jack',
          hash: '002',
          salt: '111',
          statusArray: [
            {
              timestamp: '1',
              status: 'Undefined',
            },
            {
              timestamp: '2',
              status: 'OK',
            },
          ],
        },
      ]);
});
afterEach(DBInMemory.cleanup);

describe('use case update location', () => {
  it('should update location successfully', async () => {
    await updateUserLocation('Jack',37.410600, -122.059732);
    const result = await User.findOne(
        { username: 'Jack' },
        { _id: 0, location: 1 }
      );
    const actual = result.toJSON();
    const expected = {
      longitude: 37.410600,
      latitude: -122.059732,
    };
    expect(actual.location).toEqual(expected);
  });

  it('should retrieve user locations successfully', async () => {
    await updateUserLocation('Jack',37.410600, -122.059732);
    const actual = await retrieveUserLocations();
    const expected = [
        {
            username: 'John',
            location: { longitude: 1, latitude: 2 },
            status: { timestamp: '2', status: 'OK' }
        },
        {
            username: 'Jack',
            location: { longitude: 37.4106, latitude: -122.059732 },
            status: {  timestamp: '2', status: 'OK' }
        }
    ]
    expect(actual[0].location).toEqual(expected[0].location);
    expect(actual[1].location).toEqual(expected[1].location);
    expect(actual[0].username).toEqual(expected[0].username);
    expect(actual[1].username).toEqual(expected[1].username);
    expect(actual[0].status.status).toEqual(expected[0].status.status);
    expect(actual[1].status.status).toEqual(expected[1].status.status);
  });

  it('should get one user location successfully', async () => {
    const actual = await retrieveUserLocation('John');
    const expected ={
      location: { longitude: 1, latitude: 2 },
    }
    expect(actual.location.longitude).toEqual(expected.location.longitude);
    expect(actual.location.latitude).toEqual(expected.location.latitude);
  });

  it('should delete location successfully', async () => {
    await deleteUserLocations('John');
    const result = await User.findOne(
        { username: 'John' },
        { _id: 0, location: 1 }
      );
    const actual = result.toJSON();
    const expected = undefined;
    expect(actual.location).toEqual(expected);
  });
});