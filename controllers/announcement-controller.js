const {
  createNewAnnouncement,
  getAllAnnouncements,
} = require('../models/announcement');

class AnnouncementController {
  static createAnnouncement(req, res) {
    const { sender, message } = req.body;
    createNewAnnouncement(sender, message)
      .then((newAnnouncement) => {
        req.app.get('io').emit('new announcement', newAnnouncement);
        res
          .status(201)
          .send({ message: 'successfully create an announcement' });
      })
      .catch((e) => {
        res.status(400).json({ error: e });
      });
  }

  static getHistoricalAnnouncements(req, res) {
    getAllAnnouncements().then((announcements) => res.send(announcements));
  }
}

module.exports = AnnouncementController;
