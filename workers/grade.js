var
  path = require("path"),
  gradersByExtension = {
    ".scm": "grader.scm.js"
  };

module.exports = function (input, callback) {

  input.attachments.forEach(function(attachment) {
    var
      fileExtension = path.extname(attachment.filename),
      grader = gradersByExtension[fileExtension];

    if(!grader) {
      console.log("Cannot grade %s", fileExtension);
      return;
    }

    console.log("Will grade %s with %s", attachment.filename, grader);
  });

  callback(null, "Grading stuff");
};
