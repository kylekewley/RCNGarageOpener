var mqtt    = require('react-native-mqtt');
var DeviceInfo = require('react-native-device-info');

class GarageClient {
  constructor() {
    this.clientID = DeviceInfo.getUniqueID() || '';
    this._client = null;

    // Track pairs of subscription/handler functions
    this.subscriptions = {};
  }

  /*
   * This function will take all of the topic keys in this.subscriptions and
   * make sure the client is subscribed to each of them
   */
  _subscribeToAllTopics(client) {
    for (var key in this.subscriptions) {
      client.subscribe(key, this.subscriptions[key].qos);
    }
  }

  /*
   * Subscribe the client to a topic with the given qos. The handler function
   * is called with the client and the message object when a message is recieved
   * on the topic.
   */
  subscribeToTopic(topic, qos, handler) {
    this.subscriptions[topic] = {
      qos: qos,
      handler: handler
    };

    // Subscribe right now if we are already connected
    if (this._client !== null) {
      this._client.subscribe(topic, qos);
    }
  }

  _defaultMessageHandler(client, msg) {
    console.log('mqtt message default handler:', msg);
  }

  /*
   * Called whenever the client is connected. callback(client)
   */
  onConnect(callback) {
    this.connected = callback;
  }


  /*
   * Called whenever the client is disconnected. callback()
   */
  onDisconnect(callback) {
    this.disconnected = callback;
  }

  publish(topic, payload, qos, retain, errorHandler) {
    if (this._client !== null) {
      client.publish(topic, payload, qos, retain);
    } else if (errorHandler) {
      errorHandler("Client not connected");
    }
  }

  connectToServer(host, port, errorHandler) {

    mqtt.createClient({
      host: host,
      port: port,
      clientId: this.clientID
    }).then((client) => {

      client.on('error', (msg) => {
        console.log('mqtt.event.error', msg);
        if (errorHandler) {
          errorHandler(msg);
        }
      });

      client.on('message', (msg) => {
        console.log("message received");

        var topic = msg.topic;

        // use the default handler if nothing else specified
        var handler = this._defaultMessageHandler;

        // set the handler if one has been added in subscriptions
        if (topic in this.subscriptions) {
          var h = this.subscriptions[topic].handler;
          if (h) handler = h;
        }

        // Call the handler
        handler(client, msg);
      });

      client.on('closed', () => {
        this.client = null;

        // Execute the callback if set
        if (this.disconnected) this.disconnected();
      });

      client.on('connect', () => {
        this.client = client;

        this._subscribeToAllTopics(client);

        // Execute the callback if set
        if (this.connected) this.connected(client);
      });

      client.connect();
    }).catch(function(err){
      console.log("error",err);
      if (errorHandler) {
        errorHandler(err);
      }
    });
  }
}

module.exports = GarageClient;

