const User = require("../models/user");

const bcrypt = require("bcrypt");
const { createToken } = require("../utils/utils");

const register = async (req, res) => {
  const { name, email, password, image } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const duplicate = await User.findOne({ email }).exec();

  if (duplicate) {
    return res.status(409).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      image,
    });

    if (user) {
      res.status(201).json({ message: "User created successfully" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const user = await User.findOne({ email }).exec();

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const match = await bcrypt.compare(password, user.password);

  if (match) {
    const token = createToken(user._id);
    res.status(200).json({ message: "Login successful", token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getUserById = async (req, res) => {
  const loggedInUser = req.params.id;
  User.find({ _id: { $ne: loggedInUser } })
    .select("-password")
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    });
};

const sendFriendRequest = async (req, res) => {
  console.log(req.body);

  const { currentUserId, selectedUserId } = req.body;

  if (!req.body.currentUserId || !req.body.selectedUserId) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    await User.findByIdAndUpdate(selectedUserId, {
      $push: { friendRequest: currentUserId },
    });

    await User.findByIdAndUpdate(currentUserId, {
      $push: { sentFriendRequest: selectedUserId },
    });

    res.status(200).json({ message: "Friend request sent successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getFriendRequestsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId)
      .populate("friendRequest", "name image")
      .lean();

    const friendRequests = user?.friendRequest;

    res.status(200).json({ friendRequests });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const acceptFriendRequest = async (req, res) => {
  const { senderId, recepientId } = req.body;

  if (!senderId || !recepientId) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sender = await User.findById(senderId);
  const recepient = await User.findById(recepientId);

  if (!sender || !recepient) {
    return res.status(404).json({ message: "User not found" });
  }

  try {
    sender.friend.push(recepientId);
    recepient.friend.push(senderId);

    recepient.friendRequest = recepient.friendRequest.filter(
      (id) => id.toString() !== senderId.toString()
    );

    sender.sentFriendRequest = sender.sentFriendRequest.filter(
      (id) => id.toString() !== recepientId.toString()
    );

    await sender.save();
    await recepient.save();

    res.status(200).json({ message: "Friend request accepted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getAcceptedFriendsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate("friend", "name image");

    const acceptedFriends = user?.friend;
    res.status(200).json({ acceptedFriends });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const checkRequestSent = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId)
      .populate("sentFriendRequest", "name email image")
      .lean();
    const sentFriendRequests = user?.sentFriendRequest;
    res.json({ sentFriendRequests });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getFriends = async (req, res) => {
  try {
    const { userId } = req.params;

    User.findById(userId)
      .populate("friends")
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        const friendIds = user.friends.map((friend) => friend._id);

        res.status(200).json(friendIds);
      });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "internal server error" });
  }
}

module.exports = {
  register,
  login,
  getAllUsers,
  getUserById,
  sendFriendRequest,
  getFriendRequestsByUserId,
  acceptFriendRequest,
  getAcceptedFriendsByUserId,
  checkRequestSent,
  getFriends
};
