const jwt=require("jsonwebtoken");
const userModel = require("../models/userModel");

const userauthmiddleware=async(req,res,next)=>{
    const authHeader = req.headers.authorization || req.headers.Authorization;
    
    
    const token=req.cookies.token || authHeader?.split(' ')[1];
    // console.log(token);
    if(!token){
        
        return res.status(401).json({message:'Unauthorized'});
    }
    try {
        // console.log('hi');
        
        const decode=jwt.verify(token,process.env.JWT_SECRET);
        // console.log(decode);
        const user=await userModel.findOne({_id:decode.id});
        
        if(!user){
            return res.status(401).json({message:'Unauthorized'});
        }
        req.user=user;
        next();
        
    } catch (error) {
        return res.status(401).json({message:"Unauthorised"})
    }

}

module.exports=userauthmiddleware;