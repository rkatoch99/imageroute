const multer = require("multer");
const storage = multer.memoryStorage()


const FileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images");
  },
  filename: (req,file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});

const upload = multer({ storage: FileStorageEngine })




module.exports = upload;