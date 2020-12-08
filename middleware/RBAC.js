const User = require('../models/user');

class RBAC {
  static async accessPrivilegeLevel(req, res, next) {
    const profile = await User.getUserProfile(res.locals.username);
    req.privilegeLevel = profile.privilegeLevel;
    next();
  }

  static async validateAdministrator(req, res, next) {
    const profile = await User.getUserProfile(res.locals.username);
    if (profile.privilegeLevel === 'Administrator') {
      next();
    } else {
      res.status(403).send('Not authorized');
    }
  }
}

module.exports = RBAC;
