import User from "../models/user.model.js"
import bcrypt from "bcrypt"

const signup = async (req,res,next) => {
    const {username,email,password} = req.body
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
    }
    const hashedPassword = bcrypt.hashSync(password,10)
    const newuser = new User({username,email,password:hashedPassword})
    try {
        newuser.save()
        res.status(201).json({message:"create successfully"})
    } catch (error) {
        next(error); 
    }
}

export default {signup}