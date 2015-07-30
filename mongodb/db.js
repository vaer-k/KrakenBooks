var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var debug = require('debug')('db');

var db = mongoose.connect('mongodb://admin:admin@ds037272.mongolab.com:37272/mavdb1');

// Start connection and confirm with log
mongoose.connection.on("open", function(){
  console.log("Connected to MongoDB")
})

var Schema = mongoose.Schema;

// User
var userSchema = new Schema({
   local: {
      email: String,
      password: String
   },
   facebook: {
      id: String,
      token: String,
      email: String,
      name: String
   }
 })

userSchema.methods.generateHash = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password){
  return bcrypt.compareSync(password, this.local.password);
};

var User = mongoose.model('user', userSchema);

// Functions go here
module.exports = {
  find: function(){
    Book.find({}, function(err, book){
      if (err) { console.log("Error:", err) } else {
      console.log("Books:", book);
      }
    })
  },
  add: function(item){
    var book1 = new Book(bookinfo).save;
    book1.save(function(err, data){
      if(err){ console.log("Error:", err) } else {
        console.log("Success: ", data)
      }
    })
  },
  remove: function(book){
    book.remove(function(err, book){
      if (err) { console.log("Error with removal") } else {
        Book.findByTitle
      }
    })
  }
};
