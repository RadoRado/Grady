var
  redis = require("redis"),
  publishClient = redis.createClient(),
  subscribeClient = redis.createClient(),
  getTasksClient = redis.createClient();


subscribeClient.on("subscribe", function(channel) {
  console.log("Subscribed to ", channel);
  publishClient.publish("status", "workers_dispatcher_alive");
});

subscribeClient.on("message", function(channel, message) {
  console.log("Got new message!");
  console.log(channel, message);
  getTasksClient.RPOP(message, function(err, reply) {
    console.log(err);
    console.log(reply);
  });
});

subscribeClient.subscribe("notify_on_new_task");
