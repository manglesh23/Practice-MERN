const mongoose = require("mongoose");
const bcyrpt = require("bcrypt");
const zod = require("zod");

let UserSchema = mongoose.Schema({
  username: {
    type: String,
    require: true,
  },
  mobile: {
    type: String,
    require: true,
  },
  city: {
    type: String,
    require: true,
  },
  agentId: {
    type: String,
    require: true,
  },
});

let agentSchema = mongoose.Schema({
  agentName: {
    type: String,
    require: true,
  },
  agentArea: {
    type: String,
    require: true,
  },
  agentMobileNumber: {
    type: String,
    require: true,
  },
  isAdmin: {
    type: Boolean,
    require: true,
  },
  agentEmail:{
    type:String,
    require:true
  }
});

let signUpDatabaseSchema = mongoose.Schema({
  username: {
    type: String,
    require: true,
  },
  mobile: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  resetPasswordToken:{
    type:String,
    require:false
  },
  resetPasswordExpires:{
    type:String,
    require:false
  }
});



signUpDatabaseSchema.pre("save", async function (next) {
  console.log("this Form signupdatabase.pre:-", this);
  let user = this;

  if (!user.isModified("password")) {
    return next();
  }

  try {
    let hashpassword = await bcyrpt.hash(user.password, 10);
    console.log("hash password:-", hashpassword);
    user.password = hashpassword;
    next();
  } catch (e) {
    next(e);
  }
});

const signupdatabase = new mongoose.model( "signupdatabase", signUpDatabaseSchema);

const User = new mongoose.model("canddiateDetails", UserSchema);
const agentUser = new mongoose.model("agentdetails", agentSchema);
module.exports = { User, agentUser, signupdatabase };
