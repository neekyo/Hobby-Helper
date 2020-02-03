const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Comment = require('../models/Comment');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const magicUploadTool = require('../config/cloudinary-settings');

router.get('/signup', (req, res, next) => {
	res.render('user-views/signup');
});

router.post('/signup', magicUploadTool.single('photo'), (req, res, next) => {
	console.log('signing up ))))))))) ', req.file, ' (((((((( ', req.body);
	const username = req.body.theUsername;
	const password = req.body.thePassword;
	const role = req.body.theRole;
	const salt = bcrypt.genSaltSync(10);
	const hash = bcrypt.hashSync(password, salt);

	User.create({
		username: username,
		password: hash,
		role: role
	});
	let userObj = {};
	userObj.username = username;
	userObj.password = hash;
	userObj.role = role;

	if (req.file) {
		userObj.profileImage = req.file.url;
	}

	User.create(userObj)
		.then(() => {
			res.redirect('/login');
		})
		.catch((err) => {
			res.redirect('/login');
			next(err);
		});
});

router.get('/login', (req, res, next) => {
	res.render('user-views/login', { error: req.flash('error') });
});

router.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/profile',
		failureRedirect: '/login',
		failureFlash: true,
		passReqToCallback: true
	})
);

router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

router.get('/profile', (req, res, next) => {
	if (req.user) {
		res.render('user-views/profile', { error: req.flash('error') });
	} else {
		res.redirect('/login');
	}
});

router.get('/secret', (req, res, next) => {
	if (req.user.isAdmin) {
		res.render('user-views/secret', { theUser: req.session.currentuser });
	} else {
		res.redirect('/');
	}
});

router.get(
	'/auth/google',
	passport.authenticate('google', {
		scope: [ 'https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email' ]
	})
);

router.get(
	'/google/callback',
	passport.authenticate('google', {
		successRedirect: '/profile',
		failureRedirect: '/'
	})
);

router.get('/auth/slack/', passport.authenticate('slack'));
router.get(
	'/auth/slack/callback',
	passport.authenticate('slack', {
		successRedirect: '/profile',
		failureRedirect: '/'
	})
);

router.post('/delete-my-account', (req, res, next) => {
	User.findByIdAndDelete(req.user._id).then(console.log('deleted')).catch((err) => next(err));
	res.redirect('/');
});

router.get('/categories/:theCategory', (req, res, next) => {
	let cat = req.params.theCategory;
	Comment.find({ category: cat })
		.then((theComments) => {
			res.render('chatpage', { error: req.flash('error'), theCat: cat, comments: theComments });
		})
		.catch((err) => next(err));
});

router.post('/comments', (req, res, next) => {
	let author = req.user.id;
	let body = req.body.body;
	let category = req.body.category;

	Comment.create({
		author: author,
		body: body,
		category: category
	})
		.then((theComments) => {
			res.json(theComments);
		})
		.catch((err) => next(err));
});

router.get('/api/comments/:theCategory', (req, res, next) => {
	let cat = req.params.theCategory;
	Comment.find({ category: cat })
		.populate('author')
		.then((theComments) => {
			res.json(theComments);
		})
		.catch((err) => next(err));
});

router.post('/delete-post/{this._id}'), (req, res, next) => {};

module.exports = router;
