const mongoose =require('mongoose');
let URI=process.env.PRACTICEMERN_URI;

connectDB=async()=>{
    try{
    await mongoose.connect(URI);
    console.log("Database Connection Successful");
    }catch(e){
        console.log("Database Connection Failed DB");
        return{
            error:true,
            details:e
        }
    }
};

module.exports={connectDB};