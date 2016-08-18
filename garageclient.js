var mqtt    = require('react-native-mqtt');
var DeviceInfo = require('react-native-device-info');

class GarageClient {
  constructor() {
    this.clientID = DeviceInfo.getUniqueID() || '';
    this._client = null;
    this.connectionHandlers = [];

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

  /*
   * This will subscribe to the given topic or update the handler for it if
   * already subscribed.
   */
  subscribeToTopicIfNeeded(topic, qos, handler) {
    if (topic in this.subscriptions) {
      this.subscriptions[topic] = {
        qos: qos,
        handler: handler
      };
    }else {
      this.subscribeToTopic(topic, qos, handler);
    }
  }

  /*
   * This will set the topic handler for the topic to null if it exists.
   * This should be called if the handler function for a topic belongs to a 
   * view that will be unmounted
   *
   * Note: this does not actually unsubscribe from the topic. Just removes the
   * handler.
   */
  removeTopicHandler(topic) {
    if (topic in this.subscriptions) {
      this.subscriptions[topic].handler = undefined;
    }
  }

  _defaultMessageHandler(client, msg) {
    console.log('mqtt message default handler:', msg);
  }

  isConnected() {
    return (this._client !== null);
  }

  /*
   * Called whenever the client is connected. callback(client)
   */
  onConnect(callback) {
    this.connectionHandlers.push(callback);
  }

  /*
   * Called whenever the client is disconnected. callback()
   */
  onDisconnect(callback) {
    this.disconnected = callback;
  }

  publish(topic, payload, qos, retain, errorHandler) {
    if (this._client !== null) {
      this._client.publish(topic, payload, qos, retain);
    } else if (errorHandler) {
      errorHandler("Client not connected");
    }
  }

  _isInt(value) {
    return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value))
  }


  connectToServer(host, port, errorHandler) {
    if (!this._isInt(port)) {
      if (errorHandler) errorHandler("Port number is not an integer greater than 1024");
      return;
    }

    port = parseInt(port);

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
        this._client = null;

        // Execute the callback if set
        if (this.disconnected) this.disconnected();
      });

      client.on('connect', () => {
        this._client = client;

        this._subscribeToAllTopics(client);

        // Execute the callback if set
        this.connectionHandlers.map((handler) => handler(client));
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

