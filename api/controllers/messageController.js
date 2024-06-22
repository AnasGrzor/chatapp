const User = require("../models/user");
const Message = require("../models/message");

const getUserDetails = async (req, res) => {
  try {
    const { userid } = req.params;

    const recepientId = await User.findById(userid).select("-password");

    res.status(200).json({ recepientId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

const getMessages = async (req, res) => {
  try {
    const { senderId, recepientId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: senderId, receiverId: recepientId },
        { senderId: recepientId, receiverId: senderId },
      ],
    }).populate("senderId", "_id name");

    res.json(messages);
    // console.log("messages", messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const {messages} = req.body
    console.log("messages", messages);

    if(!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ message: "Invalid request" });
    }

    await Message.deleteMany({_id: {$in: messages}});

    res.status(200).json({ message: "Messages deleted successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
}

module.exports = { getUserDetails, getMessages, deleteMessage };
