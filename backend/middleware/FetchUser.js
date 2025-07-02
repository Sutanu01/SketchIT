const privateKey = "$Thequickbrownfoxjumpsoverthelazydog$" //private key for AUTH token
var jwt=require('jsonwebtoken'); 
const fetchuser =(req,res,next)=>{
    const AuthToken=req.header('AuthToken') 

    //check if token exits
    if(!AuthToken){
        return res.status(401).send({error:"Invalid Auth Token"});
    }
    try {
        const data=jwt.verify(AuthToken,privateKey)  //getting the user back from Auth token
        req.user = data.user;
        next();
    } catch (error) {
        console.error(error.message);
        return res.status(401).send({error:"Invalid Auth Token"})
    }
}
module.exports=fetchuser