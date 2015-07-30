var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var cors = require('cors');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

/* SCRAP
var nodemailer = require('nodemailer');
var hbs = require('nodemailer-express-handlebars');
var exphbs  = require('express-handlebars');
*/

// ****************** ROUTES ************************
// MongoDB routes
var bookServices = require('./routes/bookServices');
var otherServices = require('./routes/otherServices');
var userServices = require('./routes/userServices');

// Mail routes
var sendMail = require('./routes/sendMail');

// Authentication routes
var login = require('./routes/login');

// Search routes
var bookDetail = require('./routes/bookDetail');
var bookInfo = require('./routes/bookInfo');
// **************************************************

// **************** AUTH configure ******************
// TODO write findById to pull user from db by ID
var findById = function() {};
// TODO write findByUsername to access db and check if user exists with pw
var findByUsername = function() {};

// Passport session setup
passport.deserializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  findById(id, function(err, user) {
    done(err, user);
  });
});

// Configure local Strategy
passport.use(new LocalStrategy(
  function(username, password, done) {
    // asynchronous verification
    process.nextTick(function() {
      findByUsername(username, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false, {message: 'Unknown user ' + username}); }
        if (user.password !== password) { return done(null, false, { message: 'Invalid password' }); }
        return done(null, user);
      });
    });
  }
));
// **************************************************

var app = express();

// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
// add ins for auth
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(session({
  secret: "OurSuperSecret"
}));

app.use('/bookDetail', bookDetail);
app.use('/bookInfo', bookInfo);
app.use('/sendMail', sendMail);
app.use('/bookServices', bookServices);
app.use('/otherServices', otherServices); // handles 'other' items
app.use('/userServices', userServices);
app.use('/login', login);

// ********************* AUTH ***********************
// **************************************************


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.send(err);
});

module.exports = app;
