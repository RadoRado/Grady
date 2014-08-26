var
  graderHelper = require("./grader.helper"),
  GRADE_FOLDER = "scheme-grading-folder",
  COMMAND_BASE = "plt-r5rs";


function allPassed(stdout) {
  return stdout
          .split("\n")
          .filter(function(line) {
            return line != "";
          })
          .every(function(line) {
            return line.indexOf("passed") > -1
          });
}

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
      callback({
        passed: allPassed(stdout),
        stdout: stdout
      });
    })
    .catch(function(errorObject) {
      callback({
        error: errorObject
      });
    });
};
