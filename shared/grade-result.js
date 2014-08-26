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
      gradeDate: { type: Date, default: Date.now },
      passed: Boolean,
      output: String
    }),
    GradeResult = mongoose.model('GradeResult', gradeResultSchema);

  return GradeResult;
}

module.exports = initModel;
