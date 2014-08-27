function initModel(mongoose) {
  var
    problemSchema = mongoose.Schema({
      filename: {
        type: String,
        index: true
      },
      fileset: String,
      tests: String
    }),
    Problem = mongoose.model('Problem', problemSchema);

  return Problem;
}

module.exports = initModel;
