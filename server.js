/* global require, console */
'use strict';

var
  config = require('./config'),
  mailListener = require('./modules/maillistener'),
  Mail = require("./modules/mail"),
  mongoose = require('mongoose'),
  StringDecoder = require('string_decoder').StringDecoder;

mongoose.connect(config.mongoConnectionString);

mailListener.on('server:connected', function() {
  console.log('imapConnected');
});

mailListener.on('server:disconnected', function() {
  console.log('imapDisconnected');
});

mailListener.on('error', function(err){
  console.log(err);
});

mailListener.on('mail', actOnNewEmail);


function actOnNewEmail(mail) {
  if(!mail.attachments) {
    addTaskToQueue({
      type: 'email',
      data: {
        to: mail.from[0].address,
        message: 'FYI - Nothing was attached in the email you sent.'
      }
    });
    return;
  }

  storeMail(mail);
}

function addTaskToQueue(task) {
  console.log('Should add task to queue');
  console.log(task);
}

function storeMail(mail) {
  var
    attachments = [],
    received = {};

  mail.attachments.forEach(function(attachment) {
    var decoder = new StringDecoder('utf8');

    attachments.push({
      filename: attachment.fileName,
      contents: decoder.write(attachment.content)
    });
  });

  received = new Mail({
    mailId: mail.messageId,
    subject: mail.subject,
    body: mail.text,
    from: mail.from[0].address,
    fromName: mail.from[0].name,
    receivedDate: new Date(Date.parse(mail.date)),
    attachments: attachments
  });

  received.save(function(err) {
    if(err) {
      console.log('Error on saving mail model!');
      console.log(err);
    }

    console.log('Mail saved to database.');
  });
}

mailListener.start();
