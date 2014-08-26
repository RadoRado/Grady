var
  graderHelper = require("./grader.helper"),
  GRADE_FOLDER = "scheme-grading-folder",
  COMMAND_BASE = "plt-r5rs";

module.exports = function(input, test, callback) {
  test.filename = "test-"+ test.filename;

  var
    inputPath = [__dirname, GRADE_FOLDER, input.filename].join("/"),
    outputPath = [__dirname, GRADE_FOLDER, test.filename].join("/");

  graderHelper.ensureFolder(GRADE_FOLDER);
  graderHelper.writeFile(inputPath, input.contents);
  graderHelper.writeFile(outputPath, test.contents);


  process.chdir(__dirname + "/" + GRADE_FOLDER);
  graderHelper.executeCommand([COMMAND_BASE, test.filename].join(" "))
    .then(function(stdout) {
      console.log(stdout);
      callback(null, stdout);
    })
    .catch(function(errorObject) {
      console.log(errorObject);
      callback(errorObject);
    });
};
