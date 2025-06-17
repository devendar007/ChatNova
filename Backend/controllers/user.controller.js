import { validationResult } from "express-validator"
import * as userService from "../services/user.service.js"
import userModel from "../models/user.model.js"
import redisClient from "../services/redis.service.js"

export const createUserController= async(req,res)=>{
const errors=validationResult(req);
if(!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array() });
}
try {
    const user=await userService.createUser(req.body);
       const token = await user.generateToken();
       delete user._doc.password;
        res.status(201).json({ user, token });
    } catch (error) {
        res.status(400).send(error.message);
    
} 
}
export const loginUserController=async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    try {
      const {email,password}=req.body;
      const user=await userModel.findOne({email}).select('+password');
      if(!user) return res.status(400).json({
        errors: 'Invalid Credentials'
      })
        const verifiedPass=await user.isValidPassword(password);
        if(!verifiedPass){
            return res.status(400).json({
                errors:'Invalid Credentials'
            })
        }
        const token=await user.generateToken();
        delete user._doc.password;
        res.status(200).json({user,token});

    } catch (error) {
        
    }
}
export const profileController=async (req,res)=>{
    res.status(200).json({
        user:req.user
    });
}

export const logoutController=async (req,res)=>{
    try {
        const token= req.headers.authorization.split(' ')[1]||res.cookies.token;
         redisClient.set(token, 'logout', 'EX', 60 * 60 * 24);

        res.status(200).json({
            message: 'Logged out successfully'
        });
        
    } catch (error) {
        console.log(error);
        res.status(400).send(error.message);
    }
}
export const getAllUsersController = async (req, res) => {
    try {

        const loggedInUser = await userModel.findOne({
            email: req.user.email
        })

        const allUsers = await userService.getAllUsers({ userId: loggedInUser._id });

        return res.status(200).json({
            users: allUsers
        })

    } catch (err) {

        console.log(err)

        res.status(400).json({ error: err.message })

    }
}