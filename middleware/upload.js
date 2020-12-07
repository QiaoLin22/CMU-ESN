const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: '/uploads',
      public_id: `${file.fieldname}-${Date.now()}`,
    };
  },
});
/*
const storage = multer.diskStorage({
  // eslint-disable-next-line func-names
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  // eslint-disable-next-line func-names
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}`);
  },
}); */
const upload = multer({ storage: storage });

module.exports = { upload };
