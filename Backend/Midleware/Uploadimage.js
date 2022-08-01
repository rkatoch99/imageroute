const multer = require("multer");


const Storage= multer.diskStorage({
  destination: "uploads",
  filename: (req,file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});

const uploadimage = multer({ storage: Storage })

module.exports = uploadimage;


