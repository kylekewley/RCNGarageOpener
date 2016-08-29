import React, { Component } from 'react';

import {
    StyleSheet,
    View,
    Text,
    AsyncStorage,
    ListView,
    RecyclerViewBackedScrollView,
    RefreshControl,
} from 'react-native';

import Menu, { MenuContext, MenuOptions, MenuOption, MenuTrigger } from 'react-native-menu';
import Icon from 'react-native-vector-icons/MaterialIcons';

var NavigationBar = require('react-native-navbar');

var styles = require('../../styles')
var DrawerButton = require('../NavBar/DrawerButton');
var CalendarButton = require('../NavBar/CalendarButton');
var NavigationTitle = require('../NavBar/NavigationTitle');

var DeviceInfo = require('react-native-device-info');

var moment = require('moment');

var DateFormat = require('dateformat');

var C = require('../../constants');

class HistoryRow {
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

class HistoryView extends Component {
  constructor(props) {
    super(props);

    var listenTopic = DeviceInfo.getUniqueID() + "/garagehistory";
    this.historyListenTopic = listenTopic;
    this._subscribeToHistoryTopics(listenTopic);

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => (!r1.equals(r2)),
                                      sectionHeaderHasChanged: (s1, s2) => s1 !== s2});

    this.currentMenuSelection = 0;

    this.state = {
      dataSource: ds,
      refreshing: false,
    }

    // Setup view to request metadata upon connection
    this.props.client.onConnect((client) => {
      this._menuOptionSelected(this.currentMenuSelection);
    });

    if (this.props.client.isConnected()) {
      // Request the metadata if we are already connected
      this._menuOptionSelected(this.currentMenuSelection);
    }
  }

  _subscribeToHistoryTopics(listenTopic) {
    this.props.client.subscribeToTopicIfNeeded(listenTopic, 2,
        this._historyHandler.bind(this));
  }

  _historyHandler(client, message) {
    var topic = message.topic;

    var data;
    try {
      data = JSON.parse(message.data);
    }catch(e) {
      console.log("Error parsing history: ", message);
      return;
    }


    var newMetaData = {};
    newMetaData['History'] = {};

    data.map((door, i) => {
      newMetaData['History'][i] = new HistoryRow(door);
    });

    this.setState({
      dataSource: this.state.dataSource.cloneWithRowsAndSections(newMetaData),
      refreshing: false,
    });
  }

  _openDateSelector() {
  }

  _requestHistory(startTimestamp, endTimestamp) {
    AsyncStorage.getItem(C.HISTORY_REQUEST_TOPIC_KEY).then((historyRequestTopic) => {
      this.setState({
        refreshing: true,
      });
      var jsonString = JSON.stringify({
        "StartUnixTime": startTimestamp,
        "EndUnixTime": endTimestamp,
        "ReturnTopic": this.historyListenTopic
      });
      this.props.client.publish(historyRequestTopic, jsonString, 2, false);
      console.log("History requested from " + startTimestamp + " to " + endTimestamp);
    });
  }

  _menuOptionSelected(index) {
    // 0 = today
    // 1 = this week
    // 2 = custom
    this.currentMenuSelection = index;
    if (index === 0) {
      var start = moment().startOf('day').unix();
      var end = moment().endOf('day').unix();
      this._requestHistory(start, end);
    }else if (index === 1) {
      var start = moment().startOf('day').subtract(7, 'days').unix();
      var end = moment().endOf('day').unix();
      this._requestHistory(start, end);
    }else if (index === 2) {
    }
  }

  componentWillUnmount() {
    if (this.historyListenTopic)
      this.props.client.removeTopicHandler(this.historyListenTopic);
  }

  _renderRow(rowData, sectionID, rowID, highlightRow) {
    var rowStyle = styles.row;

    var statusString = rowData.isClosed ? "Closed" : "Open";

    var changeDate = new Date(rowData.lastChangeTime * 1000);
    var dateString = DateFormat(changeDate, C.DATETIME_FORMAT);

    return (
          <View style={rowStyle}>
          <View>
          <Text style={styles.openerRowText}>{rowData.doorName} - {statusString} </Text>
          <Text style={styles.openerRowSubtext}>{statusString} {dateString} </Text>
          </View>
          </View>
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
      title: 'Garage History',
    };

    const statusBarConfig = {
      style: "light-content",
      tintColor:"#00796B",
    }

    const CalendarMenu = () => (
        <Menu  onSelect={this._menuOptionSelected.bind(this)}>
          <MenuTrigger style={styles.calendarButtonTouchable}>
              <Icon name="today" size={24} style={styles.iconLight} />
          </MenuTrigger>
          <MenuOptions>
            <MenuOption value={0}>
              <Text>Today</Text>
            </MenuOption>
            <MenuOption value={1}>
              <Text>This Week</Text>
            </MenuOption>
            <MenuOption value={2}>
              <Text>Custom</Text>
            </MenuOption>
          </MenuOptions>
        </Menu>
        );

    return (
        <MenuContext style={{ flex: 1 }}>
          <NavigationBar
            title={<NavigationTitle title={titleConfig.title} />}
            style={styles.navigationBar}
            statusBar={statusBarConfig}
            leftButton={ <DrawerButton onPress={() => this.props.navigator.props.openDrawer()}/>}
            rightButton={ <CalendarMenu />}
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
                onRefresh={this._menuOptionSelected.bind(this, this.currentMenuSelection)}/>}
                />
            </View>
        </MenuContext>
        );
  }
}

HistoryView.rowTitle = "History";
HistoryView.icon = "history";

module.exports = HistoryView;
