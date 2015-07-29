var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

app.use(passport.initialize());
app.use(passport.session());
var router = express.Router();

router.post('/',
  passport.authenticate('local'),
  function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.

    /* SCRAP
    // TODO do something once authenticated
    // Example:
    // res.redirect('/users/' + req.user.username);
    */

});

module.exports = router;
