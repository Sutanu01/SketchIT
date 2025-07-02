const moongose=require('mongoose');
const mongoURI="mongodb://localhost:27017/SketchIt" 
//An API URI (Uniform Resource Identifier) is a unique address that identifies a specific piece of information within an API and allows you to locate and interact with it

const connectToMongo=()=>{
    moongose.connect(mongoURI).then(()=>{ 
        console.log("Hogya MONGO DB connect!")
    }).catch(()=>{
        console.log("Error 69");
    });
}
module.exports=connectToMongo;