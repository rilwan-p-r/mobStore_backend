import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

const protect = asyncHandler(async(req,res,next)=>{
   let token ;
   console.log('reqqqqqqqqq',req.cookies)
   token = req.cookies.userJwt;
   console.log('tttttttoken',token);

   if(token){
    try {
      const decoded = jwt.verify(token,process.env.SECRET_KEY);
      console.log('dddddddd',decoded);
      
      req.user = await User.findById(decoded.userId).select('-password');

      next();
      
    } catch (error) {
        res.status(401);
        throw new Error("Not auhtorized, invalid token")
    }
   }else{
    res.status(401);
    throw new Error('Not authorized, no token');
   }
})

export { protect }