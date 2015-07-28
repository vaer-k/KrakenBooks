var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  var data = req.body;

  //gather mail options from body
  var mailOptions = {
    from: data.from, // sender address
    to: data.to, // list of receivers
    subject: data.subject, // Subject line
    text: data.text, // plaintext body
    // html: data.html // html body
  };
  console.log(mailOptions);

  //create transporter object w/ mailgun credentials
  var transporter = nodemailer.createTransport({
    service: 'Mailgun',
    auth: {
      user: 'omnibooks@sandboxd3dc8fa818a14352baca775bf44944f7.mailgun.org',
      pass: 'makersquare'
    }
  });

  transporter.sendMail(mailOptions, function(error) {
    if (error) {
      console.log(error);
      res.send("error");
    } else {
      console.log("Message sent");
      res.send("sent");
    }
  });
  
});

module.exports = router;
