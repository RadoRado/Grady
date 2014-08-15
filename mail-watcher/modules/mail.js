var
  mongoose = require('mongoose'),
  mailSchema = mongoose.Schema({
    mailId: String,
    subject: String,
    body: String,
    from: String,
    fromName: String,
    receivedDate: Date,
    attachments: [{
      filename: String,
      contents: String
    }]
  }),
  Mail = mongoose.model('Mail', mailSchema);

module.exports = Mail;
