import React, { Component } from 'react';

import {
    StyleSheet,
    View,
    Text,
} from 'react-native';

var styles = require('./styles')
var NavigationBar = require('react-native-navbar');
var DrawerButton = require('./DrawerButton');
var NavigationTitle = require('./NavigationTitle');

class HistoryView extends Component {

  render() {
    const titleConfig = {
      title: 'Garage History',
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
          <Text>This is the history view</Text>
        </View>
        );
  }
}

HistoryView.rowTitle = "History";
HistoryView.icon = "history";

module.exports = HistoryView;
