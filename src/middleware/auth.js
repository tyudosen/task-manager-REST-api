const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req,res,next) =>{
  try{
    const token = req.header('Authorization').replace('Bearer ','')
    const decoded = jwt.verify(token,'thisIsASecret')
    console.log(decoded);
    
    const user = await User.findOne({_id: decoded._id,'tokens.token': token})
    
    

    if(!user){
        throw new Error()
    }

    req.user = user
    req.currToken = token;
    
    next()
  }catch(err){
    res.status(404).send('Please authenticate')
  }
    
    
}

module.exports = auth