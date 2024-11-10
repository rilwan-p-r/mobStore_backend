import asyncHandler from "express-async-handler";
import User from "../../models/userModel.js";
import { generateToken } from "../../utils/generatetoken.js";

const signUp = asyncHandler(async(req,res)=>{
    console.log('req',req.body);
    const {name,email,password}=req.body;
    const existUser = await User.findOne({email})

    if(existUser){
        res.status(400)
        throw new Error('user is already exist with this mail-Id') 
    }

    const user = await User.create({
        name,
        email,
        password
    })

    if(user){
        generateToken(res,user._id,'userJwt')
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email
        })
    }else{
        res.status(400);
        throw new Error('Invalid user data')
    }

})

const signIn = asyncHandler(async(req,res)=>{
    const {email,password} = req.body;

    const user =await User.findOne({email})

    if(user && (await user.matchPassword(password))){
        generateToken(res,user._id,'userJwt');
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
        })
    }else {
        res.status(401).json({
            success: false,
            message: 'Invalid email or password',
        });
    }
})

export {
    signUp,
    signIn
}