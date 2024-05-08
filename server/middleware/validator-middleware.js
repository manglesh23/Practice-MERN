// const { ZodError } = require("zod");

const validator=(schema)=>async(req,res,next)=>{
    try{
      let parsebody= await schema.parseAsync(req.body);
      req.body=parsebody;
      next();
    }catch(e){
        console.log("Error aayi h:-",e)
       res.status(400).json({message:e.errors[0].message});
    }

}

module.exports={validator};