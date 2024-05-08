const express=require('express');
const router=express.Router();

const{home,registerCandidate, registerAgent,getData,login, signup,forgotPassword,resetPassword,apiIntegration}=require("../auth-controller/controller");
const {signUpSchema,agentSchemaValidation}=require('../zodValidatotr/auth-validator');
const {validator}=require('../middleware/validator-middleware');

router.route("/").get(home);
router.route("/registerCandidate").post(registerCandidate);
router.route("/registerAgent").post(validator(agentSchemaValidation),registerAgent);
router.route("/getData").get(getData);
router.route("/login").post(login);
router.route("/signup").post(validator(signUpSchema),signup);
router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword").post(resetPassword);
router.route("/apicall").post(apiIntegration)

module.exports=router;