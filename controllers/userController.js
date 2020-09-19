const User = require("../models/user");

class UserController {
  static createUser(req, res) {
    const { username, password } = req.body;

    // create new user and save to db
    const hashAndSalt = utils.genHashAndSalt(password);
    const newUser = new User({
      username: username,
      ...hashAndSalt,
    });

    newUser
      .save()
      .then((user) => {
        console.log(user);
        res.status(201).send("success");
      })
      .catch((err) => {
        let message = undefined;

        if (err.code === 11000) {
          message = "Username already exists";
        } else {
          message = Object.values(err.errors)[0].properties.message;
        }

        res.status(400).json({ error: message });
      });
  }
}

module.exports = UserController;
