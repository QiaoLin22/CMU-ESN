const {
  updateUserLocation,
  retrieveUserLocations,
  retrieveUserLocation,
  deleteUserLocations,
} = require('../models/user');

class MapController {
  static updateLocation(req, res) {
    const { username, longitude, latitude } = req.body;
    if (!longitude || !latitude) {
      res.status(400).json({ message: 'longitude and latitude are required' });
    } else {
      updateUserLocation(username, longitude, latitude).then(() => {
        req.app.get('io').emit('updateMap');
        res.status(200).send({ message: 'success' });
      });
    }
  }

  static retrieveLocations(req, res) {
    retrieveUserLocations()
      .then((locations) => res.status(200).json(locations))
      .catch((err) => next(err));
  }

  static retrieveLocation(req, res) {
    const { username } = res.locals;
    retrieveUserLocation(username)
      .then((location) => res.status(200).json(location))
      .catch((err) => next(err));
  }

  static deleteLocation(req, res) {
    const { username } = req.body;
    if (!username) {
      res.status(400).json({ message: 'username is required' });
    } else {
      deleteUserLocations(username).then(() => {
        req.app.get('io').emit('updateMap');
        res.status(200).send({ message: 'success' });
      });
    }
  }
}

module.exports = MapController;
