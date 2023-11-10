import multer from 'multer';

const storage = multer.diskStorage({
  destination: 'tmp/file-uploads',
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});

export default multer({ storage });
