const mongoose = require("mongoose");

const UserRegister = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetLink:{
    data:String,
    default:'',
  }
});

const userDetails = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "address",
  },
  Address: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "address",
    },
  ],
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
});

const Address = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserDetals",
  },
  houseNum: {
    type: String,
  },
  street: {
    type: String,
  },
  citys: {
    type: String,
  },
  states: {
    type: String,
  },
  country: {
    type: String,
  },
});


const Registration = new mongoose.model("users", UserRegister);

const UserDetals = new mongoose.model("usersDetails", userDetails);

const address = new mongoose.model("address", Address);

module.exports = { Registration, UserDetals, address };
