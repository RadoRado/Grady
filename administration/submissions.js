var
  mongoose = require("mongoose"),
  config = require("./config"),
  mapReduce = {},
  GradeResult = require("../shared/grade-result")(mongoose);

mongoose.connect(config.mongoConnectionString);

mapReduce.map = function() {
  var passedValue = 1;

  if(!this.passed) {
    passedValue = -1;
  }

  emit(this.studentId, passedValue);
};

mapReduce.reduce = function(key, values) {
  var
    passed = values.filter(function(x) {
      return x === 1;
    }),
    successRate = passed.length / values.length;

  return successRate;
};

GradeResult.mapReduce(mapReduce)
  .then(function(results) {
    console.log(results);
  })
  .then(null, function(error) {
    console.log(error);
  })
  .end();
