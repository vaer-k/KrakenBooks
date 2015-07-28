var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var userSchema = mongoose.schema({ name: String });
userSchema.methods.auth = function() {
  // do auth stuff
};
var User = mongoose.model('User', userSchema);

/* SCRAP example of new user instantiation, insertion, and subsequent search

var vincent = new User({ name: 'Vincent'});
vincent.save(function (err, vincent) {
  if (err) return console.error(err);
  vincent.auth();
});

User.find({ name: /^Vincent/ }, callback);

*/
