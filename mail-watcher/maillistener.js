var
  MailListener = require("mail-listener2"),
  config = require("./config"),
  mailListener = new MailListener({
    username: config.username,
    password: config.password,
    host: config.host,
    port: config.port, // imap port
    tls: true,
    tlsOptions: {
      rejectUnauthorized: false
    },
    mailbox: config.mailbox, // mailbox to monitor
    searchFilter: config.searchFilter, // the search filter being used after an IDLE notification has been retrieved
    markSeen: config.markSeen, // all fetched email willbe marked as seen and not fetched next time
    fetchUnreadOnStart: config.fetchUnreadOnStart, // use it only if you want to get all unread email on lib start. Default is `false`,
    attachments: false
});

module.exports = mailListener;
