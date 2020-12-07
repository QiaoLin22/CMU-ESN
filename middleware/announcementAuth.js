const User = require('../models/user');

const authenticateAnnouncement = (req, res, next) => {
  const { username } = res.locals;
  User.getUserPrivilege(username)
    .then((result) => {
      if (
        result.privilegeLevel === 'Coordinator' ||
        result.privilegeLevel === 'Administrator'
      ) {
        next();
      }
    })
    .catch((e) => {
      console.log(e);
      // res.status(400).json({ error: e });
    });
};

module.exports = { authenticateAnnouncement };
