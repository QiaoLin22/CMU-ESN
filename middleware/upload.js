const multer = require('multer');

const storage = multer.diskStorage({
  // eslint-disable-next-line func-names
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  // eslint-disable-next-line func-names
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}`);
  },
});
const upload = multer({ storage });

module.exports = { upload };
