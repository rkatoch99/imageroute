const { Registration } = require("../MongoDb/models/Register");
const { UserDetals } = require("../MongoDb/models/Register");
const { address, nick, users } = require("../MongoDb/models/Register");
var jwt = require("jsonwebtoken");
const { ObjectId } = require("mongoose").Types;

//require("../MongoDb/models/Register");

const bcrypt = require("bcrypt");
const { mongo } = require("mongoose");
const nodemailer = require("nodemailer");

//----------------------------------------Auth Registration-------------------------------------//

exports.AuthRegistration = async (req, res) => {
  try {
    const { email } = req.body;
    const userEmail = await Registration.findOne({ email: email });
    if (userEmail) {
      res.status(400).json({ message: "Email is already present.." });
    }

    const password = req.body.password;
    const Confirmpassword = req.body.Confirmpassword;

    if (password === Confirmpassword) {
      const passwordHash = await bcrypt.hash(password, 10);
      const Register = new Registration({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        username: req.body.username,
        password: passwordHash,
      });
      console.log(Register);

      const save = await Register.save();
      if (save) {
        res.status(201).json({ message: "data save successfully..." });
      }
    } else {
      console.log("password incorrect..");
    }
  } catch (errr) {
    console.log(errr);
  }
};

//-------------------------------------------Auth Login-----------------------------------------//

exports.AuthLogin = async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return next("password and username both are required...");
  }

  try {
    const user = await Registration.findOne({ username: req.body.username });

    if (!user)
      return res.status(400).json({ error: "Username is not match...." });

    const comparePassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    console.log(comparePassword);

    if (!comparePassword) {
      return res.status(400).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }

    //signing token with user id
    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.API_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // save the user token

    user.token = token;

    //responding request with user profile success message and  access token .
    res.status(200).send({
      user: {
        id: user._id,
        email: user.email,
        firstname: user.firstname,
      },
      message: "Login successfull",
      accessToken: token,
    });

    // return res.status(200).json({message:"Login sucessfully"});
  } catch (err) {
    console.log(err);
    alert(err.message);
    return next("error : ", err);
  }
};
//--------------------------------------Add User Details-------------------------------------------//

exports.AuthUserDetails = async (req, res) => {
  try {
    const { user_id, address, city, state, pincode, phone } = req.body;

    const RegisterUser = new UserDetals({
      user_id: user_id,
      address: address,
      city,
      state,
      pincode,
      phone,
    });

    const save = await RegisterUser.save();
    console.log("first save", save);

    if (save) {
      return res.status(200).json({ message: "Data save successfully..." });
    }
    console.log(save);
  } catch (err) {
    console.log(err);
  }
};

//----------------------------------------Add address multiply------------------------------------//

exports.Addressupdate = async (req, res) => {
  try {
    const { houseNum, street, citys, states, country, user_id } = req.body;
    const ADDdetails = new address({
      user_id: user_id,
      houseNum: houseNum,
      user_id: user_id,
      street: street,
      citys,
      states,
      country,
    });

    const save = await ADDdetails.save();
    const user = await UserDetals.findOne({ user_id });

    console.log("save wala data", save);

    console.log("id", user);

    user.Address.push(save);
    const d = await user.save();
    console.log(d);

    const add = await UserDetals.findOne({ user: user_id })
      .populate("Address")
      .exec(); // key to populate

    console.log("Add wala data", add);

    // const add = UserDetals.findOne({user_id: user_id }).populate("Address") // key to populate
    // add.Addressupdate.push(save)
    if (add) {
      return res.status(200).json({ message: add });
    }
  } catch (err) {
    console.log(err);
  }
};

//-----------------------------------------Delete by User is-------------------------------------//

exports.Delete = async (req, res, next) => {
  const { user_id } = req.body;
  try {
    const del = await UserDetals.findOneAndDelete({ user: user_id });
    res.status(200).json({ message: `dlete sucessfully ${del}` });
    console.log(del);
  } catch (err) {
    console.log(err);
  }
};

////------------------------------------Token Genratioln-----------------------------------//////

