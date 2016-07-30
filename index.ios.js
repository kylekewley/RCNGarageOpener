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
} from 'react-native';

var styles = require('./styles')

var OpenerView = require('./Components/Views/OpenerView');
var DrawerView = require('./Components/NavDrawer/DrawerView');

var GarageClient = require('./garageclient');

const HOST_KEY = "host";
const PORT_KEY = "port";

class GarageOpener extends Component {

  constructor(props) {
    super(props);

    this.client = new GarageClient();
    this._getHostAndConnect(this.client);

    this.client.onConnect((client) => {console.log("Connected");});
    this.client.onDisconnect(() => {console.log("disconnected")});

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

  _getHostAndConnect(client) {
    AsyncStorage.multiGet([HOST_KEY, PORT_KEY]).then((stores) => {
      var host = stores[0][1];
      var port = stores[1][1];
      client.connectToServer(host, port);
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
