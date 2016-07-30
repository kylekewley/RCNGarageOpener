var mqtt    = require('react-native-mqtt');

class GarageClient {
  constructor() {
    super();
  }


  _uriFromHost(host, port) {
    return 'mqtt://' + host + ':' + port;
  }

  connectToServer(host, port) {
    var uri = this._uriFromHost(host, port);
    mqtt.createClient({
      uri: uri,
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
}

module.exports = GarageClient;

