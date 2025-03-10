const express=require('express');
const userroute=express();
const userController=require('../controllers/userController');
const userauthmiddleware=require('../middleware/userauthmiddleware');

userroute.get('/register',(req,res)=>{
    res.send('this is the register route page');
})

userroute.get('/test',(req,res)=>{
    res.send('this is the user route /test');
})

userroute.get('/profile',userauthmiddleware,userController.getUserProfile);

userroute.post('/createride',userauthmiddleware,userController.createRide);

userroute.post('/getridedata',userauthmiddleware,userController.getRideData);

userroute.post('/getcaptains',userController.getAvailableCaptains);

userroute.get('/login',(req,res)=>{
    res.send('this is the login route page');
})

userroute.get('/logout',userController.logoutUser);

userroute.post('/register',userController.registerUser);
userroute.post('/login',userController.loginUser);


module.exports=userroute;