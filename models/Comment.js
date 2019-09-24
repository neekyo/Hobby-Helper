const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const commentSchema = new Schema ({
  author: {type: Schema.type.ObjectId, ref: "User"},
  body: String,
  // maybe add time stamps, title, etc
} , {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Comments = mongoose.model("Comments", commentSchema);
module.exports = Comments;