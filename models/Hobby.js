const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const hobbySchema = new Schema ({
  author: {type: Schema.type.ObjectId, ref: "User"},
  body: String,
  picture: String, // configure cloudinary image upload
  comments: [{type: Schema.type.ObjectId, ref: "Comment"}]
} , {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Hobby = mongoose.model("Hobby", hobbySchema);
module.exports = Hobby;