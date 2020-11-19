const Twilio = require('twilio');

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;

const client = new Twilio(accountSid, authToken);

const createNewSMS = (senderName, receiverName, receiverNum) => {
  client.messages.create({
    body: `Alert from Emergency Social Network: Hello ${receiverName}, ${senderName} is currently in an emergency. Please contact him/her as soon as possible. Thank you.`,
    to: receiverNum, // Text this number
    from: '+12186568596', // From a valid Twilio number
  });
};

module.exports = createNewSMS;
