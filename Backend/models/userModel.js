const mongoose = require("mongoose");

const userModel = mongoose.Schema({
    name:{ type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    confirmPassword:{type:String,required:true},
    image:{type:String,default:"https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png"},
},
{timestamps:true,

})

const User = mongoose.model("User",userModel);

module.exports=User;