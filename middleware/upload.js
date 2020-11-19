//const GridFsStorage = require('multer-gridfs-storage');
// Create storage engine
const multer = require('multer');
/*
const storage = new GridFsStorage({
    url: DB_STRING,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads'
          };
          resolve(fileInfo);
        });
      });
    }
  });*/
  const storage = multer.diskStorage({
    destination: function(req, file, cb){
      cb(null, './uploads/');
    },
    filename: function(req, file, cb){
      cb(null,file.fieldname + '-' + Date.now());
    }
  });
  const upload = multer({ storage });
  module.exports = { upload };




  