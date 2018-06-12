var zmq = require('zeromq')

var responder = zmq.socket('rep');// socket to talk to clients
responder.bind('tcp://*:5555', function(err) {
   if (err)     console.log(err);
   else         console.log("Listening on 5555…");
});

var publisher = zmq.socket('pub')
publisher.bind('tcp://*:8688', function(err) {
  if(err)    console.log(err)
  else    console.log("Listening on 8688...")
})

responder.on('message', function(request) {
    console.log("Received request: [", request.toString(), "]");
    responder.send("ggWorld");
    setTimeout(function() {
        publisher.send("Hello there!")
    }, 0 )
});

process.on('SIGINT', function() {
  publisher.close()
  responder.close()
  console.log('\nClosed')
})
