import React, { Component } from 'react';

import {
    StyleSheet,
    View,
    Text,
} from 'react-native';

var NavigationBar = require('react-native-navbar');

var styles = require('../../styles')
var DrawerButton = require('../NavBar/DrawerButton');
var NavigationTitle = require('../NavBar/NavigationTitle');

const UPDATE_TOPIC = 'test';
const METADATA_TOPIC = 'metadata';

class OpenerView extends Component {

  constructor(props) {
    super(props);

    this.props.client.subscribeToTopicIfNeeded(UPDATE_TOPIC, 2, (client, msg) => {
      console.log("Received message" + msg);
      //TODO: Code to update view when doors change
    });
  }

  render() {
    const titleConfig = {
      title: 'Garage Opener',
      tintColor: 'white',
    };

    const statusBarConfig = {
      style: "light-content",
      tintColor:"#00796B",
    }

    return (
        <View style={{ flex: 1}}>
          <NavigationBar
            title={<NavigationTitle title={titleConfig.title} />}
            statusBar={statusBarConfig}
            style={styles.navigationBar}
            leftButton={ <DrawerButton onPress={() => this.props.navigator.props.openDrawer()}/>}
            />
          <Text>This is the opener view</Text>
        </View>
        );
  }

  componentWillUnmount() {
    this.props.client.removeTopicHandler(UPDATE_TOPIC);
  }
}

OpenerView.rowTitle = "Opener";
OpenerView.icon = "settings-remote";

module.exports = OpenerView;
