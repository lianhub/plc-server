var zmq = require('zeromq')

var requester = zmq.socket('req');// socket to talk to server
requester.on("message", function(reply) {
    console.log("Received reply", 0, ": [", reply.toString(), ']');
    requester.close();
    //process.exit(0);
});
requester.connect("tcp://localhost:5555");
console.log("Sending request", 0, '…');
requester.send(JSON.stringify({type: 'stop', file: 'ecat'}) )


var subscriber = zmq.socket('sub')

subscriber.on("message", function(reply) {
  console.log('Received message: ', reply.toString());
})

subscriber.connect("tcp://localhost:8688")
subscriber.subscribe("")

process.on('SIGINT', function() {
  subscriber.close()
  console.log('\nClosed')
})
