const express = require('express');
const Post = require('../models/post');
const requireLogin = require('../middleware/requireLogin');

const router = express.Router();

router.get('/allpost', requireLogin, (req, res) => {
	Post.find()
		.populate('postedBy', '_id name imageUrl')
		.populate('comments.postedBy', '_id name')
		.then((posts) => {
			res.json({ posts });
		})
		.catch((error) => {
			console.log(error);
			res.status(500).json({ error: 'Server is down, try again later' });
		});
});

router.get('/allsubpost', requireLogin, (req, res) => {
	Post.find({ postedBy: { $in: req.user.following } })
		.populate('postedBy', '_id name imageUrl')
		.populate('comments.postedBy', '_id name')
		.then((posts) => {
			res.json({ posts });
		})
		.catch((error) => {
			console.log(error);
			res.status(500).json({ error: 'Server is down, try again later' });
		});
});

router.get('/mypost', requireLogin, (req, res) => {
	Post.find({ postedBy: req.user._id })
		.populate('postedBy', '_id name imageUrl')
		.populate('comments.postedBy', '_id name')
		.then((mypost) => res.json({ mypost }))
		.catch((error) => {
			console.log(error);
			res.status(500).json({ error: 'Server is down, try again later' });
		});
});

router.put('/like', requireLogin, (req, res) => {
	Post.findByIdAndUpdate(
		req.body.postId,
		{
			$push: { likes: req.user._id },
		},
		{
			new: true,
		}
	)
		.populate('comments.postedBy', '_id name')
		.populate('postedBy', '_id name imageUrl')
		.exec((err, result) => {
			if (err) {
				return res.status(422).json({ error: err });
			} else {
				res.json(result);
			}
		});
});

router.put('/unlike', requireLogin, (req, res) => {
	Post.findByIdAndUpdate(
		req.body.postId,
		{
			$pull: { likes: req.user._id },
		},
		{
			new: true,
		}
	)
		.populate('comments.postedBy', '_id name')
		.populate('postedBy', '_id name imageUrl')
		.exec((err, result) => {
			if (err) {
				return res.status(422).json({ error: err });
			} else {
				res.json(result);
			}
		});
});

router.put('/comments', requireLogin, (req, res) => {
	const comment = {
		text: req.body.text,
		postedBy: req.user._id,
	};

	Post.findByIdAndUpdate(
		req.body.postId,
		{
			$push: { comments: comment },
		},
		{
			new: true,
		}
	)
		.populate('comments.postedBy', '_id name')
		.populate('postedBy', '_id name imageUrl')
		.exec((err, result) => {
			if (err) {
				return res.status(422).json({ error: err });
			} else {
				res.json(result);
			}
		});
});

router.delete('/deletepost', requireLogin, (req, res) => {
	Post.findOne({ _id: req.body.postId })
		.populate('comments.postedBy', '_id name')
		.populate('postedBy', '_id name imageUrl')
		.exec((err, post) => {
			if (err || !post) {
				return res.status(422).json({ error: err });
			}
			if (post.postedBy._id.toString() === req.user._id.toString()) {
				post
					.remove()
					.then((result) => {
						res.json({ message: 'Post deleted!', result });
					})
					.catch((error) => {
						res.status(500).json({ error: 'Server is down, try again later' });
						console.log(error);
					});
			}
		});
});

router.post('/createpost', requireLogin, (req, res) => {
	const { title, body, imageUrl } = req.body;
	if (!title || !body || !imageUrl) {
		return res.status(422).json({ error: 'Please enter all fields' });
	}
	//baring from storing password in req.user
	req.user.password = undefined;

	const newPost = new Post({
		title,
		body,
		imageUrl,
		postedBy: req.user,
	});

	newPost
		.save()
		.then((createdPost) => {
			res.json({ createdPost });
		})
		.catch((error) => {
			console.log(error);
			res.status(500).json({ error: 'Server is down, try again later' });
		});
});

module.exports = router;
