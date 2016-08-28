import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {
    StyleSheet,
    View,
    Text,
    TouchableHighlight,
} from 'react-native';

var styles = require('../../styles')

class DrawerButton extends Component {
  render() {
    return (
      <View style={styles.drawerButton}>
      <TouchableHighlight underlayColor="#00796B" style={styles.calendarButtonTouchable} onPress={this.props.onPress}>
        <Icon name="today" size={24} style={styles.iconLight} />
      </TouchableHighlight>
      </View>
      );
  }
}

module.exports = DrawerButton;
