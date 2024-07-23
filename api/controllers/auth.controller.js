import User from "../models/user.model.js"
import bcrypt from "bcrypt"

const signup = async (req,res) => {
    const {username,email,password} = req.body
    const hashedPassword = bcrypt.hashSync(password,10)
    const newuser = new User({username,email,password:hashedPassword})
    try {
        newuser.save()
        res.status(201).json({message:"create successfully"})
    } catch (error) {
        res.status(500).json(error.message)
    }
}

export default {signup}