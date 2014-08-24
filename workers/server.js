var
  redis = require("redis"),
  publishClient = redis.createClient(),
  subscribeClient = redis.createClient(),
  getTasksClient = redis.createClient(),
  workerFarm = require('worker-farm'),
  config = require("./config"),
  mongoose = require("mongoose"),
  Mail = require("../shared/mail")(mongoose),
  Q = require("q");


function fetchMailFromMailId(mailId) {
  var defer = Q.defer();

  Mail.findOne({
    _id: mailId
  }, function(err, mail) {
    if(err) {
      defer.reject(err);
    }

    defer.resolve(mail);
  });

  return defer.promise;
}


function loadWorker(workerName, payload) {
  var
    defer = Q.defer(),
    worker = null;

    try {
      worker = workerFarm(require.resolve("./" + workerName));
    } catch(error) {
      defer.reject(error);
    }

    worker(payload, function(error, output) {
      if(error) {
        defer.reject(error);
      }

      defer.resolve(output);
    });

  return defer.promise;
}

mongoose.connect(config.mongoConnectionString);

subscribeClient.on("subscribe", function(channel) {
  console.log("Subscribed to ", channel);
  publishClient.publish("status", "workers_dispatcher_alive");
});

subscribeClient.on("message", function(channel, message) {
  console.log("Got new message! Work Work!");

  getTasksClient.RPOP(message, function(err, reply) {
    if(!reply) {
      return;
    }

    var payload = JSON.parse(reply);

    fetchMailFromMailId(payload.data.fetchFromId)
      .then(function(mail) {
        return loadWorker(payload.type, mail);
      })
      .then(function(workerOutput) {
        console.log("Worker is done. Here is his output:");
        console.log(workerOutput);
      })
      .catch(function(error) {
        // TODO: Do something with the error
        console.log(JSON.stringify(error));
      });
  });
});

subscribeClient.subscribe("notify_on_new_task");
