import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";


export const adminsignin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
      const validAdmin = await User.findOne({ email });
      if (!validAdmin) return next(errorHandler(404, "Admin not found"));
      const validPassword = bcrypt.compareSync(password, validAdmin.password);
      if (!validPassword) return next(errorHandler(401, "Wrong credential"));
      if (validAdmin.__v === 1) {
      const token = jwt.sign({ id: validAdmin._id }, process.env.JWT_SECRET);
      const { password: hashedPassword, ...rest } = validAdmin._doc;
      const expiryDate = new Date(Date.now() + 3600000);
      res.cookie("access_token", token, {
        httpOnly: true,
        sameSite: "Lax", // Consider 'Lax' or 'None' if required
        secure: false, // Ensure HTTPS
        expires: expiryDate,
      });
      res.status(200).json(rest);
    }else{
        return next(errorHandler(404, "Invalid Admin"));
    }
    } catch (error) {
      next(error);
    }
  };


  export const getUserData = async (req, res) => {
    const search = req.query.search || "";
    try {
      const users = await User.find({
        $or: [
          { email: { $regex: search, $options: "i" } },
          { name: { $regex: search, $options: "i" } },
        ],
        __v: 0,
      });
  
      if (users.length > 0) {
        res.status(200).json(users);
      } else {
        res.status(404).json({ message: "No users found" });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  

  export const getUserDataById = async(req,res)=>{
    const { id } = req.params;
  try {
    //console.log(id);
    const user = await User.findOne({ _id: id });
    if (user) {
      res.status(200).json(user);
    } else {
      throw new Error("User Not found!");
    }
  } catch (err) {
    res.status(500).json(err.message);
  }
  }


  export const deleteUserById = async(req,res)=>{
    const { id } = req.params;
  try {
    const deleteUser = await User.deleteOne({ _id: id });
    if (deleteUser) {
      res.status(200).json({ message: "User account deleted successfully" });
    } else {
      throw new Error("Cannot delete user account!");
    }
  } catch (err) {
    res.status(500).json(err.message);
  }
  }

  
  export const updateUserById = async(req,res)=>{
    const { id } = req.params;
  try {
    const user = await User.findOne({ _id: id });
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.profilePicture = req.body.profilePicture || user.profilePicture
    if (req.body.password) {
      const hashedPassword = bcrypt.hashSync(req.body.password, 10);
      user.password = hashedPassword;
    }

    const updatedUser = await user.save();
    if (updatedUser) {
      res.status(200).json(user);
    } else {
      throw new Error("Cannot Update this account");
    }
  } catch (err) {
    res.status(500).json(err.message);
  }
  }



  export const addUser = async(req,res)=>{
    const { username, email, password, profilePicture } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    
    const newUser = await User.create({
      username: username,
      email: email,
      password: hashedPassword,
      profilePicture: profilePicture,
    });
    await newUser.save();
    res.json('successfully added');
  } catch (err) {
    res.json(err.message);
    console.log(err);
  }
  }