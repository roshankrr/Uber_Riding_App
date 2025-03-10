const mongoose = require('mongoose');
const captainModel=require('../models/captainModel');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');


exports.registerCaptain=async(req,res)=>{



    const {fullName,email,password,status,vehicle}=req.body;
    // console.log(req.body);
    

      const captain =await captainModel.findOne({email});
      if(captain){
            return res.status(401).json({message:'Captain already exists'});
      }
    try {
        const hashedPassword=await bcrypt.hash(password,10);
        const newCaptain=new captainModel({
            fullName,
            email,
            password:hashedPassword,
            status,
            vehicle,
        })
        await newCaptain.save();
        // console.log(newCaptain);
        res.status(201).json({message:'Captain registered successfully',captain:newCaptain});
        
    } catch (error) {
        res.status(500).json({message:'Error registering captain',error});
    }
}


exports.getCaptainProfile=async (req,res)=>{
    res.status(200).json({user:req.user});
}

exports.getCaptainProfileById=async (req,res)=>{
    const {id}=req.params;
    try {
        const captain=await captainModel.findOne({_id:id});
        res.status(200).json({message:'Captain profile retrieved successfully',captain});
    } catch (error) {
        res.status(500).json({message:'Error retrieving captain profile',error});
    }
}

exports.updateCaptainProfile=async (req,res)=>{
    const {location}=req.body;
    try {
        const captain=await captainModel.findOneAndUpdate({_id:req.user._id},{location},{new:true});
        res.status(200).json({message:'Captain profile updated successfully',captain});
    } catch (error) {
        res.status(500).json({message:'Error updating captain profile',error});
    }
}


exports.loginCaptain=async(req,res)=>{
    const {email,password}=req.body;
    try {
        const captain=await captainModel.findOne({email});
        if(!captain){
            return res.status(401).json({message:'Invalid email or password'});
        }
        const isMatch=await bcrypt.compare(password,captain.password);
        if(!isMatch){
            return res.status(401).json({message:'Invalid email or password'});
        }
        const token=jwt.sign({id:captain.id,email:captain.email},process.env.JWT_SECRET,{expiresIn:'1h'});
        res.cookie('token',token,{httpOnly:true,expires:new Date(Date.now()+24*60*60*1000)});
        res.status(200).json({message:'Captain logged in successfully',captain,token});
        
    } catch (error) {
        res.status(500).json({message:'Error logging in captain',error});
    }
}


exports.logoutCaptain=async(req,res)=>{
    res.clearCookie('token');
    res.status(200).json({message:'Captain logged out successfully'});
}
