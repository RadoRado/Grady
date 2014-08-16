var thread= require('threads_a_gogo').create();
thread.load(__dirname + '/child.js');

//Listener for the 'theFiboIs' events emitted by the child/background thread.
thread.on('theFiboIs', function cb (data) {
  console.log(data);
});

setInterval(function() {
  thread.emit('giveMeTheFibo', 10);
}, 2000);
