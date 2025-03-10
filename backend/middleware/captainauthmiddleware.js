const jwt=require("jsonwebtoken");
const captainModel=require('../models/captainModel');

const captainauthmiddleware=async(req,res,next)=>{
    const authHeader = req.headers.authorization || req.headers.Authorization;
    
    
    const token=req.cookies.token || authHeader?.split(' ')[1];
    // console.log(token);
    if(!token){
        
        return res.status(401).json({message:'Unauthorized'});
    }
    try {
        // console.log('hi');
        
        const decode=jwt.verify(token,process.env.JWT_SECRET);
        const user=await captainModel.findOne({_id:decode.id});
        // console.log(user);
        
        if(!user){
            return res.status(401).json({message:'Unauthorized'});
        }
        req.user=user;
        next();
        
    } catch (error) {
        return res.status(401).json({message:"Unauthorised"})
    }

}

module.exports=captainauthmiddleware;