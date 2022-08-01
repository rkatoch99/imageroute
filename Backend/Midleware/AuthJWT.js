const jwt = require("jsonwebtoken");
User = require("../MongoDb/models/Register");

const verifyToken = (req, res, next) => {
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
    jwt.verify(req.headers.authorization.split(' ')[1], process.env.API_SECRET, function (err, decode) {
      if (err) req.user = undefined;
      User.findOne({
          _id: decode.id
        })
        .exec((err, user) => {
          if (err) {
           return  res.status(500)
              .send({
                message: err
              });
          } else {
            req.user = user;
            next();
          }
        })
    });
  } else {
    req.user = undefined;
    next();
  }
};
//---------------------------------------- End of Login Verify-------------------------/////

//-----------------------------------------Forget password verify-------------------------///



// const ForgetverifyToken = async (req, res, next) => {

  
//   if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
//     try{

//      await jwt.verify(req.headers.authorization.split(' ')[1], process.env.Resetpassword, function (err, decode) {
//       if (err) req.user = undefined;
//       User.findOne({
//           _id: decode.id
//         })
//         .exec((err, user) => {
//           if (err) {
//            return  res.status(500)
//               .send({
//                 message: err
//               });
//           } else {
//             req.user = user;
//             next();
//           }
//         })
//     });
//   }catch(err){
//     console.log(err)
//   }
//   } else {
//     req.user = undefined;
//     next();
//   }
// };
module.exports = verifyToken;

//module.exports = ForgetverifyToken;