const { findUserByUsername } = require('../models/user');

const extractUsernames = (roomId, currUsername) => {
  const startRegex = new RegExp(`^${currUsername}`);
  const endRegex = new RegExp(`${currUsername}$`);

  if (roomId.match(startRegex)) {
    return {
      username1: currUsername,
      username2: roomId.replace(startRegex, ''),
    };
  } else if (roomId.match(endRegex)) {
    return {
      username1: roomId.replace(endRegex, ''),
      username2: currUsername,
    };
  } else {
    throw Error('currUsername is not in roomId');
  }
};

const isRoomIdValid = async (roomId, currUsername) => {
  try {
    const { username1, username2 } = extractUsernames(roomId, currUsername);

    // check two usernames are not the same
    if (username1 === username2) return false;

    // check two usernames are ordered
    if (username1 > username2) return false;

    // check two usernames exist in db
    const user1 = await findUserByUsername(username1);
    if (!user1) return false;

    const user2 = await findUserByUsername(username2);
    if (!user2) return false;

    // return true when all checks are done
    return true;
  } catch (e) {
    return false;
  }
};

module.exports = { isRoomIdValid,
                  extractUsernames};
