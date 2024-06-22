const mongoose = require("mongoose");

const connectDB = () => {
  mongoose
    .connect(
      "mongodb+srv://anaskhalid658:hello@cluster0.qqxlfsm.mongodb.net/?retryWrites=true&w=majority"
    )
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.log(err, "Could not connect to MongoDB");
    });
};

module.exports = {
  connectDB
}