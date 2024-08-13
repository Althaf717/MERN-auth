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
  