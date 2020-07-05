const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	imageUrl: {
		type: String,
		default: 'noimage',
	},
	followers: [{ type: ObjectId, ref: 'User' }],
	following: [{ type: ObjectId, ref: 'User' }],
});

module.exports = mongoose.model('User', userSchema);

//'https://res.cloudinary.com/dxediwgyn/image/upload/v1591847266/user-alt-512_jkdt8h.png'
