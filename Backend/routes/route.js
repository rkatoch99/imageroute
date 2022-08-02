const express = require("express");

const routes = express.Router();
const multer = require("multer");

const AuthController = require("../Controller/AuthRegistration");

const verifyToken = require("../Midleware/AuthJWT");

const upload = require("../Midleware/FileStorageEngine");

const uploadimage = require("../Midleware/Uploadimage");

const Data = require("../Controller/Fetchdata");
const uploadImage = require('../MongoDb/models/ImageModel')

////////-----------------Get Routes---------------------------------------/////////////////

routes.get("/Dashboard", verifyToken, Data.FetchData);
routes.get("/user/list/:page", Data.PageNo);

////-------------------------Get Routes end here----------------------------------------///

///-----------------------------Post Routes start here---------------------------/////

routes.post("/Registration", AuthController.AuthRegistration);
routes.post("/Login", AuthController.AuthLogin);

routes.post("/user/address", verifyToken, AuthController.AuthUserDetails);

routes.post("/user/Addaddress", verifyToken, AuthController.Addressupdate);

routes.post("/user/profile-image", upload.single("image"), (req, res) => {
  console.log("hello");
  console.log(req.file);
  res.status(200).json({ message: "Your image uplode successfully.." });
  // res.send("single file uploade successfully..")
});

routes.post("/uploads", uploadimage.single('testImage'), (req, res) => {
  const ImageUpload = new uploadImage({
    name: req.body.name,
    image: {
      data: req.file.filename,
      contentType: "image/png",
    },
  });
  ImageUpload.save()
    .then(() => {
      res.status(200).json({ message: "image save successflly..." });
    })
    .catch((err) => {
      console.log(err);
    });
});

routes.post('/resetpassword',AuthController.Resetpassword)

routes.post("/user/forgot-password", AuthController.Token);

// routes.post(
//   "/user/verify-reset-password/:password_reset_token",
//   AuthController.Verify
// );

//////////////-----------------------Post Routes end here---------------------//////////////

/////////---------------------------Put Routes start here-------------------------------//////

routes.put("/user/delete", verifyToken, Data.DeleteData);

///////////////------------------------Put Routes end here---------------------------//////////

routes.delete("/user/address/:id", AuthController.Delete);



module.exports = routes;
