var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var user = require('mongoose').model('user');

module.exports = function(){
  passport.use(new localStrategy(function(username, password, done){
    //findOne is the function that finds the user
    User.findOne({username:username}, function(err, user){
      if(err){
        return done(err);
      }
      if(!user){
        return done(null, false, {message: 'Unknown User'});
      }
      if(!user.authenticate(password)){
        return done(null, false, {message: 'Invalid Password'});
      }
      return done(null, user);
    });
  }));
};