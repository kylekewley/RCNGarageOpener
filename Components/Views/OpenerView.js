import React, { Component } from 'react';

import {
    StyleSheet,
    View,
    Text,
    ListView,
    AsyncStorage,
    RecyclerViewBackedScrollView,
    TouchableHighlight,
} from 'react-native';

var NavigationBar = require('react-native-navbar');

var styles = require('../../styles')
var DrawerButton = require('../NavBar/DrawerButton');
var NavigationTitle = require('../NavBar/NavigationTitle');

var C = require('../../constants');


class DoorRow {
  constructor(JSONObject) {
    this.doorName = JSONObject["Name"];
    this.isClosed = JSONObject["Status"]=="closed";
    this.lastChangeTime = JSONObject["LastChanged"];
  }

  equals(row2) {
    return (
        this.doorName===row2.doorName &&
        this.isClosed===row2.isClosed &&
        this.lastChangeTime===row2.lastChangeTime);
  }
}

class OpenerView extends Component {

  constructor(props) {
    super(props);

    this._subscribeToOpenerTopics();

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.equals(r2), sectionHeaderHasChanged: (s1, s2) => s1 !== s2});

    this.state = {
      dataSource: ds,
    }

    this._subscribeToOpenerTopics();

    //TODO: Remove when done testing
    var metaData = {
      Name: "arduino1",
      UTCOffset: -28800,
      IsController: true,

      Doors: [
        { "Name": "door1",
          "Status": "open",
          "LastChanged": 1234567,
        },
        { "Name": "door2",
          "Status": "closed",
          "LastChanged": 1234567,
        },
      ]
    };


    // Setup view to request metadata upon connection
    this.props.client.onConnect((client) => {
      this._requestMetadata();
      this.props.client.publish("home/garage/door/metadata", JSON.stringify(metaData), 2, false);
    });

    if (this.props.client.isConnected()) {
      // Request the metadata even if we are already connected
      this._requestMetadata();
      this.props.client.publish("home/garage/door/metadata", JSON.stringify(metaData), 2, false);
    }
  }

  /**
   * Subscribe to the two topics this view listens to
   */
  _subscribeToOpenerTopics() {
    // Get the topics from storage
    keys = [C.METADATA_TOPIC_KEY, C.UPDATE_TOPIC_KEY];

    AsyncStorage.multiGet(keys).then((results) => {
      var metadataTopic = results[0][1];
      var updateTopic = results[1][1];

      this.props.client.subscribeToTopicIfNeeded(metadataTopic, 2, this._metadataHandler.bind(this));
      this.props.client.subscribeToTopicIfNeeded(updateTopic, 2, this._updateHandler.bind(this));
    }).done();
  }

  _requestMetadata() {
    AsyncStorage.getItem(C.CONTROL_TOPIC_KEY).then((controlTopic) => {
      var request = JSON.stringify({"RequestType": "metadata"});
      this.props.client.publish(controlTopic, request, 2, false);
    }).done();
  }

  _metadataHandler(client, msg) {
    var topic = msg.topic;

    var data;
    try {
      data = JSON.parse(msg.data);


    }catch(e) {
      console.log("Error parsing metadata: ",msg);
    }

    var newMetaData = {};
    newMetaData['Doors'] = {};

    data.Doors.map((door, i) => {
      newMetaData['Doors'][door.Name] = new DoorRow(door);
    });
    console.log("Metadata: ", newMetaData);
    this.setState({
      dataSource: this.state.dataSource.cloneWithRowsAndSections(newMetaData),
    });
  }

  _updateHandler(client, msg) {
    console.log(msg);
  }

  _renderRow(rowData, sectionID, rowID, highlightRow) {
    var rowStyle = styles.row;
    var textStyle = styles.rowText;
    console.log("Render row");

    return (
        <TouchableHighlight underlayColor="#ECEEF6" >
          <View style={rowStyle}>
            <Text style={textStyle}> {rowID} </Text>
          </View>
        </TouchableHighlight>
        );
  }

  /**
   * We dont need section dividers for the door list
   */
  _renderSectionHeader(sectionData, sectionID) {
    return null;
  }

  _renderSeperator(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
    return (
      <View
        key={`${sectionID}-${rowID}`}
        style={{
          height:  1,
          backgroundColor: '#CCCCCC',
        }}
      />
    );
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
          <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow.bind(this)}
          renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
          renderSeparator={this._renderSeperator}
          renderSectionHeader={this._renderSectionHeader}
          enableEmptySections={true}
          />
        </View>
        );
  }

  componentWillUnmount() {
    this.props.client.removeTopicHandler(C.UPDATE_TOPIC_KEY);
    this.props.client.removeTopicHandler(C.METADATA_TOPIC_KEY);
  }
}

OpenerView.rowTitle = "Opener";
OpenerView.icon = "settings-remote";

module.exports = OpenerView;
