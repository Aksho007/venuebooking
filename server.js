const mongoose = require("mongoose");
const app = require("./app");

mongoose.connect(
  "mongodb://localhost:27017/booking",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err;
    console.log("Connected to MongoDB!!!");
  }
);
