const express = require("express");
const router = express.Router();
const userController = require("../controllers/user")

router.get("/", userController.getAllUsers)
router.get("/:id", userController.getUserById)
router.get("/friend-requests/:userId", userController.getFriendRequestsByUserId)
router.get("/friends/:userId", userController.getAcceptedFriendsByUserId)
router.post("/register", userController.register)
router.post("/login", userController.login)
router.post("/friend-request", userController.sendFriendRequest)
router.post("/accept-friend-request", userController.acceptFriendRequest)
router.get("/friend-request/sent/:userId", userController.checkRequestSent)
router.get("/friends/:userId", userController.getFriends)

module.exports = router