const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const loginSchema = new mongoose.Schema({
  loginEmail: {
    type: String,
    required: true,
    unique: true,
  },
  loginPassword: {
    type: String,
    required: true,
  },
});

loginSchema.pre("save", async function (next) {
  this.loginPassword = await bcrypt.hash(this.loginPassword, 8);
  next();
});

const user = new mongoose.model("user", loginSchema);

module.exports = user;
