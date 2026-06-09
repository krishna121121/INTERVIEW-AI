const mongoose=require('mongoose');

const userSchema=mongoose.Schema({
    username:{
        type:String,
        unique:['true',"userName already exist"],
        required:true
    },
    email:{
        type:String,
        unique:['true',"email already exist"],
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

const userModel=mongoose.model("users",userSchema)
module.exports=userModel;