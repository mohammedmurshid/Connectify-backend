import User from "../models/userModel.js";
import bcrypt from "bcrypt";

export const registerUser = async (req, res) => {
  // getting the credentials from the user
  const { username, password, firstname, lastname } = req.body;

  // hashing and salting the given password using bcrypt
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // creating a new user based on userSchema
  const newUser = new User({
    username,
    password: hashedPassword,
    firstname,
    lastname,
  });

  // saving the user into the database
  try {
    await newUser.save();
    res.status(200).json(newUser);
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

      isMatch
        ? res.status(200).json(user)
        : res.status(400).json("Wrong Password");
    } else {
      res.status(404).json("User does not exists");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
