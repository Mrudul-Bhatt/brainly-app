const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const postSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		body: { type: String, required: true },
		imageUrl: { type: String, required: true },
		likes: [{ type: ObjectId, ref: 'User' }],
		dateCreated: { type: String },
		comments: [
			{
				text: { type: String },
				likes: [{ type: ObjectId, ref: 'User' }],
				postedBy: {
					type: ObjectId,
					ref: 'User',
				},
			},
		],
		postCollection: [{ type: ObjectId, ref: 'User' }],
		postedBy: { type: ObjectId, ref: 'User' },
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Post', postSchema);
