var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

// this is basically tells passport how store user in session
passport.serializeUser(function(user, done){

// it basically means whenever you want to store a user in session serialze it by id
  done(null, user._id);
});

passport.deserializeUser(function(userId, done){
  User.findById(userId, function(err, user){
    if(err){
      return done(err);
    }
    return done(null, user);
  });
});

// so this allowe passport to store the user in the session or store the id in the session and retrieve the user whenever i need it thorough this stored id


// CONFIGURATION FOR THE STRATEGY
var config = {
  usernameField:'email',
  passwordField:'password',
  passReqToCallback: true
};


// CALLBACK FUNCTION FOR VALIDATION AND EMAIL EXISTENCE CHECKING
var callback = function(req, email, password, done){
  // VALIDATION
  req.checkBody('email','*invalid email').notEmpty().isEmail();
  req.checkBody('password','*PASSWORD IS EMPTY').notEmpty();
  req.checkBody('password','*password length must be greater than 4').isLength({min:4});

  var errors = req.validationErrors();
  if(errors){
    var messages = [];
    errors.forEach(function(error){
      messages.push(error.msg);
    });
    return done(null, false, req.flash('error', messages));
  }
// END OF VALIDATION


// USER CHECKING IF EXIST FALSE AND RETURN . IF DOESNOT EXIST CREATE AND SAVE THE USER IN DB
  User.findOne({email: email,}, (err, user) => {
    if(err){
      return done(err);
    }

    if(user){
      return done(null, false, {message:"email is already exist:"});
    }

    var newUser = new User();
    newUser.email = email;
    newUser.password = newUser.encryptPassword(password);
    newUser.save(function(err, result){
      if(err){
        return done(err);
      }

      return(done(null, newUser));
    });
  });
// END OF USER CHECKING

};
// END OF CALLBACK FUNCTION



var callback2 = function(req, email, password, done){
  // VALIDATION
  req.checkBody('email','*invalid email').notEmpty().isEmail();
  req.checkBody('password','*PASSWORD IS EMPTY').notEmpty();
  req.checkBody('password','*password length must be greater than 4').isLength({min:4});

  var errors = req.validationErrors();
  if(errors){
    var messages = [];
    errors.forEach(function(error){
      messages.push(error.msg);
    });
    return done(null, false, req.flash('error', messages));
  }
// END OF VALIDATION


// USER CHECKING IF EXIST FALSE AND RETURN . IF DOESNOT EXIST CREATE AND SAVE THE USER IN DB
  User.findOne({email: email,}, (err, user) => {
    if(err){
      return done(err);
    }

    if(!user){
      return done(null, false, {message:"email DOESNOT exist"});
    }
    if(!user.validatePassword(password)){
      return done(null, false, {message:"wrong password"});
    }

    return done(null, user);

  });
// END OF USER CHECKING

};

// CREATION OF LOCAL STRATEGY WITH CONFIG AND CALLBACK DEFINED ABOVE
passport.use('local.signup',new LocalStrategy(config, callback));

passport.use('local.signin',new LocalStrategy(config, callback2));
