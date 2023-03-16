import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  // hashing and salting the given password using bcrypt
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  req.body.password = hashedPassword;

  // creating a new user based on userSchema
  const newUser = new User(req.body);

  const { username } = req.body;

  // saving the user into the database
  try {
    // checking the user is already registered or not
    const registeredUser = await User.findOne({ username });
    if (registeredUser) {
      res
        .status(400)
        .json({ message: "username you entered already exists..." });
    }
    const user = await newUser.save();

    // generates token using jwt
    const token = jwt.sign(
      {
        username: user.username,
        id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  // getting the credentials from the user
  const { username, password } = req.body;

  // logging in the user by checking the credentials
  try {
    // checks the user exists or not in the database using username
    const user = await User.findOne({ username: username });

    //   if the user exists
    if (user) {
      // checking the given password with hashed password in the user database
      const isMatch = await bcrypt.compare(req.body.password, user.password);

      if (!isMatch) {
        res.status(400).json("Wrong Password");
      } else {
        // generates token using jwt
        const token = jwt.sign(
          {
            username: user.username,
            id: user._id,
          },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        res.status(200).json({ user, token });
      }
    } else {
      res.status(404).json("User does not exists");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
