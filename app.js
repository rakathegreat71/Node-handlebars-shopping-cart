var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHbs = require("express-handlebars");
var mongoose = require('mongoose');
var index = require('./routes/index');
var users = require('./routes/users');
var app = express();
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
var mongoStore = require('connect-mongo')(session);

// mongoose setup
mongoose.connect("mongodb://localhost:27017/shopping");
var db = mongoose.connection;
db.on('error', console.error.bind(console,"CONNECTION ERROR:"));
db.once('open', function(){
  console.log("we are connected to mongodb");
});

// view engine setup
app.engine('.hbs', expressHbs({defaultLayout: "layout", extname:'.hbs'}));
require('./config/passport');
// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
// resave:if this is set true, session will be saved on server for each request no matter
// if something changed or not, so i am setting it false because i dont want to do all the time
//saveUninitialized: this means if this is set to true the session will be stored on the server even though it might not have been initialized, nothing has been added there
app.use(session({
  secret: 'mySecret', 
  resave:false, 
  saveUninitialized: false,
  store: new mongoStore({ mongooseConnection: mongoose.connection}),
  // 30 minutes
  cookie:{maxAge: 30 * 60 * 1000}
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));


app.use(function(req, res, next){
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  if(req.session.cart && (req.session.cart.totalQty > 0)){
    res.locals.cart_items = req.session.cart_items;
    // console.log(req.session.cart_items)
    res.locals.isCartEmpty = res.locals.cart_items.length < 0?true:false;
  }else
  res.locals.isCartEmpty = true
  next();
});
app.use('/users', users);

app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  // error.hbs file will be rendered if invalid route entered by the user
  res.render('error');
});

module.exports = app;
