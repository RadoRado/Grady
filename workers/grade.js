var
  config = require("./config"),
  mongoose = require("mongoose"),
  Problem = require("./problem")(mongoose),
  path = require("path"),
  gradersByExtension = {
    ".scm": "grader.scm.js"
  }

mongoose.connect(config.mongoConnectionString);

module.exports = function (input, callback) {

  input.attachments.forEach(function(attachment) {
    var
      fileExtension = path.extname(attachment.filename),
      graderName = gradersByExtension[fileExtension],
      grader = null;

    if(!graderName) {
      console.log("Cannot grade %s", fileExtension);
      return;
    }

    console.log("Will grade %s with %s", attachment.filename, graderName);

    Problem.findOne({
      filename: attachment.filename
    }, function(err, problem) {
      console.log(err, problem);
    })

//    grader = require("./" + graderName);

  });

  callback(null, "Grading stuff");
};
