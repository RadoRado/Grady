var
  graderHelper = require("./grader.helper"),
  GRADE_FOLDER = "temp-grading-folder";

module.exports = function(input, test, callback) {
  // write testSource
  // write inputSource
  // execute them
  // collect results
  graderHelper.ensureFolder(GRADE_FOLDER);
  graderHelper.writeFile(
            [__dirname, GRADE_FOLDER, input.filename].join("/"),
            input.contents);
  graderHelper.writeFile(
            [__dirname, GRADE_FOLDER, "test-"+ test.filename].join("/"),
            test.contents);
  callback("Everying was tested!");
};
