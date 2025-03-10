const express=require('express');
const captainRoute=express();
const captainController=require('../controllers/captainController');
const captainauthmiddleware=require('../middleware/captainauthmiddleware');

captainRoute.get('/register',(req,res)=>{
    res.send('this is the register route page');
})

captainRoute.get('/test',(req,res)=>{
    res.send('this is the user route /test');
})

captainRoute.get('/profile',captainauthmiddleware,captainController.getCaptainProfile);

captainRoute.post('/updateprofile',captainauthmiddleware,captainController.updateCaptainProfile);

captainRoute.get('/login',(req,res)=>{
    res.send('this is the login route page');
})

captainRoute.get('/getCaptainProfileById/:id',captainController.getCaptainProfileById);

captainRoute.get('/logout',captainController.logoutCaptain);

captainRoute.post('/register',captainController.registerCaptain);
captainRoute.post('/login',captainController.loginCaptain);


module.exports=captainRoute;