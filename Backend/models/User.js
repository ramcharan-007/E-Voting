const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{type:String, unique: true, required: true},
    email:{type:String, unique: true, required: true},
    password:{type:String, required: true},
    phone:{type:Number, required:true, unique:true},
    profilePicture: {type: String},
    joinedDate:{type:Date, default:Date.now},
    votingrights:{type:Boolean,required:true, default: false},
    votingCount:{type:Number, required: true, default:0},
    verified:{type:Boolean, default:false},
    verificationToken:String
})

const User = mongoose.model("User", userSchema);

module.exports = User;