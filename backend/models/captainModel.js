const mongoose=require('mongoose');


const captainSchema=new mongoose.Schema({
    "fullName":{
        "firstName":{
            type:String,
            required:true,
            minlength:[2,"First name must be at least 2 characters long"],
        },
        "lastName":{
            type:String,
        }
    },
    "email":{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        match:[/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,"Please fill a valid email address"],
    },
    "password":{
        type:String,
        required:true,
        minlength:[6,"Password must be at least 6 characters long"],
    },
    "socketId":{
        type:String,
    },
    "status":{
        type:String,
        enum:["active","inactive"],
        default:"inactive",
    },
    "vehicle":{
        "vehicletype":{
            "type":"String",
            enum:["car","bike","auto"],
            "required":true,
        },
        "model":{
            "type":"String",
            "required":true,
        },
        "plate":{
            "type":"String",
            "required":true,
        },
        "color":{
            "type":"String",
            "required":true,
        },

    },

    "location":{
        "latitude":{
            "type":"Number",

        },
        "longitude":{
            "type":"Number",

        },
    }


});

const captainModel=mongoose.model("captain",captainSchema);

module.exports=captainModel;