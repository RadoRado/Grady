var fs = require("fs");

function ensureFolder(folderName) {
  var path = __dirname + "/" + folderName;
  if(!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
}

function writeFile(path, contents) {
  fs.writeFileSync(path, contents);
}

exports.ensureFolder = ensureFolder;
exports.writeFile = writeFile;
