const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const blacklistTokenModel = require('../models/blacklistToken.model');

module.exports.authUser= async (req,res,next)=>{
  //token can be found either in HEADER or in Cookies
  const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

  if(!token){
    return res.status(401).json({message:'No token found'});
  }

  const isBlacklisted = await blacklistTokenModel.findOne({token: token});

  if(isBlacklisted){
    return res.status(401).json({message:'Token is blacklisted'});
  }
  

  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded._id);
    
    req.user = user;

    return next();

  }catch(err){
    return res.status(401).json({message:'Invalid token'});
  }
}
