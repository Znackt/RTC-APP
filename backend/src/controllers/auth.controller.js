import { generateToken } from "../lib/utils.js";
import User from "../model/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
        return res.status(400).json({
            message: "All fields are required",
        });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 Character",
      });
    } else if (password.length >= 100) {
      return res.status(400).json({
        message: "Password must be of maximum 100 Character",
      });
    }

    const findUser = await User.findOne({ email });

    if (findUser) {
      return res.status(403).json({
        message: "Email Already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName: fullName,
      email: email,
      password: hashedPassword,
    });

    if (newUser) {
      //generate jwt token
      generateToken(newUser._id, res);
      await newUser.save();

      return res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      return res.status(303).json({
        message: "Invalid User Data",
      });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    return res.status(401).json({
      message: "Internal Server Error",
    });
  };
};
export const login = (req, res) => {
  res.send("login Route");
};
export const logout = (req, res) => {
  res.send("logout Route");
};
