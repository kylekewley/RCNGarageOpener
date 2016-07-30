var mqtt    = require('react-native-mqtt');

exports.connectToServer = function (){
  mqtt.createClient({
    uri: 'mqtt://localhost:1883',
    clientId: 'your_client_id'
  }).then(function(client) {

    client.on('closed', function() {
      console.log('mqtt.event.closed');

    });

    client.on('error', function(msg) {
      console.log('mqtt.event.error', msg);

    });

    client.on('message', function(msg) {
      console.log('mqtt.event.message', msg);
    });

    client.on('connect', function() {
      console.log('connected');
      client.subscribe('/data', 0);
      client.publish('/data', "test", 0, false);
    });

    client.connect();
  }).catch(function(err){
    console.log(err);
  });

}


