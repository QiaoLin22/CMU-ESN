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

module.exports = { extractUsernames };
