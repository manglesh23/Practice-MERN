const express = require("express");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { sendEmail } = require("../emailService/emailmodule");
const { User, agentUser, signupdatabase } = require("../models/userSchema");
const crypto=require('crypto');
const axios= require('axios');

const apiIntegration=async(req,res)=>{
  try{
  console.log("API Integration");

   const requirementConfig = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://api.meraqui.com/Integration/api/Integration/IntegGetClientContractDtls',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        "userName": "ajay.k@meraqui.com",
        "password": "Ajay@123",
        "customerKey": "NTAwMTM5NTAwMDA0"
      }
    };

    const  data  = await axios(requirementConfig);
    // console.log(JSON.parse(data.data));
    console.log(data.data);
    res.status(200).json({message:data.data});
    return data;
  }catch(e){
    return{
      error:true,
      details:e
    }
  }
}

const home = async (req, res) => {
  console.log("home");
  try {
    res.status(200).json({ message: "home Page " });
  } catch (e) {
    return {
      error: true,
      details: e,
    };
  }
};

//Candiddate Registration
const registerCandidate = async (req, res) => {
  console.log("Register");
  try {
    const { username, mobile, city, agentId } = req.body;
    console.log(username, mobile, city, agentId);
    let checkIfExist = await User.findOne({ mobile: mobile });
    if (checkIfExist) {
      return res.status(200).json({ message: `${mobile} Already Exists` });
    }
    let userdetails = await User.create({
      username,
      mobile,
      city,
      agentId,
    });
    res.status(200).json({ message: userdetails });
    //   res.status(200).json({message:"Regsiter Candidate"});
  } catch (e) {
    return {
      error: true,
      details: e,
    };
  }
};

//Agent Registration
const registerAgent = async (req, res) => {
  console.log("Register");
  try {
    console.log("Req Body:-", req.body);
    const {
      agentName,
      agentArea,
      agentMobileNumber,
      isAdmin,
      loginId,
      agentEmail,
    } = req.body;
    console.log(
      "agent details:-",
      agentArea,
      agentName,
      agentMobileNumber,
      loginId,
      agentEmail
    );
    //   res.status(200).json({message:"Agent Register"});
    let checkAgent = await agentUser.findOne({ agentMobileNumber: loginId });
    console.log("check Designation:-", checkAgent);

    if (checkAgent && checkAgent.isAdmin === true) {
      let checkIfExist = await agentUser.findOne({
        agentMobileNumber: agentMobileNumber,
      });

      if (checkIfExist) {
        return res
          .status(200)
          .json({ message: `${agentMobileNumber} already exists` });
      }

      let agentCreate = await agentUser.create({
        agentName,
        agentMobileNumber,
        agentArea,
        isAdmin,
        agentEmail,
      });

      const emailInfo = await sendEmail(
        agentEmail,
        "subject",
        "Testing for reply back"
      );

      console.log("Email Sent:-", emailInfo);
      
      res
        .status(200)
        .json({
          message: "Successfully Registered",
          Agent_Details: agentCreate,
        });
    } else {
      res.status(200).json({ message: "You Are Not Authorized" });
    }
  } catch (e) {
    return {
      error: true,
      details: e,
    };
  }
};

//getData
const getData = async (req, res) => {
  try {
    const { mobile } = req.body;
    console.log(mobile);
    let checkAgent = await agentUser.findOne({ agentMobileNumber: mobile });
    console.log("check agent:-", checkAgent);
    if (checkAgent && checkAgent.isAdmin === true) {
      let getData = await User.find();
      console.log(getData);
      res
        .status(200)
        .json({ message: getData, totalCandidateData: getData.length });
    } else {
      res.status(200).json({ message: "Not Authorised" });
    }
  } catch (e) {
    return {
      error: true,
      details: e,
    };
  }
};

//sign Up
const signup = async (req, res) => {
  try {
    const { username, mobile, password } = req.body;
    console.log("Mobile:-", mobile);
    let checkIfExist = await signupdatabase.findOne({ mobile: mobile });

    if (checkIfExist) {
      return res.status(200).json({ message: "You Are Already Registered" });
    }

    let usercreate = await signupdatabase.create({
      username,
      mobile,
      password,
    });
    console.log("sign up user:-", usercreate);
    res.status(200).json({ message: usercreate });
  } catch (e) {
    return {
      error: true,
      details: e,
    };
  }
};

//login
const login = async (req, res) => {
  try {
    console.log("Login page");
    const { mobile, password } = req.body;
    console.log(mobile, password);
    let findUser = await signupdatabase.findOne({ mobile: mobile });
    if (findUser) {
      let comparePassword = await bcrypt.compare(password, findUser.password);
      if (comparePassword) {
        res.status(200).json({ message: `Welcome ${findUser.username}` });
      } else {
        res.status(200).json({ message: "Incorrect Password" });
      }
    }
    res
      .status(200)
      .json({ message: `This ${mobile} Mobile is not registered` });
  } catch (e) {
    return {
      error: true,
      details: e,
    };
  }
};

//forgot password
const forgotPassword=async(req,res)=>{
  try{
     console.log("Forgot password");
    //  res.status(200).json({message:"Forgot password",reqBody:req.body});
     let findUser= await signupdatabase.find({mobile:req.body.mobile});
     console.log("findUser:-",findUser);

     if(!findUser.length){
      console.log("Not found in the database");
      return res.status(200).json({message:"Not Found in the database"});
     }
   
     const token = crypto.randomBytes(20).toString('hex');
     
     console.log("token:-",token);
     findUser[0].resetPasswordToken = token;
     findUser[0].resetPasswordExpires = Date.now() + 3600000; // 1 hour

     await findUser[0].save();
     
     res.status(200).json({ message: 'Password reset instructions sent to your email',token:token });

    }catch(e){
      return{
        error:true,
        details:e
      }
    }
}

const resetPassword=async(req,res)=>{
  try{
  // res.status(200).json({message:"Reset Password",req:req.body});
  console.log("Reset password");
  const { token, newPassword } = req.body;
  const user = await signupdatabase.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
  });
   console.log("USer:-",user)
  if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
  }

  
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  res.json({ message: 'Password reset successful' });
  }catch(e){
    return{
      error:true,
      details:e
    }
  }
}


module.exports = {
  home,
  registerCandidate,
  registerAgent,
  getData,
  login,
  signup,
  forgotPassword,
  resetPassword,
  apiIntegration
};
