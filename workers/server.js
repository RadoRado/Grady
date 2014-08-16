var
  redis = require("redis"),
  publishClient = redis.createClient(),
  subscribeClient = redis.createClient(),
  getTasksClient = redis.createClient(),
  workerFarm = require('worker-farm');


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

    var
      payload = JSON.parse(reply),
      worker = null;

    switch(payload.type) {
      case "email":
        worker = workerFarm(require.resolve("./" + payload.type));
        worker(reply, function(error, output) {
          console.log(error, output);
        });
        console.log("Worker is working.");
        break
      case "grade":
        // no implementation for now
        break
    }

  });
});

subscribeClient.subscribe("notify_on_new_task");
