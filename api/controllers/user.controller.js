import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ message: "Username already exists" });
  }

  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    return res.status(400).json({ message: "Email already exists" });
  }
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newuser = new User({ username, email, password: hashedPassword });
  try {
    newuser.save();
    res.status(201).json({ message: "create successfully" });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found"));
    const validPassword = bcrypt.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Wrong credential"));
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: hashedPassword, ...rest } = validUser._doc;
    const expiryDate = new Date(Date.now() + 3600000);
    res.cookie("access_token", token, {
      httpOnly: true,
      sameSite: "Lax", // Consider 'Lax' or 'None' if required
      secure: false, // Ensure HTTPS
      expires: expiryDate,
    });
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: hashedPassword, ...rest } = user._doc;
      const expiryDate = new Date(Date.now() + 3600000);
      res.cookie("access_token", token, {
        httpOnly: true,
        sameSite: "Strict",
        secure: true,
        expires: expiryDate,
      }).status(200).json(rest)
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
      const newuser = new User({
        username: req.body.name.split(" ").join("").toLowerCase() + Math.floor(Math.random() * 1000).toString(),
        email: req.body.email,
        password: hashedPassword,
        profilePicture: req.body.photo,
      });
      await newuser.save();
      const token = jwt.sign({ id: newuser._id }, process.env.JWT_SECRET);
      const { password: hashedPassword2, ...rest } = newuser._doc;
      const expiryDate = new Date(Date.now() + 3600000);
      res.cookie("access_token", token, {
        httpOnly: true,
        sameSite: "Strict",
        secure: true,
        expires: expiryDate,
      }).status(200).json(rest)
    }
  } catch (error) {
    next(error);
  }
};


export const signout = (req, res) => {
  res.clearCookie('access_token').status(200).json('Signout success!');
};



export const updateUser = async (req, res, next) => {
  console.log("updater req:",req.body.username)
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, 'You can update only your account!'));
  }
  try {
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          profilePicture: req.body.profilePicture,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, 'You can delete only your account!'));
  }
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json('User has been deleted...');
  } catch (error) {
    next(error);
  }

}