const express         = require('express');
const router          = express.Router();
const User            = require('../models/User');
const bcrypt          = require('bcryptjs');
const passport        = require("passport");
const magicUploadTool = require('../config/cloudinary-settings');

router.get('/signup', (req, res, next)=>{
    res.render('user-views/signup')
})

router.post('/signup',magicUploadTool.single('the-image-input-name') ,(req, res, next)=>{
    const username = req.body.theUsername;
    const password = req.body.thePassword;

    const salt  = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    User.create({
        username: username,
        password: hash
    })
    let userObj = {};
    userObj.username = username;
    userObj.password = hash;

    if(req.file){
        userObj.profileImage = req.file.url
    }


    User.create(userObj)
    .then(()=>{
        res.redirect('/')
    })
    .catch((err)=>{
        next(err)
    })
})

router.get("/login", (req, res, next) => {
    res.render("user-views/login", { "error": req.flash("error") });
  });
  
router.post("/login", passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}));

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

router.get("/profile", (req, res, next) => {
  res.render("user-views/profile", { "error": req.flash("error") });
});

router.get('/secret', (req, res, next)=>{
    if(req.session.currentuser){
        res.render('user-views/secret', {theUser: req.session.currentuser})
    } else{
        res.redirect('/')
    }
})

router.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email"
      ]
    })
  );

router.get(
    "/google/callback",
    passport.authenticate("google", {
      successRedirect: "/profile",
      failureRedirect: "/" 
    })
  );

router.get("/auth/slack/", passport.authenticate("slack"));
router.get(
  "/auth/slack/callback",
  passport.authenticate("slack", {
    successRedirect: "/profile",
    failureRedirect: "/" // here you would navigate to the classic login page
  })
);

router.post('/delete-my-account', (req, res, next) => {
  User.findByIdAndDelete(req.user._id)
    .then(console.log("deleted"))
    .catch(err => next(err))
})

router.get("/movies", (req, res, next) => {
  res.render("chatpage", { "error": req.flash("error") });
});

module.exports = router;