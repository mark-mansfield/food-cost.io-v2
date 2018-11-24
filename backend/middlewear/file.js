// A node.js middleware for handling multipart/form-data on server
//  https://github.com/expressjs/multer
const multer = require('multer');
const MIME_TYPE_MAP = {
  'text/csv': 'csv',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

// multer needs a little config
// where to store things , how to store them. error handling
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type');
    if (isValid) {
      error = null;
    }
    console.log(error);
    cb(error, 'backend/uploads');
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(' ')
      .join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    console.log(name + '-' + Date.now() + '.' + ext);
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

module.exports = multer({ storage: storage }).single('file');
