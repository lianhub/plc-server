// Hello World server
// Binds REP socket to tcp://*:5555
// Expects "Hello" from client, replies with "world"
var zmq;
try {
    console.log(require.resolve("zmq"));
    zmq = require('zmq');
} catch(e) {
    console.error("zmq is not found, change to zeromq");
    zmq = require('zeromq');
}

var responder = zmq.socket('rep');// socket to talk to clients

responder.on('message', function(request) {
    console.log("Received request: [", request.toString(), "]");
    // send reply back to client.
    responder.send("World");
});

responder.bind('tcp://*:5555', function(err) {
   if (err)     console.log(err);
   else         console.log("Listening on 5555…");
});

process.on('SIGINT', function() {
  responder.close();
});
