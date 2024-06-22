const express = require("express")
const router = express.Router()

const messageController = require("../controllers/messageController")

// router.post("/send-message", messageController.sendMessage)
router.get("/u/:userid", messageController.getUserDetails) // endpoint to get the header details
router.get("/:senderId/:recepientId", messageController.getMessages) // endpoint to get the user messages

router.post("/delete-message", messageController.deleteMessage)

module.exports = router