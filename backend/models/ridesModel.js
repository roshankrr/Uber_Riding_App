const mongoose =require('mongoose');

const rideSchema=new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        required:true
    },
    captain_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'captains'
    },
    ride_status:{
        type:String,
        default:'pending'
    },
    source:{
        type:String,
        required:true
    },
    destination:{
        type:String,
        required:true
    },
    distance:{
        type:String,
        required:true
    },
    vehicle_type:{
        type:String,
        required:true
    },
    fare:{
        type:String,
        required:true
    },
    Otp:{
        type:String,
    },

})

const rideModel=mongoose.model('rides',rideSchema);
exports.rideModel=rideModel;