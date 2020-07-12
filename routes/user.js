const express = require('express');
const Post = require('../models/post');
const User = require('../models/user');
const requireLogin = require('../middleware/requireLogin');

const router = express.Router();

router.get('/user/:id', requireLogin, (req, res) => {
	User.findOne({ _id: req.params.id })
		.select('-password')
		.then((user) => {
			Post.find({ postedBy: req.params.id })
				.populate('postedBy', '_id name imageUrl')
				.exec((err, posts) => {
					if (err) {
						return res.status(422).json({ error: 'Server error' });
					}
					res.json({ user, posts });
				});
		})
		.catch((err) => {
			return res.status(404).json({ error: 'User not found' });
		});
});

router.get('/allusers', requireLogin, (req, res) => {
	User.find()
		.select('-password')
		.then((result) => {
			res.json({ result });
		})
		.catch((err) => {
			return res.status(404).json({ error: 'User not found' });
		});
});

router.put('/follow', requireLogin, (req, res) => {
	User.findByIdAndUpdate(
		req.body.followId,
		{
			$push: { followers: req.user._id },
		},
		{ new: true },
		(err, result) => {
			if (err) {
				return res.status(422).json({ error: 'Server is down' });
			}
			User.findByIdAndUpdate(
				req.user._id,
				{
					$push: { following: req.body.followId },
				},
				{ new: true }
			)
				.select('-password')
				.then((value) => {
					res.json(value);
				})
				.catch((error) => {
					return res.status(422).json({ error: 'server error' });
				});
		}
	);
});

router.put('/unfollow', requireLogin, (req, res) => {
	User.findByIdAndUpdate(
		req.body.unfollowId,
		{
			$pull: { followers: req.user._id },
		},
		{ new: true },
		(err, result) => {
			if (err) {
				return res.status(422).json({ error: 'Server is down' });
			}
			User.findByIdAndUpdate(
				req.user._id,
				{
					$pull: { following: req.body.unfollowId },
				},
				{ new: true }
			)
				.select('-password')
				.then((value) => {
					res.json(value);
				})
				.catch((error) => {
					return res.status(422).json({ error: 'server error' });
				});
		}
	);
});

router.put('/profileimg', requireLogin, (req, res) => {
	User.findByIdAndUpdate(
		req.body.postId,
		{
			$set: { imageUrl: req.body.imageUrl },
		},
		{ new: true }
	)
		.select('-password')
		.then((data) => {
			res.json({ data });
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ error: 'Server error' });
		});
});

router.post('/search', (req, res) => {
	let userPattern = new RegExp('^' + req.body.query);
	User.find({ name: { $regex: userPattern } })
		.select('_id email name imageUrl')
		.then((result) => {
			res.json({ result });
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ error: 'Server Error' });
		});
});

module.exports = router;
