import React, { Component } from 'react';

import {
    StyleSheet,
    View,
    Text,
    TextInput,
    AsyncStorage,
} from 'react-native';

var NavigationBar = require('react-native-navbar');

var styles = require('../../styles');
var psstyles = require('../../psstyles');
var DrawerButton = require('../NavBar/DrawerButton');
var NavigationTitle = require('../NavBar/NavigationTitle');

var C = require('../../constants');

class SettingsSection extends Component {
  render() {
    return (
        <View>
        <Text style={styles.settingsSection}>{this.props.children}</Text>
        </View>
        )
  }
}

class FloatingTextInput extends Component {
  constructor(props) {
    super(props);

    var initialEmpty = !(this.props.value && this.props.value.length > 0);
    this.state = {
      isEmpty: initialEmpty,
      value: ""
    };

    // Get the value asynchronously if storageKey is set
    if (this.props.storageKey) {
      AsyncStorage.getItem(this.props.storageKey).then((v) => {
        this.setState({value: v});
        this._onChangeText(v);
      }).done();
    }
  }

  _onChangeText(text) {
    if (!text) return;

    // If onChangeText is a property of FloatingTextInput, call it first
    if (this.props.onChangeText) {
      this.props.onChangeText(text);
    }

    // Store the value
    if (this.props.storageKey) {
      AsyncStorage.setItem(this.props.storageKey, text);
    }


    // Check if the input is empty
    var empty = text.length === 0;

    // If this doesn't match the current state, update it!
    if (this.state.isEmpty !== empty) {
      this.setState({ isEmpty: empty });
    }
  }

  _renderLabel() {
    // If there is text, return a label for the input
    if (!this.state.isEmpty) {
      return (
          <Text style={styles.settingsLabel}>{this.props.placeholder}</Text>
          );
    }

    // If no text, just return a blank view to fill the space
    return(
        <View style={styles.settingsLabelPlaceholder} /> 
        );
  }

  render() {
    return (
        <View>
        {this._renderLabel()}
        <TextInput  {...this.props} defaultValue={this.state.value} style={psstyles.settingsTextInput} onChangeText={this._onChangeText.bind(this)} />
        <View style={psstyles.settingsItemLine} />
        </View>
        );
  }
}

class SettingsView extends Component {

  _onChangeText(text) {
    console.log(text);
  }

  render() {
    const titleConfig = {
      title: 'Settings',
      tintColor: 'white',
    };

    const statusBarConfig = {
      style: "light-content",
      tintColor:"#00796B",
    }

    var sharedTextProps = {
      autoCorrect: false,
      autoCapitalize: 'none',
    };

    return (

        <View style={{ flex: 1, }}>
          <NavigationBar
            title={<NavigationTitle title={titleConfig.title} />}
            style={styles.navigationBar}
            statusBar={statusBarConfig}
            leftButton={ <DrawerButton onPress={() => this.props.navigator.props.openDrawer()}/>}
            />

          <View style={styles.settingsContentView}>
            <SettingsSection>MQTT Broker</SettingsSection>
            <FloatingTextInput {...sharedTextProps} keyboardType='url' storageKey={C.HOST_KEY} placeholder="Hostname" />
            <FloatingTextInput {...sharedTextProps} keyboardType='numeric' storageKey={C.PORT_KEY} placeholder="Port" />
            <SettingsSection>MQTT Topics</SettingsSection>
            <FloatingTextInput {...sharedTextProps} storageKey={C.UPDATE_TOPIC_KEY} placeholder="Update Topic" />
            <FloatingTextInput {...sharedTextProps} storageKey={C.HISTORY_REQUEST_TOPIC_KEY} placeholder="History Request Topic" />
            <FloatingTextInput {...sharedTextProps} storageKey={C.CONTROL_TOPIC_KEY} placeholder="Control Topic" />
            <FloatingTextInput {...sharedTextProps} storageKey={C.METADATA_TOPIC_KEY} placeholder="Metadata Topic" />
          </View>
        </View>
        );
  }
}

SettingsView.rowTitle = 'App Settings';
SettingsView.icon = 'settings';

module.exports = SettingsView;
