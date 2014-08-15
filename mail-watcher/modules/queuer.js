var
    redis = require("redis"),
    client = redis.createClient();

function Queuer() {}

Queuer.addTask = function(task) {
    client.LPUSH("task-waiting-queue", JSON.stringify(task), redis.print);
}

Queuer.notifyWorkers = function(channel, message) {

}

module.exports = Queuer;
