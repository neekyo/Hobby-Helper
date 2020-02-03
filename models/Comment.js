const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema(
	{
		author: { type: Schema.Types.ObjectId, ref: 'User' },
		body: String,
		category: String
		// maybe add time stamps, title, etc
	},
	{
		timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
	}
);

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
