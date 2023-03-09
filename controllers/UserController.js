import User from "../models/userModel.js";
import bcrypt from "bcrypt";

// get a user
export const getUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id);

    if (user) {
      const { password, ...otherDetails } = user._doc;
      res.status(200).json(otherDetails);
    } else {
      res.status(404).json("No such user exists");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// update a user
export const updateUser = async (req, res) => {
  const id = req.params.id;
  const { currentUserId, currentUserAdminStatus, password } = req.body;

  if (id === currentUserId || currentUserAdminStatus) {
    try {
      if (password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(password, salt);
      }
      const user = await User.findByIdAndUpdate(id, req.body, { new: true });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("Access Denied! You can only update your own profile");
  }
};

// delete user
export const deleteUser = async (req, res) => {
  const id = req.params.id;
  const { currentUserId, currentUserAdminStatus } = req.body;

  if (id === currentUserId || currentUserAdminStatus) {
    try {
      await User.findByIdAndDelete(id);
      res.status(200).json("User deleted successfully");
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("Access Denied! You can only delete your own profile");
  }
};

// follow a user
export const followUser = async (req, res) => {
  const id = req.params.id;

  const { currentUserId } = req.body;

  if (currentUserId === id) {
    res.status(403).json("Action forbidder");
  } else {
    try {
      const userToBeFollowed = await User.findById(id);
      const followingUser = await User.findById(currentUserId);

      if (!userToBeFollowed.followers.includes(currentUserId)) {
        await userToBeFollowed.updateOne({
          $push: { followers: currentUserId },
        });
        await followingUser.updateOne({
          $push: { following: id },
        });
        res.status(200).json("Started following user");
      } else {
        res.status(403).json("You already following this person");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
};

// unfollow a user
export const unFollowUser = async (req, res) => {
  const id = req.params.id;

  const { currentUserId } = req.body;

  if (currentUserId === id) {
    res.status(403).json("Action forbidder");
  } else {
    try {
      const userToBeUnFollowed = await User.findById(id);
      const unFollowingUser = await User.findById(currentUserId);

      if (userToBeUnFollowed.followers.includes(currentUserId)) {
        await userToBeUnFollowed.updateOne({
          $pull: { followers: currentUserId },
        });
        await unFollowingUser.updateOne({
          $pull: { following: id },
        });
        res.status(200).json("Unfollowed user");
      } else {
        res.status(403).json("You are not following this person");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
};