exports.Token = async (req, res, next) => {
  try {
    const { email } = req.body;

    const Checkemail = await Registration.findOne({ email: email });
    console.log(Checkemail);

    if (!Checkemail) {
      return res
        .status(400)
        .json({ error: "User of the email Doesn't exists..." });
    }

    const tokken = jwt.sign(
      {
        email: email,
      },
      process.env.Resetpassword,
      {
        expiresIn: "10m",
      }
    );

    const reg = await Checkemail.updateOne({ resetLink: tokken });
    if (!reg) {
      res.status(400).json({ error: " reset password link error" });
    } else {
      res
        .status(200)
        .json({ message: `password rest successfully ${Checkemail}` });
    }
      

      //-- -----------------------------send the mail if the tokken is verify----------------------------//
      const testAccount = await nodemailer.createTestAccount();
      let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: "jaren59@ethereal.email", // generated ethereal user
          pass: "yvH7mGBuFNnzndY2qQ", // generated ethereal password
        },
      });

      const info = await transporter.sendMail({
        from: '"Fred Foo 👻" <rahul_katoch@excellencetechnologies.in>', // sender address
        to: "sunnyyadav988@gmail.com", // list of receivers
        subject: "Password Reset Link ", // Subject line
        text: "Please Reset your Password here....", // plain text body
        html: `<a href='http://localhost:3000/newpassword/${tokken}'>Click to reset your password</a>`, // html body
      });

      console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    
  } catch (err) {
    console.log(err);
  }
};

//----------------------------------End Password reset generation Token----------------------//

// exports.Verify = async (req, res) => {
//   try {
//     const token = req.params.password_reset_token;
//     const findtoken = await Registration.findOne({ resetLink: token });
//     // const token = findtoken.resetLink
//     console.log("find tokken", findtoken);

//     if (findtoken.resetLink==token) {
//       console.log(req.params.password_reset_token);
//       if (token) {
//         await jwt.verify(token, process.env.Resetpassword, (err, success) => {
//           if (err) {
//             return res.status(400).json({ error: "Tokken was not verify..." });
//           } else {
//             return res
//               .status(200)
//               .json({ message: "Tokken verify.....", success });
//           }
//         });
//       }

//       //-- -----------------------------send the mail if the tokken is verify----------------------------//
//       const testAccount = await nodemailer.createTestAccount();
//       let transporter = nodemailer.createTransport({
//         host: "smtp.ethereal.email",
//         port: 587,
//         secure: false, // true for 465, false for other ports
//         auth: {
//           user: "jaren59@ethereal.email", // generated ethereal user
//           pass: "yvH7mGBuFNnzndY2qQ", // generated ethereal password
//         },
//       });

//       const info = await transporter.sendMail({
//         from: '"Fred Foo 👻" <rahul_katoch@excellencetechnologies.in>', // sender address
//         to: "sunnyyadav988@gmail.com", // list of receivers
//         subject: "Password Reset Link ", // Subject line
//         text: "Please Reset your Password here....", // plain text body
//         html: `<form action="/action_page.php">
//     <label for="fname">New Password</label><br>
//     <input type="password" id="newpassword"  value=${req.body.password}"><br>
//     <label for="confirmpassword">Confirm Password:</label><br>
//     <input type="password" id="confirmpassword" value=${req.body.Confirmpassword}><br><br>

//     <input type="submit" value="Submit">
//   </form> `, // html body
//       });

//       console.log("Message sent: %s", info.messageId);
//       // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

//       console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

//     } else {
//       res.status(400).json({
//         error:
//           "You can't restset the password your password link was expire please generate the new one.....",
//       });
//       console.log(
//         "You can't restset the password your password link was expire please generate the new one....."
//       );
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };

//-----------------------------------Rest your passsword by the help of frontend----------------------//

exports.Resetpassword = async (req, res) => {
  try {
    const token = req.params.password_reset_token;
    if (token) {
      await jwt.verify(token, process.env.Resetpassword, (err, success) => {
        if (err) {
          return res.status(400).json({ error: "Tokken was not verify..." });
        } else {
          return res
            .status(200)
            .json({ message: "Tokken verify.....", success });
        }
      });
    }
    const findtoken = await Registration.findOne({ resetLink: token });
    console.log("reset password...", findtoken.resetLink);
    const password = req.body.password;
    const Confirmpassword = req.body.Confirmpassword;
    if (password === Confirmpassword) {
      const passwordHash = await bcrypt.hash(password, 10);
      const reg = await Registration.updateOne({ password: passwordHash });
      const save = await reg.save();
      if (save) {
        res.status(201).json({ message: "Password Change successfully..." });
      }
    } else {
      console.log("password incorrect..");
    }
  } catch (err) {
    console.log(err);
  }
};
