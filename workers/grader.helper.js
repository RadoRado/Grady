var
  fs = require("fs"),
  exec = require('child_process').exec,
  Q = require("q");

function ensureFolder(folderName) {
  var path = __dirname + "/" + folderName;
  if(!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
}

function writeFile(path, contents) {
  fs.writeFileSync(path, contents);
}

function executeCommand(command) {
  var defer = Q.defer();

  exec(command, function(error, stdout, stderr) {
    if(error !== null) {
      defer.reject({
        error: error,
        stderr: stderr
      });
    }

    defer.resolve(stdout);
  });

  return defer.promise;
}

exports.ensureFolder = ensureFolder;
exports.writeFile = writeFile;
exports.executeCommand = executeCommand;
