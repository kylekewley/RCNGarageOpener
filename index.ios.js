'use strict'

import React, { Component } from 'react';
import Drawer from 'react-native-drawer'
import {
    AppRegistry,
    StyleSheet,
    View,
    StatusBar,
    Navigator,
    NavigationBar,
    Text,
    AsyncStorage,
    Alert,
} from 'react-native';

var styles = require('./styles')

var OpenerView = require('./Components/Views/OpenerView');
var DrawerView = require('./Components/NavDrawer/DrawerView');

var GarageClient = require('./garageclient');

var C = require('./constants');

class GarageOpener extends Component {

  constructor(props) {
    super(props);

    // Variable to track initial connection errors. Set to true after the first connection error
    this.connectionErrorsDismissed = false;
    this.connectionMade = false;

    this._storeDefaultSettings();

    this.client = new GarageClient();

    // Setup the listener events
    this.client.onConnect((client) => {
      this.connectionMade = true;
      console.log("Connected");
    });

    this.client.onDisconnect(() => {
      if (this.connectionMade) {
        // We had an initial connection. Report to the user and reconnect
        this.connectionErrorsDismissed = true;
        this.connectionMade = false;
        Alert.alert(
            'Connection Error',
            "The client became disconnected from the server. Reconnection attempts will be made periodically",
            [ {text: 'Okay', }]
            )
          this._getHostAndConnect(this.client);
      }
      console.log("disconnected")
    });

    // Attempt a connection
    this._getHostAndConnect(this.client);


    // Set all of the properties for the drawer
    this.state = {
      drawerType: 'overlay',
      openDrawerOffset:.35,
      closedDrawerOffset:0,
      panOpenMask: .05,
      panCloseMask: 0,
      relativeDrag: false,
      panThreshold: .25,
      tweenDuration: 250,
      tweenEasing: 'easeInQuad',
      acceptDoubleTap: false,
      acceptTap: true,
      acceptPan: true,
    };

  }

  /* Stores the default settings values if not already in the 
   * AsyncStorage
   */
  _storeDefaultSettings() {
    var settingKeys = [C.HOST_KEY,
                       C.PORT_KEY,
                       C.UPDATE_TOPIC_KEY,
                       C.HISTORY_REQUEST_TOPIC_KEY,
                       C.CONTROL_TOPIC_KEY,
                       C.METADATA_TOPIC_KEY];
    var defaults = [C.DEFAULT_HOST,
                    C.DEFAULT_PORT,
                    C.DEFAULT_UPDATE_TOPIC,
                    C.DEFAULT_HISTORY_REQUEST_TOPIC,
                    C.DEFAULT_CONTROL_TOPIC,
                    C.DEFAULT_METADATA_TOPIC];

    AsyncStorage.multiGet(settingKeys).then((stores) => {
      stores.map((value, i) => {
        // Check if the value for the key is null
        if (!value[1]) {
          // Not set. Assign it the default value
          AsyncStorage.setItem(value[0], defaults[i]);
        }
      });
    }).done();
  }

  _handleMQTTError(client, msg) {
    if (client.isConnected() || !this.connectionErrorsDismissed) {
      var alertMessage = client.isConnected() ? "The server returned the error '" + msg + "'" :
        "Error connecting to server. Reconnection attempts will be made periodically";

      Alert.alert(
          'Connection Error',
          alertMessage,
          [ {text: 'Okay', }]
          )
    }

    if (!this.connectionErrorsDismissed && !client.isConnected())
      this.connectionErrorsDismissed = true;
  }

  _getHostAndConnect(client) {
    AsyncStorage.multiGet([C.HOST_KEY, C.PORT_KEY]).then((stores) => {
      var host = stores[0][1];
      var port = stores[1][1];

      client.connectToServer(host, port, this._handleMQTTError.bind(this, client));
    }).done();
  }

  // Called by the navigator to setup the new view when changed
  _renderScene(route, navigator) {
    return <route.component route={route} navigator={navigator} client={this.client} />;
  }


  // Replace the main screen with one from the drawerView components
  _switchToView(viewClass) {
    this.navigator.replace({
        component: viewClass
      });
  }

  render() {
    var drawerView = <DrawerView switchToView={(viewClass) => this._switchToView(viewClass)} openDrawer={() => {this.drawer.open()}} closeDrawer={() => {this.drawer.close()}} />;

    // The initial screen displayed
    const initialRoute = {
      component: OpenerView
    };

    var drawerStyles = {
      mainOverlay: {backgroundColor: '#000', opacity: 0.0},
      drawer: { shadowColor: '#000', shadowOpacity: 0.0, shadowRadius: 5},
    }


    return (
          <Drawer
            style={{backgroundColor: "green"}}
            ref={(ref) => { this.drawer = ref}}
            content={drawerView}
            type={this.state.drawerType}
            openDrawerOffset={this.state.openDrawerOffset}
            closedDrawerOffset={this.state.closedDrawerOffset}
            panOpenMask={this.state.panOpenMask}
            panCloseMask={this.state.panCloseMask}
            relativeDrag={this.state.relativeDrag}
            panThreshold={this.state.panThreshold}
            styles={drawerStyles}
            tweenHandler={(ratio) => {
                return {
                  mainOverlay: {opacity: ratio*0.4},
                  drawer: {shadowOpacity: ratio * 0.7},
                };
                }}
            tweenDuration={this.state.tweenDuration}
            tweenEasing={this.state.tweenEasing}
            acceptDoubleTap={this.state.acceptDoubleTap}
            acceptTap={this.state.acceptTap}
            acceptPan={this.state.acceptPan}
            negotiatePan={false} >

            <Navigator
              style={styles.mainView}
              ref={(ref) => {this.navigator = ref}}
              initialRoute={initialRoute}
              renderScene={this._renderScene.bind(this)}
              openDrawer={drawerView.props.openDrawer}/>
        </Drawer>
        );
  }
}

AppRegistry.registerComponent('GarageOpener', () => GarageOpener);
