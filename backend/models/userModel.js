const mongoose =require('mongoose');

const userSchema=mongoose.Schema({
    fullName:{
        firstName:{
            type:String,
            required:true,
            minlength:2,
        },
        lastName:{
            type:String,
        }
    },
    email:{
        type:String,
        required:true,
        unique:true,
        minlength:4,
    },
    password:{
        type:String,
        required:true,
        minlength:6,
    },
    socketId:{
        type:String,
    },
})

const userModel=mongoose.model('user',userSchema);

module.exports=userModel;