var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var csrfProtection = csrf();
var passport = require('passport');


router.use(csrfProtection);
router.get('/profile', isLoggedIn, function(req, res){
  res.render('users/profile');
});
router.get('/logout', function(req, res){
   req.logout();

  console.log("user logged out:");
  res.redirect('/');
});



// ALL THE Routes AFTER THIS MIDDLEWARE WILL BE AFFECTED AND COULDN'T BE ACCESSED AFTER LOGIN
router.use("/", notLoggedIn, function(req, res, next){
  next();
})

/* GET users listing. */
router.get('/signup', function(req, res, next) {
  // THIS IS THE VALIDATION ERROR PART
  // GETTING ERROR ARRAY IN MESSAGES
  var messages = req.flash('error');

  // PASSING ERROR MESSAGES TO THE SIGNUP.HBS PAGE
  res.render('users/signup',{csrfToken: req.csrfToken(), messages: messages, hasErrors:messages.length > 0});
  // END OF VALIDATION
});

router.get('/signin', function(req, res, next) {
  // THIS IS THE VALIDATION ERROR PART
  // GETTING ERROR ARRAY IN MESSAGES
  var messages = req.flash('error');

  // PASSING ERROR MESSAGES TO THE SIGNUP.HBS PAGE
  res.render('users/signin',{csrfToken: req.csrfToken(), messages: messages, hasErrors:messages.length > 0});
  // END OF VALIDATION
});


// THIS WILL EXECUTE LOCAL-STRATEGY DEFINED IN PASSPORT.JS FILE IF FORM SUBMITTED IN SIGNUP.HBS PAGE
router.post('/signup', passport.authenticate('local.signup',{successRedirect:'profile', failureRedirect:"signup", failureFlash: true}));
router.post('/signin', passport.authenticate('local.signin',{successRedirect:'profile', failureRedirect:"signin", failureFlash: true}));






function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}

function notLoggedIn(req, res, next){
  if(!req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}

module.exports = router;
