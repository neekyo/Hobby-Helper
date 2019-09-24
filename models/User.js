const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, unique: true },
  password: { type: String },
  role: { type: String, enum: ['Admin', 'User', 'Guest'] },
  slackID: String,
  googleID: String,
  avatar: String,
  displayName: String,
  slackPic: String,
  googlePic: String,
  profileImage: {type: String, default: ""},
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
}); 

const User = mongoose.model("User", userSchema);
module.exports = User;