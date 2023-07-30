const mongoose = require('mongoose');

const userSchema = mongoose.Schema({

    userName:String,
    phoneNumber:String,
    password:String,
    contacts:[{type:String}],

})

exports.User = mongoose.model("User", userSchema);


const chatSchema = mongoose.Schema({

   members:[{type:String}],
   conversation:[{
    
    sender:String,
    message:String,
    time: {type:Date, default:Date.now}
       
   },],

})

exports.Chat = mongoose.model("Chat", chatSchema);