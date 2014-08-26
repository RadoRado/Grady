var Q = require("q");

function fetchModelByProperty(Model, property, value) {
  var
    defer = Q.defer(),
    query = {};

  query[property] = value;

  Model.findOne(query, function(err, result) {
    if(err) {
      defer.reject(err);
    } else {
      defer.resolve(result)
    }
  });

  return defer.promise;
}

exports.fetchModelByProperty = fetchModelByProperty;
