var
  redis = require("redis"),
  publishClient = redis.createClient(),
  subscribeClient = redis.createClient(),
  getTasksClient = redis.createClient(),
  workerFarm = require('worker-farm'),
  config = require("./config");


subscribeClient.on("subscribe", function(channel) {
  console.log("Subscribed to ", channel);
  publishClient.publish("status", "workers_dispatcher_alive");
});

subscribeClient.on("message", function(channel, message) {
  console.log("Got new message! Work Work!");

  getTasksClient.RPOP(message, function(err, reply) {
    try {
      if(!reply) {
        return;
      }

      // if the resolved file is not there, an error is thrown
      var
        payload = JSON.parse(reply),
        worker = workerFarm(require.resolve("./" + payload.type));

      worker(payload, function(error, output) {
        console.log(error, output);
      });
    } catch(error) {
      // TODO: email error
      console.log(error);
    }
  });
});

subscribeClient.subscribe("notify_on_new_task");
