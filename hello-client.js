// Hello World client
// Connects REQ socket to tcp://localhost:5555
// Sends "Hello" to server.
var zmq;
try {
    console.log(require.resolve("zmq"));
    zmq = require('zmq');
} catch(e) {
    console.error("zmq is not found, change to zeromq");
    zmq = require('zeromq');
}

console.log("Connecting to hello-world server…");
var requester = zmq.socket('req');// socket to talk to server

requester.on("message", function(reply) {
    console.log("Received reply", 0, ": [", reply.toString(), ']');
    requester.close();
    process.exit(0);
});

requester.connect("tcp://localhost:5555");
//requester.connect("tcp://10.0.0.2:5555");

console.log("Sending request", 0, '…');
requester.send("Hello");

process.on('SIGINT', function() {  requester.close(); });
