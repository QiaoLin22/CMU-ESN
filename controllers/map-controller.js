const {
  updateUserLocation,
  retrieveUserLocations,
  retrieveUserLocation,
  deleteUserLocations,
} = require('../models/user');

class MapController {
  static updateLocation(req, res) {
    const { username, longitude, latitude } = req.body;
    updateUserLocation(username, longitude, latitude)
      .then(() => {
        req.app.get('io').emit('updateMap');
        res.status(200).send({ message: 'success' });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json({ error: err });
      });
  }

  static retrieveLocations(req, res) {
    retrieveUserLocations()
      .then((locations) => res.status(200).json(locations))
      .catch((err) => {
        console.log(err);
        res.status(400).json({ error: err });
      });
  }

  static retrieveLocation(req, res) {
    const { username } = res.locals;
    retrieveUserLocation(username)
      .then((location) => res.status(200).json(location))
      .catch((err) => {
        console.log(err);
        res.status(400).json({ error: err });
      });
  }

  static deleteLocation(req, res) {
    const { username } = req.body;
    deleteUserLocations(username)
      .then(() => {
        req.app.get('io').emit('updateMap');
        res.status(200).send({ message: 'success' });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json({ error: err });
      });
  }
}

module.exports = MapController;
