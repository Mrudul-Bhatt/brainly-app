const jwt = require('jsonwebtoken');

const { JWT_SECRET_KEY } = require('../config/dev');
const User = require('../models/user');

module.exports = (req, res, next) => {
	const { authorization } = req.headers;
	if (!authorization) {
		return res.status(401).json({ message: 'you must be logged in' });
	}
	const token = authorization.replace('Bearer ', '');
	jwt.verify(token, JWT_SECRET_KEY, (err, payload) => {
		if (err) {
			return res.status(401).json({ message: 'you must be logged in' });
		}

		const { _id } = payload;
		User.findById(_id)
			.then((userData) => {
				req.user = userData;
				next();
			})
			.catch((error) => console.log(error));
	});
};
