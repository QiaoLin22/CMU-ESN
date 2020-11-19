const DBInMemory = require('../../services/db-in-memory');

const {
  User,
  createNewEmergencyContact,
  removeEmergencyContact,
  getEmergencyContacts,
} = require('../../models/user');

beforeAll(DBInMemory.connect);
afterAll(DBInMemory.close);
beforeEach(async () => {
  await User.create({
    username: 'Jack',
    hash: '000',
    salt: '001',
    emergencyContact: [
      {
        name: 'Mike',
        phone: '+19087654321',
      },
    ],
  });
});
afterEach(DBInMemory.cleanup);

describe('I4-MimiShih emergency contact', () => {
  it('Create new emergency contact successfully', async () => {
    await createNewEmergencyContact('Jack', 'John', '+19081234567');

    const result = await User.findOne(
      { username: 'Jack' },
      { _id: 0, __v: 0, timestamp: 0, statusArray: 0, online: 0 }
    );
    const actual = result.toJSON();

    const expected = {
      username: 'Jack',
      emergencyContact: [
        {
          name: 'Mike',
          phone: '+19087654321',
        },
        {
          name: 'John',
          phone: '+19081234567',
        },
      ],
    };
    expect(actual.username).toEqual(expected.username);
    expect(actual.emergencyContact[1].name).toEqual(
      expected.emergencyContact[1].name
    );
    expect(actual.emergencyContact[1].phone).toEqual(
      expected.emergencyContact[1].phone
    );
  });

  it('Get all emergency contacts successfully', async () => {
    const actual = await getEmergencyContacts('Jack');

    const expected = [
      {
        emergencyContact: [
          {
            name: 'Mike',
            phone: '+19087654321',
          },
        ],
      },
    ];
    expect(actual[0].emergencyContact[0].name).toEqual(
      expected[0].emergencyContact[0].name
    );
    expect(actual[0].emergencyContact[0].phone).toEqual(
      expected[0].emergencyContact[0].phone
    );
  });

  it('Remove an emergency contact successfully', async () => {
    await createNewEmergencyContact('Jack', 'John', '+19081234567');
    await removeEmergencyContact('Jack', 'John');
    const result = await User.findOne({ username: 'Jack' });
    const actual = result.toJSON().emergencyContact;

    const expected = [
      {
        name: 'Mike',
        phone: '+19087654321',
      },
    ];
    expect(actual.length).toEqual(expected.length);
  });
});
