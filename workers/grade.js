var
  config = require("./config"),
  mongoose = require("mongoose"),
  Problem = require("../shared/problem")(mongoose),
  Student = require("../shared/student")(mongoose),
  GradeResult = require("../shared/grade-result")(mongoose),
  path = require("path"),
  mongoHelper = require("./mongo.helper"),
  gradersByExtension = {
    ".scm": "grader.scm.js"
  }

mongoose.connect(config.mongoConnectionString);

module.exports = function (input, callback) {

  var errorsCount = 0;

  input.attachments.forEach(function(attachment) {
    var
      fileExtension = path.extname(attachment.filename),
      graderName = gradersByExtension[fileExtension],
      grader = null;

    if(!graderName) {
      console.log("Cannot grade %s", fileExtension);
      errorsCount += 1;
      return;
    }

    console.log("Will grade %s with %s", attachment.filename, graderName);

    Problem.findOne({
      filename: attachment.filename
    }, function(err, problem) {

        if(!problem) {
          // there is nothing in the database
          // email the sender
          // add error
        }
      grader = require("./" + graderName);
      grader({
        filename: attachment.filename,
        contents: attachment.contents
      }, {
        filename: problem.filename,
        contents: problem.tests
      }, function(graderResult) {
        console.log("Grader result for: %s", input.from)
        console.log(graderResult);

        mongoHelper.fetchModelByProperty(Student, "email", input.from)
          .then(function(student) {
            var gradeResult = new GradeResult({
              studentId: student._id,
              problemId: problem._id,
              mailId: input._id,
              passed: graderResult.passed,
              output: graderResult.stdout
            });

            gradeResult.save(function(err, savedGradeResult) {
              callback(err, savedGradeResult);
            });
          });
      });
    })
  });

  if(errorsCount === input.attachments.length) {
    console.log("Nothing was graded, should callback!");
    callback(new Error("Nothing was graded."));
  }

};
