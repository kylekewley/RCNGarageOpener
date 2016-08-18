var { StyleSheet, PixelRatio } = require('react-native')

/*
 * Colors:
 *
 * Main Color:        #009688
 * Darker Main:       #00796B
 * Accent Color:      #FFAB40
 * Light Background:  #FAFAFA
 * Light Select:      #ECEEF6
 *
 */

const mainColor = '#009688';
const darkMainColor = '#00796B';
const accentColor = '#00B0FF';
const lightBackground = '#FAFAFA';
const lightSelect = '#ECEEF6';

const navBarHeight = 56;
const titleFontSize = 20;
const rowHeight = 48;
const largePadding = 24;
const defaultPadding = 16;
const thinPadding = 8;

module.exports = StyleSheet.create({

  navigationBar: {
    backgroundColor: mainColor,
    height: navBarHeight,
  },

  navigationTitleView: {
    height: navBarHeight,
    justifyContent: 'center',
    alignItems:'center',
    paddingTop: 5,
  },

  navigationBarText: {
    marginTop: 5,
    fontSize: titleFontSize,
    color:'white',
    opacity: 1.0,
    fontWeight:'bold',
  },

  mainView: {
    backgroundColor: "#fCfcFf",
  },

  iconLight: {
    color: "white",
    opacity: 1.0,
  },

  scrollView: {
    backgroundColor: '#B99BC4',
  },

  container: {
    flex: 1,
    backgroundColor: '#C5B9C9',
  },

  drawerView: {
    flex: 1,
    backgroundColor: lightBackground,
  },

  controlPanelText: {
    color:'black',
  },

  drawerHeader: {
    backgroundColor: mainColor,
  },

  drawerTitleText: {
    fontSize: titleFontSize,
    textAlign: 'center',
    margin: 25,
    color:'white',
    opacity: 1.0,
    fontWeight:'bold',
  },

  rowTouchable: {
    flexDirection: 'row',
  },

  selectedRowText: {
    color: accentColor,
    fontWeight: "bold",
    marginLeft: 26,
  },

  rowText: {
    color: "black",
    fontWeight: "bold",
    opacity: 0.87,
    marginLeft: 26,
  },

  openerRowText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 14,
    opacity: 0.87,
    marginLeft: 13,
  },

  openerRowSubtext: {
    color: "black",
    fontWeight: "normal",
    fontSize: 11,
    opacity: 0.54,
    marginLeft: 13,
  },

  selectedRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: defaultPadding,
    paddingRight: defaultPadding,
    height: rowHeight,
    backgroundColor: lightSelect,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: defaultPadding,
    paddingRight: defaultPadding,
    height: rowHeight,
  },

  activeIcon: {
    color: accentColor,
  },

  inactiveIcon: {
    opacity: 0.75,
    color: "black"
  },


  section: {
    paddingTop: 8,
  },

  sectionHeaderText: {
    fontSize: 15,
    color: 'black',
    fontWeight: '100',
    opacity: 0.54,
    marginLeft: defaultPadding,
    marginBottom: 8,
    textAlign: 'left',
  },

  sectionSeparator: {
    height: 1,
    backgroundColor: '#e5e5e5',
  },

  drawerButtonTouchable: {
    height: navBarHeight,
    justifyContent: 'center',
    alignItems:'center',
    paddingLeft: defaultPadding,
    paddingRight: defaultPadding,
  },
  drawerButton: {
    height: navBarHeight,
    justifyContent: 'center',
    alignItems:'center',
  },

  settingsContentView: {
    flex: 1,
    paddingLeft: defaultPadding,
    paddingRight: defaultPadding,
  },

  settingsSection: {
    color: 'black',
    opacity: 0.87,
    fontWeight: 'normal',
    fontSize: 20,
    marginTop: largePadding,
  },

  settingsLabel: {
    color: 'black',
    opacity: 0.38,
    fontWeight: 'normal',
    fontSize: 12,
    height: 16,
    marginTop: defaultPadding,
  },

  settingsLabelPlaceholder: {
    height: 16,
    marginTop: defaultPadding,
  },

});
