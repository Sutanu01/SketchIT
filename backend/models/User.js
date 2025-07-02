const mongoose = require('mongoose');
const { Schema } = mongoose;
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    profilephoto:{
       type:String,
       default:null
    },
    date: {
        type: Date,
        default: Date.now
    }
});
const User=mongoose.model('user',UserSchema)
module.exports=User;