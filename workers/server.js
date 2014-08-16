var
  redis = require("redis"),
  publishClient = redis.createClient(),
  subscribeClient = redis.createClient(),
  getTasksClient = redis.createClient(),
  threads = require('threads_a_gogo');


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
      workerThread = null;

    switch(payload.type) {
      case "email":
        workerThread = threads.create();
        console.log("Emaily thingy");
        workerThread.load(__dirname + "/" + payload.type + ".js", function() {
          console.log("Thread loaded");
          workerThread.emit("workwork", reply);
        });

        workerThread.on("work_done", function(message) {
          console.log(message);
          workerThread.destroy();
        });
        break
      case "grade":
        break
    }

  });
});

subscribeClient.subscribe("notify_on_new_task");
