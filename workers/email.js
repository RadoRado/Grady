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

module.exports = function (input, callback) {
  var
    payload = JSON.parse(input),
    mailOptions = {
      from: "Grady the Grader " + localConfig.username,
      to: payload.data.to,
      subject: payload.data.subject,
      text: payload.data.message,
      html: payload.data.message
    };

  console.log(payload);

  transporter.sendMail(mailOptions, function(error, info) {
    callback(error, info);
  });
}
