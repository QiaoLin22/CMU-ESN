const User = require('../models/user');

const authenticateAnnouncement = (req, res, next) => {
  const { username } = res.locals;
  User.getUserPrivilege(username)
    .then((result) => {
      if (result.privilegeLevel === 'Coordinator') {
        next();
      } else {
        res.status(401).send({ message: 'User Unauthorized' });
      }
    })
    .catch((e) => {
      res.status(400).json({ error: e });
    });
};

module.exports = { authenticateAnnouncement };
