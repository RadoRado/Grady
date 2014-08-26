var
  mongoose = require('mongoose'),
  Student = require("../shared/student")(mongoose),
  config = require("./config"),
  students = require("./students");

mongoose.connect(config.mongoConnectionString);

students.forEach(function(student) {
  new Student(student).save();
});

mongoose.connection.close()
