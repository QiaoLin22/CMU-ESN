const Twilio = require('twilio');

const accountSid = 'ACd4b0b1bf881e5d406f91ff7ee77708a5';
const authToken = '68dbc9132cdbab43baa71edbc2b00d90';

const client = new Twilio(accountSid, authToken);

const createNewSMS = (senderName, receiverName, receiverNum) => {
  client.messages.create({
    body: `Alert from Emergency Social Network: Hello ${receiverName}, ${senderName} is currently in an emergency. Please contact him/her as soon as possible. Thank you.`,
    to: receiverNum, // Text this number
    from: '+12186568596', // From a valid Twilio number
  });
};

module.exports = createNewSMS;
