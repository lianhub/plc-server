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
    console.log("req/rep reply", ": ", reply.toString());
    requester.close();    //process.exit(0);
});

requester.connect("tcp://localhost:5555");
//requester.connect("tcp://10.0.0.2:5555");

console.log("Sending request", '…');
requester.send(JSON.stringify({type: 'stop', file: 'ecat'}) )

var suber = zmq.socket('sub');// socket to talk to server
suber.subscribe("")
suber.on("message", function(reply) {
    console.log("pub/sub reply", ": ", reply.toString());
    //suber.close();    //process.exit(0);
});
suber.connect("tcp://localhost:5565");
//suber.connect("tcp://10.0.0.2:5565");

process.on('SIGINT', function() {
  suber.close();  //requester.close();
  console.log('\nClosed')
});
