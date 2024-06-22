const express = require("express");
const bodyParser = require("body-parser");

const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const cors = require("cors");
const jwt = require("jsonwebtoken");
const morgan = require("morgan");
const Message = require("./models/message");
const multer = require("multer");
const connectDB = require("./utils/dbConn");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "files/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer(
  { storage: storage, limits: { fileSize: 1024 * 1024 * 5 } },
  fileFilter
);

const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(morgan("dev"));

// Serve static files from the "files" directory
app.use('/api/files', express.static('files'));

app.use("/api/users", require("./routes/user"));
app.use("/api/messages", require("./routes/messageRoute"));

app.get("/", (req, res) => {
  res.send("Hello");
});

app.post("/messages", upload.single("imageFile"), async (req, res) => {
  console.log(req.file);
  try {
    const { senderId, recepientId, messageText, messageType } = req.body;
    const newMessage = new Message({
      senderId,
      receiverId: recepientId,
      message: messageText,
      messageType,
      timeStamp: new Date(),
      imageUrl: messageType === "image" ? req.file.path : null,
    });

    await newMessage.save();

    res.status(200).json({
      message: "Message sent successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.listen(port, () => {
  connectDB.connectDB();
  console.log(`Listening on port ${port}`);
});
