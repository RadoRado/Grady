var
  nodemailer = require("nodemailer"),
  localConfig = require("./config"),
  transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: localConfig.username,
          pass: localConfig.password
      }
  });;

module.exports = function (payload, callback) {
  var
    mailOptions = {
      from: "Grady the Grader " + localConfig.username,
      to: payload.to,
      subject: payload.subject,
      text: payload.message,
      html: payload.message
    };

  transporter.sendMail(mailOptions, function(error, info) {
    callback(error, info);
  });
}
