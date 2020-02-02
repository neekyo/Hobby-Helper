require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/User');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const SlackStrategy = require('passport-slack').Strategy;

mongoose.Promise = Promise;
mongoose
	.connect(process.env.MONGODB_URI, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true
	})
	.then(() => {
		console.log('Connected to Mongo!');
	})
	.catch((err) => {
		console.error('Error connecting to mongo', err);
	});

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
	session({
		secret: 'our-passport-local-strategy-app',
		resave: true,
		saveUninitialized: true
	})
);

passport.serializeUser((user, cb) => {
	cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
	User.findById(id, (err, user) => {
		if (err) {
			return cb(err);
		}
		cb(null, user);
	});
});

app.use(flash());
passport.use(
	new LocalStrategy((username, password, next) => {
		User.findOne({ username }, (err, user) => {
			if (err) {
				return next(err);
			}
			if (!user) {
				return next(null, false, { message: 'Incorrect username' });
			}
			if (!bcrypt.compareSync(password, user.password)) {
				return next(null, false, { message: 'Incorrect password' });
			}

			return next(null, user);
		});
	})
);
app.use(passport.initialize());
app.use(passport.session());

// Express View engine setup
app.use(
	require('node-sass-middleware')({
		src: path.join(__dirname, 'public'),
		dest: path.join(__dirname, 'public'),
		sourceMap: true
	})
);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

console.log(path.join(__dirname, 'public'));

// Default value for title local
app.locals.title = 'Hobby Helper';

app.use(
	session({
		secret: 'shhh-super-sectet-key',
		cookie: { maxAge: 60000 },
		resave: true,
		saveUninitialized: true,
		store: new MongoStore({
			mongooseConnection: mongoose.connection,
			ttl: 24 * 60 * 60 // 1 day
		})
	})
);

app.use((req, res, next) => {
	if (req.user) req.user.isAdmin = req.user.role === 'Admin';
	res.locals.currentUser = req.user;
	next();
});

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: '/google/callback'
		},
		(accessToken, refreshToken, profile, done) => {
			console.log('Google account details:', profile);

			User.findOne({ googleID: profile.id })
				.then((user) => {
					if (user) {
						done(null, user);
						return;
					}

					let theImage = '';

					if (profile.photos) {
						theImage = profile.photos[0].value;
					}

					User.create({
						googleID: profile.id,
						isAdmin: false,
						googlePic: theImage,
						username: profile._json.name
					})
						.then((newUser) => {
							done(null, newUser);
						})
						.catch((err) => done(err));
				})
				.catch((err) => done(err));
		}
	)
);

passport.use(
	new SlackStrategy(
		{
			clientID: process.env.SLACK_CLIENT_ID,
			clientSecret: process.env.SLACK_CLIENT_SECRET,
			callbackURL: '/auth/slack/callback'
		},
		(accessToken, refreshToken, profile, done) => {
			// to see the structure of the data in received response:
			console.log('Slack account details:', profile);

			User.findOne({ slackID: profile.id })
				.then((user) => {
					if (user) {
						done(null, user);
						return;
					}

					User.create({
						slackID: profile.id,
						displayName: profile.displayName,
						slackPic: profile.user.image_512
					})
						.then((newUser) => {
							console.log(newUser);
							done(null, newUser);
						})
						.catch((err) => done(err)); // closes User.create()
				})
				.catch((err) => done(err)); // closes User.findOne()
		}
	)
);

function search() {
	var name = document.getElementById('searchForm').elements['searchItem'].value;
	var pattern = name.toLowerCase();
	var targetId = '';

	var divs = document.getElementsByClassName('col-sm-3');
	for (var i = 0; i < divs.length; i++) {
		var para = divs[i].getElementsByTagName('a');
		var index = para[0].innerText.toLowerCase().indexOf(pattern);
		if (index != -1) {
			targetId = divs[i].parentNode.id;
			document.getElementById(targetId).scrollIntoView();
			break;
		}
	}
}

const user = require('./routes/user-routes');
app.use('/', user);

const index = require('./routes/index');
app.use('/', index);

module.exports = app;
