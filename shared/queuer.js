function initQueuer(redis) {
  var
      publishClient = redis.createClient(),
      subscriberClient = redis.createClient(),
      putTasksClient = redis.createClient();

  subscriberClient.on("subscribe", function(channel) {
      console.log("Subscribed to " + channel);
      console.log("Will be notified if worker dispatcher comes alive");
  })

  subscriberClient.on("message", function(channel, message) {
      console.log("Worker is alive!");
      Queuer.notifyWorkers("notify_on_new_task", "task_waiting_queue");
  });
  subscriberClient.subscribe("status");

  function Queuer() {}

  Queuer.addTask = function(task) {
      putTasksClient.LPUSH("task_waiting_queue", JSON.stringify(task), redis.print);
      Queuer.notifyWorkers("notify_on_new_task", "task_waiting_queue")
  }

  Queuer.notifyWorkers = function(channel, message) {
      publishClient.publish(channel, message);
  }

  return Queuer;
}



module.exports = initQueuer;
