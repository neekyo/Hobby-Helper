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
  profileImage: {type: String, default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyAV7m0L9Rc5P4AMI64BSir0BYOvkPU0vNSnSx0-6vhYDyS9X7"},
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
}); 

const User = mongoose.model("User", userSchema);
module.exports = User;