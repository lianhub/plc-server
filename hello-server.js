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

var puber = zmq.socket('pub');// socket to talk to clients
puber.bind('tcp://*:5565', function(err) {
   if (err)     console.log(err);
   else         console.log("Listening on 5565…");
});

var responder = zmq.socket('rep');// socket to talk to clients
var spawn = require('child_process').spawn;
var ecat
var plc
responder.on('message', function(request) {
    responder.send("World");
    console.log("Received request: [", request.toString(), "]");
    // send reply back to client.
    const message = JSON.parse(request);
    if (message.type === 'start')
       ecat = spawn('sudo', ['/opt/etherlab/etc/init.d/ethercat', 'start']);
    if (message.type === 'stop')
       ecat = spawn('sudo', ['/opt/etherlab/etc/init.d/ethercat', 'stop']);

    if (message.type === 'estart')
       ecat = spawn('sudo', ['/home/pi/ecat-plc-ads/openplc']);
    if (message.type === 'estop')
       ecat = spawn('sudo', ['killall', 'openplc']);
       //plc.kill('SIGKILL');

    ecat.stdout.on('data', (data) => {
      console.log(`${data} `);
      puber.send(`${data} `);
    });
});

responder.bind('tcp://*:5555', function(err) {
   if (err)     console.log(err);
   else         console.log("Listening on 5555…");
});

process.on('SIGINT', function() {
  responder.close();
  puber.close();
});
