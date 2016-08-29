import React, { Component } from 'react';

import {
    StyleSheet,
    View,
    Text,
    ListView,
    AsyncStorage,
    RecyclerViewBackedScrollView,
    TouchableHighlight,
    RefreshControl,
    Alert,
} from 'react-native';

var NavigationBar = require('react-native-navbar');
var Toast = require('@remobile/react-native-toast');

var styles = require('../../styles')
var DrawerButton = require('../NavBar/DrawerButton');
var NavigationTitle = require('../NavBar/NavigationTitle');
var DateFormat = require('dateformat');

var C = require('../../constants');


class DoorRow {
  constructor(JSONObject) {
    this.doorName = JSONObject["DoorName"];
    this.isClosed = JSONObject["Status"]=="closed";
    this.lastChangeTime = JSONObject["Timestamp"];
  }

  equals(row2) {
    return (this.doorName===row2.doorName &&
            this.isClosed===row2.isClosed &&
            this.lastChangeTime===row2.lastChangeTime);
  }
}

class OpenerView extends Component {

  constructor(props) {
    super(props);

    this.metadataTopic = null;
    this.updateTopic = null;

    this._subscribeToOpenerTopics();

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => (!r1.equals(r2)),
                                      sectionHeaderHasChanged: (s1, s2) => s1 !== s2});

    this.state = {
      dataSource: ds,
      refreshing: true,
    }

    // Setup view to request metadata upon connection
    this.props.client.onConnect((client) => {
      this._requestMetadata();
    });

    if (this.props.client.isConnected()) {
      // Request the metadata if we are already connected
      this._requestMetadata();
    }
  }

  /**
   * Subscribe to the two topics this view listens to
   */
  _subscribeToOpenerTopics() {
    // Get the topics from storage
    keys = [C.METADATA_TOPIC_KEY, C.UPDATE_TOPIC_KEY];

    AsyncStorage.multiGet(keys).then((results) => {
      // Store the values so we can unsubscribe later
      this.metadataTopic = results[0][1];
      this.updateTopic = results[1][1];

      this.props.client.subscribeToTopicIfNeeded(this.metadataTopic, 2,
          this._metadataHandler.bind(this));

      this.props.client.subscribeToTopicIfNeeded(this.updateTopic, 2,
          this._updateHandler.bind(this));

    }).done();
  }

  _requestMetadata() {
    AsyncStorage.getItem(C.CONTROL_TOPIC_KEY).then((controlTopic) => {
      var request = JSON.stringify({"RequestType": "metadata"});
      this.props.client.publish(controlTopic, request, 2, false);
      console.log("Metadata requested");
    }).done();
  }

  _metadataHandler(client, msg) {
    var topic = msg.topic;

    var data;
    try {
      data = JSON.parse(msg.data);
    }catch(e) {
      console.log("Error parsing metadata: ",msg);
      return;
    }


    var newMetaData = {};
    newMetaData['Doors'] = {};

    data.Doors.map((door, i) => {
      newMetaData['Doors'][door.DoorName] = new DoorRow(door);
    });
    this.setState({
      dataSource: this.state.dataSource.cloneWithRowsAndSections(newMetaData),
      refreshing: false,
    });
  }

  _updateHandler(client, msg) {
    var data;
    try {
      data = JSON.parse(msg.data);
    }catch(e) {
      console.log("Error parsing door update", msg);
      return;
    }

    // Figure out which door to update
    var updatedDoor = data.DoorName;
    var newMetaData = {};
    newMetaData['Doors'] = {};

    for (var i = 0; i < this.state.dataSource.getRowCount(); ++i) {
      var row = this.state.dataSource.getRowData(0, i);
      if (row.doorName === updatedDoor) {
        row = new DoorRow({
          DoorName: data.DoorName,
          Status: data.Status,
          Timestamp: data.Timestamp,
        });
      }else {
        row = new DoorRow({
          DoorName: row.doorName,
          Status: row.isClosed ? "closed" : "open",
          Timestamp: row.lastChangeTime
        });
      }

      newMetaData['Doors'][row.doorName] = row;
    }

    this.setState({
      dataSource: this.state.dataSource.cloneWithRowsAndSections(newMetaData),
    });

    Toast.showShortBottom(updatedDoor + " " + data.Status);
  }

  _onRefresh() {
    this.setState({refreshing: true});
    this._requestMetadata();
  }

  _sendTriggerRequest(doorName) {

    var trigger = {"RequestType": "trigger", "Name": doorName};
    var triggerString = JSON.stringify(trigger);
    AsyncStorage.getItem(C.CONTROL_TOPIC_KEY).then((controlTopic) => {
      if (this.props.client.isConnected()) {
        this.props.client.publish(controlTopic, triggerString, 2, false);
      }else {
        Alert.alert(
            'Not Connected',
            "The request was not sent because there is no server connection.",
            [ {text: 'Okay', }]
            )
      }
    });

  }

  _renderRow(rowData, sectionID, rowID, highlightRow) {
    var rowStyle = styles.row;

    var statusString = rowData.isClosed ? "Closed" : "Open";

    var changeDate = new Date(rowData.lastChangeTime * 1000);
    var dateString = DateFormat(changeDate, C.DATETIME_FORMAT);

    return (
        <TouchableHighlight underlayColor="#ECEEF6" onPress={() => 
          { highlightRow(sectionID, rowID); this._sendTriggerRequest(rowData.doorName);}} >
          <View style={rowStyle}>
            <View>
            <Text style={styles.openerRowText}>{rowID} - {statusString} </Text>
            <Text style={styles.openerRowSubtext}>{statusString} {dateString} </Text>
            </View>
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
          <View style={{ flex: 1}}>
            <ListView
            dataSource={this.state.dataSource}
            renderRow={this._renderRow.bind(this)}
            renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
            renderSeparator={this._renderSeperator}
            renderSectionHeader={this._renderSectionHeader}
            enableEmptySections={true}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}/>}
            />
          </View>
        </View>
        );
  }

  componentWillUnmount() {
    if (this.updateTopic)
      this.props.client.removeTopicHandler(this.updateTopic);

    if (this.metadataTopic)
      this.props.client.removeTopicHandler(this.metadataTopic);
  }
}

OpenerView.rowTitle = "Opener";
OpenerView.icon = "settings-remote";

module.exports = OpenerView;
