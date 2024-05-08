const {z}=require('zod');

const signUpSchema=z.object({
    username:z.string({required_error:"Name is Required"}).trim().min(3,{message:"Name Should be atleast of 3 char"}).max(255,{message:"Not more than 255 char"}),
    mobile:z.string({required_error:"Mobile Number required"}).trim().length(10,{message:"Not valid"}),
    password:z.string({required_error:"Create Passwaord"}).min(6,{message:"Password Should be atleast of 6 char"}).max(20,{message:"Not more than 20"})
});

const agentSchemaValidation=z.object({
   agentName:z.string({required_error:"Name Required"}).trim().min(3,{message:"Name Should be atleast of 4 char"}),
   agentMobileNumber:z.string({required_error:"Mobile NUmber Required"}).trim().length(10,{message:"Can't be less than 10"}),
   agentArea:z.string({required_error:"Agent Area Required"}).min(3,{message:"Agent Area Can't be empty"}).trim(),
   isAdmin:z.boolean({required_error:"Agent Designation Required"}),
   agentEmail:z.string({required_error:"Email Is required"}).trim(),
   loginId:z.string({message:"Something went wrong,please try again"})
});

module.exports={signUpSchema,agentSchemaValidation}