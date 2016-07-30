var { StyleSheet, PixelRatio } = require('react-native')
var deviceScreen = require('Dimensions').get('window')

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

module.exports = StyleSheet.create({

  navigationBar: {
    backgroundColor: "#009688",
    height: 56,
  },

  navigationTitleView: {
    height: 56,
    justifyContent: 'center',
    alignItems:'center',
    paddingTop: 5,
  },

  navigationBarText: {
    marginTop: 5,
    fontSize: 20,
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
    backgroundColor:'#fafafa',
  },

  controlPanelText: {
    color:'black',
  },

  drawerHeader: {
    backgroundColor: '#009688',
  },

  drawerTitleText: {
    fontSize: 20,
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
    color: "#00B0FF",
    fontWeight: "bold",
    marginLeft: 26,
  },

  rowText: {
    color: "black",
    fontWeight: "bold",
    opacity: 0.75,
    marginLeft: 26,
  },

  selectedRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 16,
    height: 48,
    backgroundColor: '#ECEEF6',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 16,
    height: 48,
  },

  activeIcon: {
    color: "#00B0FF"
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
    marginLeft: 16,
    marginBottom: 8,
    textAlign: 'left',
  },

  sectionSeparator: {
    height: 1,
    backgroundColor: '#e5e5e5',
  },

  drawerButtonTouchable: {
    height: 56,
    justifyContent: 'center',
    alignItems:'center',
    paddingLeft: 16,
    paddingRight: 16,
  },
  drawerButton: {
    height: 56,
    justifyContent: 'center',
    alignItems:'center',
  },
});
