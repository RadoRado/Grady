/* global require, console */
'use strict';

var
  config = require('./config'),
  mailListener = require('./maillistener'),
  mongoose = require('mongoose'),
  redis = require("redis"),
  Mail = require('../shared/mail')(mongoose),
  Queuer = require('../shared/queuer')(redis),
  StringDecoder = require('string_decoder').StringDecoder,
  Q = require("q");

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
        subject: "Nothing to grade",
        to: mail.from[0].address,
        message: 'FYI - Nothing was attached in the email you sent.'
      }
    });
    return;
  }

  storeMail(mail)
    .then(function(mailRecordId) {
      addTaskToQueue({
        type: 'grade',
        data: {
          status: 'UNGRADED',
          fetchFromId: mailRecordId
        }
      });
    });
}

function addTaskToQueue(task) {
  console.log('Adding to task queue');
  console.log(task);
  Queuer.addTask(task);
}

function storeMail(mail) {
  var
    defered = Q.defer(),
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

  received.save(function(err, savedModel) {
    if(err) {
      console.log('Error on saving mail model!');
      console.log(err);
      defered.reject(err);
    }

    console.log('Mail saved to database.');
    defered.resolve(savedModel._id);
  });

  return defered.promise;
}

mailListener.start();
