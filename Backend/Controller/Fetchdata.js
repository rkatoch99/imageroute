const Registration = require("../MongoDb/models/Register");
require("../MongoDb/models/Register");
const mongoOp = require("../MongoDb/models/Register");

exports.FetchData = async (req, res) => {
  try {
    const User = await Registration.find();
    console.log(User);

    const response = [];
    User.forEach((user) => {
      response.push({
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        username: user.username,
      });
    });

    console.log(response);

    res.status(200).json(response);
  } catch (err) {
    console.log(err);
  }
};

exports.DeleteData = async (req, res) => {
  try {
    const { _id } = req.body;

    const User = await Registration.deleteOne({ id: _id });
    console.log(User);

    res.status(200).json({ message: "data delete sucessfully.." });
  } catch (err) {
    console.log(err);
  }
};

exports.PageNo = async (req,res) => {
  try {
    const perPage = 10,page = req.params.page >= 1 ? req.params.page : 1
    // page = page - 1
    const  query =  await Registration.find().skip(perPage*page).limit(perPage)
    console.log(query)
    res.status(200).json({message:query})


  }catch (err) {
    console.log(err);
  }
};
