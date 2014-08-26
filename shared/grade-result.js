function initModel(mongoose) {
  var
    gradeResultSchema = mongoose.Schema({
      studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
      },
      problemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem'
      },
      mailId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mail'
      },
      date: Date,
      passed: Boolean,
      output: String
    }),
    GradeResult = mongoose.model('GradeResult', gradeResultSchema);

  return GradeResult;
}

module.exports = initModel;
