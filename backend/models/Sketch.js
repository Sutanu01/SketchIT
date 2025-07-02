const mongoose = require('mongoose');
const { Schema } = mongoose;
const SketchSchema = new Schema({
    user:{
         type:mongoose.Schema.Types.ObjectId,
         ref :'user'
    },
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    img:{
        type:String,
    },
    date: {
        type: Date,
        default: Date.now
    }
});
module.exports=mongoose.model('sketch',SketchSchema)