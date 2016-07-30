import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {
  SwitchIOS,
  View,
  Text,
  TouchableHighlight,
  ListView,
  RecyclerViewBackedScrollView,
} from 'react-native';

var styles = require('../../styles')

var OpenerView = require('../Views/OpenerView');
var HistoryView = require('../Views/HistoryView');
var SettingsView = require('../Views/SettingsView');

// Define the section titles
var SECTION_VIEW = 'Views';
var SECTION_CONFIG = 'Config';

class Row {
  constructor(viewClass, selected) {
    this.viewClass = viewClass;
    this.selected = selected;
    this.icon = viewClass.icon;
  }

  equals(row2) {
    return this.viewClass === row2.viewClass && this.selected === row2.selected;
  }
}

class ViewList extends Component {

  constructor(props) {
    super(props);

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => !r1.equals(r2), sectionHeaderHasChanged: (s1, s2) => s1 !== s2});

    this.state = {
      dataSource: ds.cloneWithRowsAndSections(this._generateNewDataSource([SECTION_VIEW, OpenerView.rowTitle])),
    }
  }

  render() {
    return (
        <ListView
        dataSource={this.state.dataSource}
        renderRow={this._renderRow.bind(this)}
        renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
        renderSeparator={this._renderSeperator}
        renderSectionHeader={this._renderSectionHeader}
        />
      );
  }

  _generateNewDataSource(selectedRowPath) {
    // Placeholder for the list datasource
    var rowsAndSectionsBlob = {};

    // Setup the empty sections
    rowsAndSectionsBlob[SECTION_VIEW] = {};
    rowsAndSectionsBlob[SECTION_CONFIG] = {};

    // Fill in the rows
    rowsAndSectionsBlob[SECTION_VIEW][OpenerView.rowTitle] = new Row(OpenerView, false);
    rowsAndSectionsBlob[SECTION_VIEW][HistoryView.rowTitle] = new Row(HistoryView, false);
    rowsAndSectionsBlob[SECTION_CONFIG][SettingsView.rowTitle] = new Row(SettingsView, false);

    if (selectedRowPath != undefined) {
      rowsAndSectionsBlob[selectedRowPath[0]][selectedRowPath[1]].selected = true;
    }

    return rowsAndSectionsBlob;
  }

  _onRowPress(rowData, sectionID, rowID, highlightRow) {
    highlightRow(sectionID, rowID);

    // Refresh the datasource
    this.setState({
      dataSource: this.state.dataSource.cloneWithRowsAndSections(this._generateNewDataSource([sectionID, rowID]))
    });

    // Trigger the view to change and close the drawer
    this._pressRow(rowData);
    this.props.closeDrawer();
  }

  _renderRow(rowData, sectionID, rowID, highlightRow) {

    var rowStyle = styles.row;
    var textStyle = styles.rowText;
    var iconStyle = styles.inactiveIcon;

    if (rowData.selected) {
      rowStyle = styles.selectedRow;
      textStyle = styles.selectedRowText;
      iconStyle = styles.activeIcon;
    }

    var iconName = rowData.icon;

    return (
        <TouchableHighlight underlayColor="#ECEEF6" onPress={() => this._onRowPress(rowData, sectionID, rowID, highlightRow)}>
          <View style={rowStyle}>
            <Icon name={iconName} style={iconStyle} size={30} />
            <Text style={textStyle}> {rowID} </Text>
          </View>
        </TouchableHighlight>
        );
  }

  _pressRow(rowData) {
    this.props.switchToView(rowData.viewClass);
  }

  _renderSectionHeader(sectionData, sectionID) {
    return (
        <View
          key={`${sectionID}`}
          style={styles.section}
        ><Text style={styles.sectionHeaderText}>{sectionID} </Text>
        <View style={styles.sectionSeparator} />
        </View>
        );
  }

  _renderSeperator(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
    return (
      <View
        key={`${sectionID}-${rowID}`}
        style={{
          height:  0,
          backgroundColor: '#CCCCCC',
        }}
      />
    );
  }
}

class DrawerView extends Component {
  render(){
    return (
      <View style={styles.drawerView}>
        <View style={styles.drawerHeader}>
          <Text style={styles.drawerTitleText}>
          Garage App
          </Text>
        </View>
        <ViewList closeDrawer={this.props.closeDrawer} switchToView={this.props.switchToView}/>
      </View>
    )
  }
}

module.exports = DrawerView;
