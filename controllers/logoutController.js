const User = require('../models/user');

class LogoutController {
  static logout(req, res) {
    const { username } = res.locals;
    User.updateOne(
      { username }, // Filter
      { $set: { online: false } } // Update
    )
      .then(() => {
        req.io.emit('updateDirectory');
        res.status(200).end();
      })
      .catch((err) => {
        res.status(400).json({ error: err.message });
      });
  }
}

module.exports = LogoutController;
