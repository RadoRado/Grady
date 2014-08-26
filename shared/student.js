function initModel(mongoose) {
  var
    studentSchema = mongoose.Schema({
      name: String,
      facultyNumber: String,
      group: Number,
      email: String
    }),
    Student = mongoose.model('Student', studentSchema);

  return Student;
}

module.exports = initModel;
