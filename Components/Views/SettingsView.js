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

class SettingsView extends Component {

  render() {
    const titleConfig = {
      title: 'Settings',
      tintColor: 'white',
    };

    const statusBarConfig = {
      style: "light-content",
      tintColor:"#00796B",
    }

    return (
        <View style={{ flex: 1, }}>
          <NavigationBar
            title={<NavigationTitle title={titleConfig.title} />}
            style={styles.navigationBar}
            statusBar={statusBarConfig}
            leftButton={ <DrawerButton onPress={() => this.props.navigator.props.openDrawer()}/>}
            />
          <Text>This is the settings view</Text>
        </View>
        );
  }
}

SettingsView.rowTitle = 'App Settings';
SettingsView.icon = 'settings';

module.exports = SettingsView;
