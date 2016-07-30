import React, { Component } from 'react';

import {
    StyleSheet,
    View,
    Text,
} from 'react-native';

var styles = require('./styles')


class NavigationTitle extends Component {
  render() {
    return (
        <View style={styles.navigationTitleView}>
          <Text style={styles.navigationBarText}>{this.props.title}</Text>
        </View>
        );
  }
}

module.exports = NavigationTitle;
